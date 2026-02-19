export type BidStatus = "draft" | "in_review" | "submitted" | "won" | "lost";
export type ComplianceStatus = "compliant" | "partial" | "missing";
export type DocType = "past-performance" | "capability-statement" | "team-resumes" | "certifications";

export interface Profile {
  id: string;
  full_name: string;
  job_title: string;
  company_name: string;
  duns_number: string;
  uei: string;
  cage_code: string;
  primary_naics: string;
  set_aside_qualifications: string[];
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  bid_status_updates: boolean;
  due_date_reminders: boolean;
  rfp_matches: boolean;
  weekly_summary: boolean;
}

export interface Bid {
  id: string;
  user_id: string;
  title: string;
  solicitation_number: string;
  agency: string;
  naics_code: string;
  set_aside: string;
  status: BidStatus;
  pwin_score: number;
  estimated_value_min: number;
  estimated_value_max: number;
  due_date: string | null;
  compliance_score: number;
  rfp_file_path: string;
  rfp_url: string;
  raw_rfp_text: string;
  executive_summary: string;
  full_proposal: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceItem {
  id: string;
  bid_id: string;
  user_id: string;
  requirement_id: string;
  requirement: string;
  status: ComplianceStatus;
  section: string;
  created_at: string;
}

export interface BidDocument {
  id: string;
  bid_id: string;
  user_id: string;
  doc_type: DocType;
  file_path: string;
  file_name: string;
  created_at: string;
}

export interface BidWithDetails extends Bid {
  compliance_items: ComplianceItem[];
  bid_documents: BidDocument[];
}
