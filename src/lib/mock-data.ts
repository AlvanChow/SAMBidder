export const mockComplianceMatrix = [
  {
    id: "REQ-001",
    requirement: "Past Performance Documentation (FAR 15.305)",
    status: "compliant" as const,
    section: "Volume II",
  },
  {
    id: "REQ-002",
    requirement: "Technical Approach & Methodology",
    status: "compliant" as const,
    section: "Volume I",
  },
  {
    id: "REQ-003",
    requirement: "Key Personnel Resumes",
    status: "partial" as const,
    section: "Volume III",
  },
  {
    id: "REQ-004",
    requirement: "Cost/Price Proposal (SF 1449)",
    status: "missing" as const,
    section: "Volume IV",
  },
  {
    id: "REQ-005",
    requirement: "Small Business Subcontracting Plan",
    status: "compliant" as const,
    section: "Volume V",
  },
  {
    id: "REQ-006",
    requirement: "Organizational Conflict of Interest Statement",
    status: "compliant" as const,
    section: "Attachment A",
  },
  {
    id: "REQ-007",
    requirement: "Quality Assurance Surveillance Plan (QASP)",
    status: "partial" as const,
    section: "Volume I",
  },
];

export const mockExecutiveSummary = `Acme Federal Solutions is pleased to submit this proposal in response to Solicitation No. W91278-24-R-0042, "Enterprise Cloud Migration and Modernization Services" issued by the U.S. Army Contracting Command.

With over 12 years of experience supporting federal IT modernization initiatives across DoD, DHS, and civilian agencies, Acme Federal Solutions is uniquely positioned to deliver a comprehensive cloud migration solution that meets all stated requirements while reducing total cost of ownership by an estimated 35%.

Our approach leverages a proven three-phase methodology — Assess, Migrate, Optimize — that has been successfully deployed across 47 federal engagements, migrating over 2,400 applications to FedRAMP-authorized cloud environments. Our team of 85+ cleared professionals holds an aggregate 340+ cloud certifications across AWS GovCloud, Azure Government, and Google Cloud Platform.`;

export const mockBlurredContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`;

export const mockRfpDetails = {
  title: "Enterprise Cloud Migration and Modernization Services",
  solicitationNumber: "W91278-24-R-0042",
  agency: "U.S. Army Contracting Command",
  naicsCode: "541512",
  setAside: "Small Business Set-Aside",
  dueDate: "March 15, 2025",
  estimatedValue: "$4.2M - $8.5M",
};
