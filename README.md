SAMBidder: Architecture & AI Handoff Document
1. System Overview & Objective
Context for the AI: You are an elite Staff Engineer tasked with completing the MVP for "SAMBidder," a B2C Product-Led Growth (PLG) SaaS operating as the "TurboTax for Government Contracting."

The Problem: Government contractors are burdened by 150+ page Request for Proposal (RFP) PDFs.
The Solution: SAMBidder allows users to upload an RFP. The system automatically "shreds" the document to extract compliance requirements ("shall" statements), calculates a gamified Probability of Win (pWin) score, and generates a compliant draft proposal.
The Business Model: The UI is free to use for analysis. Exporting the final Word/PDF proposal is locked behind a $100 Stripe one-time payment.

2. Current State of the Codebase
Frontend: A Next.js 15 (App Router) application using Tailwind CSS and Shadcn UI has been scaffolded.

UI/UX: The "Drop Zone" (file upload) and "Gamified HUD" (dashboard with pWin circular progress bar and blurred document preview) exist but are currently relying on mock data and simulated timeout delays.

Infrastructure: Supabase (Database + Auth) and Stripe (Checkout) integrations have been initialized at the UI level but require backend wiring and webhook validation.

3. Technology Stack & Hard Constraints
Framework: Next.js 15 (App Router). Strict use of React Server Components (RSC) and Server Actions where applicable.

Database: Supabase (PostgreSQL). Use @supabase/ssr for server-side auth and data fetching.

Styling: Tailwind CSS + Shadcn UI. Constraint: Do not alter the existing UI aesthetic (dark mode, neon accents).

Payments: Stripe Checkout + Webhooks.

AI & LLM Integration: OpenAI API (gpt-4o) via the Vercel AI SDK.

Document Parsing: pdf-parse (Node.js) or pdf2json. Constraint: PDF parsing must happen on the server. Next.js API routes may face timeout limits on Vercel; architect parsing logic to handle large files (e.g., chunking, background jobs, or streaming responses).

4. Phase 3 Execution Plan (Your Tasks)
Your objective is to replace the mock data with live backend infrastructure and orchestrate the AI pipeline. Execute these tasks sequentially.

Task A: Database & Auth Wiring
Supabase Client: Ensure the Supabase client is correctly instantiated for both client and server components using @supabase/ssr.

Schema Validation: Ensure the following tables exist and are typed in a types/supabase.ts file:

users: id (uuid), email (string), stripe_customer_id (string)

bids: id (uuid), user_id (uuid), rfp_title (string), status (enum: 'parsing', 'drafting', 'ready'), pwin_score (integer), compliance_matrix (jsonb), draft_content (text)

documents: id (uuid), bid_id (uuid), file_url (string), type (enum: 'rfp', 'past_performance', 'capability_statement')

RLS Policies: Enforce Row Level Security (RLS) so users can only read/write their own bids and documents.

Task B: "The Shredder" (PDF Parsing & Extraction)
This is the most critical backend feature.

File Upload Logic: Wire the drag-and-drop component to upload the PDF directly to a Supabase Storage bucket (rfp_documents).

Extraction Route (/api/shredder): Create a secure endpoint that triggers upon upload.

Parsing Pipeline:

Download the PDF buffer from Supabase Storage.

Use pdf-parse to extract the raw text.

Chunking: Government PDFs are massive. Split the extracted text into manageable chunks (e.g., 4,000 tokens) with slight overlap to prevent cutting off context.

OpenAI Compliance Extraction: Map over the chunks and send them to OpenAI (gpt-4o) using Vercel AI SDK's generateObject or standard structured outputs.

System Prompt to use: "You are an expert DoD compliance officer. Analyze this excerpt from a government RFP. Extract every requirement, specifically sentences containing 'shall', 'must', or 'required'. Output a JSON array with keys: requirement_id (string), description (string), and category (string: Security, Technical, Administrative, etc.). If no requirements exist in this chunk, return an empty array."

Aggregation: Combine the extracted JSON arrays into a single compliance_matrix and save it to the bids table in Supabase. Update the bid status to 'drafting'.

Task C: "The Draft Engine" (Proposal Generation)
Context Assembly: Once the compliance matrix is saved, fetch it along with any text extracted from the user's uploaded past_performance documents.

Generation Route (/api/generate-draft): Pass the combined context to OpenAI.

System Prompt to use: "You are an elite government proposal writer. Using the provided JSON compliance matrix and the user's past performance context, write a highly technical, persuasive, and 100% compliant proposal draft. Structure it with an Executive Summary, Technical Approach, and Past Performance mapping. Use markdown formatting."

Save & Update HUD: Save the resulting markdown to the draft_content column in the bids table. Update the pwin_score logic in the database (e.g., base 20% + 40% for successful parsing + 20% for past performance alignment).

Task D: The Stripe Webhook & Paywall
Checkout Session: Ensure the locked "Export to Word" button creates a Stripe Checkout session for $100. Pass the bid_id and user_id in the Stripe session metadata.

Webhook Handler (/api/webhooks/stripe): * Listen for checkout.session.completed.

Securely verify the Stripe signature.

Extract the bid_id from metadata.

Update a payment_status column on the bids table to 'paid'.

Export Logic: Create a server action or endpoint that converts the markdown draft_content into a downloadable .docx or .pdf file. This endpoint MUST verify that the user's auth token matches the user_id on the bid AND that the payment_status is 'paid' before returning the file.

5. Development Principles for the AI
Do not hallucinate UI components: Work within the existing Shadcn/Tailwind structures provided by the Bolt.new scaffolding.

Error Handling is paramount: Government PDFs are notoriously messy (scanned images, weird OCR). Ensure the pdf-parse pipeline has robust try/catch blocks and falls back gracefully. If a document cannot be parsed, update the UI state to inform the user cleanly.

Console Logging: Leave detailed console.log statements in the API routes for the parsing pipeline so the human developer can monitor chunking and token limits during testing.

Ask for clarification: If a Next.js App Router constraint conflicts with a requested architecture piece, pause and ask the human developer for direction.
