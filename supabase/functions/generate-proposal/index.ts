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

    const { bidId } = await req.json();
    if (!bidId) {
      return new Response(JSON.stringify({ error: "Missing bidId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: bid } = await supabase
      .from("bids")
      .select("*, compliance_items(*)")
      .eq("id", bidId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!bid) {
      return new Response(JSON.stringify({ error: "Bid not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    const companyName = profile?.company_name || "Your Company";
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

    let executiveSummary = "";
    let fullProposal = "";

    if (anthropicKey) {
      const summaryPrompt = `You are a professional government proposal writer. Write a compelling executive summary for this government contract proposal.

Solicitation: ${bid.title}
Agency: ${bid.agency}
Solicitation Number: ${bid.solicitation_number}
NAICS Code: ${bid.naics_code}
Set-Aside: ${bid.set_aside}
Company: ${companyName}

Write a 3-4 paragraph executive summary that is professional, compelling, and highlights key qualifications. Do not use placeholders - write actual persuasive content. Keep it under 400 words.`;

      try {
        const summaryRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 600,
            messages: [{ role: "user", content: summaryPrompt }],
          }),
        });

        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          executiveSummary = summaryData.content?.[0]?.text || "";
        }
      } catch {
      }

      const proposalPrompt = `You are a professional government proposal writer. Write a comprehensive proposal draft for this government contract.

Solicitation: ${bid.title}
Agency: ${bid.agency}
Solicitation Number: ${bid.solicitation_number}
Company: ${companyName}
Set-Aside: ${bid.set_aside}

Write sections:
1.0 Technical Approach
2.0 Management Approach
3.0 Staffing Plan
4.0 Past Performance Summary
5.0 Quality Assurance

Each section should be substantive (150-200 words). Use professional government contracting language.`;

      try {
        const proposalRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 2000,
            messages: [{ role: "user", content: proposalPrompt }],
          }),
        });

        if (proposalRes.ok) {
          const proposalData = await proposalRes.json();
          fullProposal = proposalData.content?.[0]?.text || "";
        }
      } catch {
      }
    } else {
      executiveSummary = `${companyName} is pleased to submit this proposal in response to Solicitation No. ${bid.solicitation_number}, "${bid.title}" issued by ${bid.agency}.

With deep expertise in federal contracting and a proven track record of delivering mission-critical solutions, ${companyName} is uniquely positioned to meet all stated requirements while providing exceptional value to the government.

Our approach leverages a proven methodology that has been successfully deployed across numerous federal engagements. Our team of cleared professionals holds extensive certifications and brings decades of combined experience supporting federal missions.

We are committed to delivering on-time, within budget, and in full compliance with all applicable regulations including FAR, DFARS, and agency-specific requirements.`;

      fullProposal = `1.0 Technical Approach

${companyName} will employ a comprehensive technical approach tailored specifically to the requirements outlined in ${bid.solicitation_number}. Our methodology is grounded in federal best practices and proven frameworks that ensure successful delivery.

2.0 Management Approach

Our management structure provides clear lines of authority and accountability. The Program Manager will serve as the single point of contact for all contract matters and will maintain direct communication with the Contracting Officer's Representative (COR).

3.0 Staffing Plan

${companyName} will staff this contract with qualified, cleared personnel who meet or exceed all requirements. Key personnel have been identified and are committed to this effort from day one of contract award.

4.0 Past Performance Summary

${companyName} has successfully performed on contracts of similar scope, complexity, and dollar value for federal agencies. Our past performance demonstrates consistent delivery of high-quality results.

5.0 Quality Assurance

We maintain a robust Quality Management System aligned with ISO 9001 standards. All deliverables undergo rigorous review before submission to ensure they meet or exceed contract requirements.`;
    }

    const complianceScore = bid.compliance_items?.length > 0
      ? Math.round(
          (bid.compliance_items.filter((c: { status: string }) => c.status === "compliant").length /
            bid.compliance_items.length) *
            100
        )
      : 0;

    await supabase
      .from("bids")
      .update({
        executive_summary: executiveSummary,
        full_proposal: fullProposal,
        compliance_score: complianceScore,
        status: "draft",
        updated_at: new Date().toISOString(),
      })
      .eq("id", bidId)
      .eq("user_id", user.id);

    return new Response(
      JSON.stringify({ success: true, bidId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
