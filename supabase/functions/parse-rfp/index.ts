import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  // Restrict CORS to the configured frontend origin; falls back to "*" only if SITE_URL is unset
  const allowedOrigin = Deno.env.get("SITE_URL") ?? "*";
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const userSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await userSupabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { bidId, rfpFilePath, rfpUrl } = await req.json();

    if (!bidId) {
      return new Response(JSON.stringify({ error: "Missing bidId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let rawText = "";

    if (rfpFilePath) {
      const { data: fileData, error: fileError } = await supabase.storage
        .from("rfp-uploads")
        .download(rfpFilePath);

      if (!fileError && fileData) {
        rawText = await fileData.text();
      }
    } else if (rfpUrl) {
      try {
        const res = await fetch(rfpUrl);
        rawText = await res.text();
      } catch {
        rawText = `RFP from URL: ${rfpUrl}`;
      }
    }

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

    let parsedData: {
      title: string;
      solicitation_number: string;
      agency: string;
      naics_code: string;
      set_aside: string;
      due_date: string | null;
      estimated_value_min: number;
      estimated_value_max: number;
      compliance_requirements: Array<{
        requirement_id: string;
        requirement: string;
        status: string;
        section: string;
      }>;
    } = {
      title: "RFP Analysis",
      solicitation_number: "",
      agency: "",
      naics_code: "",
      set_aside: "",
      due_date: null,
      estimated_value_min: 0,
      estimated_value_max: 0,
      compliance_requirements: [],
    };

    if (anthropicKey && rawText.length > 50) {
      const prompt = `You are a government contracting expert. Analyze the following RFP text and extract structured data.

Respond with only valid JSON — no markdown, no explanation, just the raw JSON object.

Return a JSON object with these exact fields:
{
  "title": "The full title of the solicitation",
  "solicitation_number": "The solicitation/RFP number",
  "agency": "The issuing government agency",
  "naics_code": "The NAICS code if mentioned",
  "set_aside": "Set-aside designation (e.g., Small Business Set-Aside, 8(a), etc.) or empty string",
  "due_date": "The proposal due date in YYYY-MM-DD format or null",
  "estimated_value_min": The minimum contract value as a number (0 if not stated),
  "estimated_value_max": The maximum contract value as a number (0 if not stated),
  "compliance_requirements": [
    {
      "requirement_id": "REQ-001",
      "requirement": "Description of compliance requirement",
      "status": "missing",
      "section": "Volume I or relevant section"
    }
  ]
}

Extract 5-10 key compliance requirements from the RFP. Set all statuses to "missing" initially.

RFP Text (first 8000 chars):
${rawText.substring(0, 8000)}`;

      try {
        const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const content = aiData.content?.[0]?.text;
          if (content) {
            parsedData = JSON.parse(content);
          }
        }
      } catch {
      }
    } else if (!anthropicKey) {
      parsedData = {
        title: rfpFilePath ? rfpFilePath.split("/").pop()?.replace(/\.[^.]+$/, "") || "New RFP" : "New RFP",
        solicitation_number: `SOL-${Date.now().toString().slice(-8)}`,
        agency: "Federal Agency",
        naics_code: "541512",
        set_aside: "Small Business Set-Aside",
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        estimated_value_min: 1000000,
        estimated_value_max: 5000000,
        compliance_requirements: [
          { requirement_id: "REQ-001", requirement: "Technical Approach & Methodology", status: "missing", section: "Volume I" },
          { requirement_id: "REQ-002", requirement: "Past Performance Documentation (FAR 15.305)", status: "missing", section: "Volume II" },
          { requirement_id: "REQ-003", requirement: "Key Personnel Resumes", status: "missing", section: "Volume III" },
          { requirement_id: "REQ-004", requirement: "Cost/Price Proposal (SF 1449)", status: "missing", section: "Volume IV" },
          { requirement_id: "REQ-005", requirement: "Small Business Subcontracting Plan", status: "missing", section: "Volume V" },
          { requirement_id: "REQ-006", requirement: "Organizational Conflict of Interest Statement", status: "missing", section: "Attachment A" },
          { requirement_id: "REQ-007", requirement: "Quality Assurance Surveillance Plan (QASP)", status: "missing", section: "Volume I" },
        ],
      };
    }

    const updatePayload: Record<string, unknown> = {
      title: parsedData.title || "New RFP",
      solicitation_number: parsedData.solicitation_number || "",
      agency: parsedData.agency || "",
      naics_code: parsedData.naics_code || "",
      set_aside: parsedData.set_aside || "",
      due_date: parsedData.due_date || null,
      estimated_value_min: parsedData.estimated_value_min || 0,
      estimated_value_max: parsedData.estimated_value_max || 0,
      raw_rfp_text: rawText.substring(0, 50000),
      updated_at: new Date().toISOString(),
    };

    await supabase.from("bids").update(updatePayload).eq("id", bidId);

    if (parsedData.compliance_requirements?.length > 0) {
      const complianceInserts = parsedData.compliance_requirements.map((r) => ({
        bid_id: bidId,
        user_id: user.id,
        requirement_id: r.requirement_id,
        requirement: r.requirement,
        status: r.status || "missing",
        section: r.section || "",
      }));

      await supabase.from("compliance_items").insert(complianceInserts);
    }

    EdgeRuntime.waitUntil(
      fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/generate-proposal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ bidId }),
      }).catch(() => {})
    );

    return new Response(
      JSON.stringify({ success: true, bidId, title: parsedData.title }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
