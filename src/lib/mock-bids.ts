export type BidStatus = "draft" | "in_review" | "submitted" | "won" | "lost";

export interface MockBid {
  id: string;
  title: string;
  solicitationNumber: string;
  agency: string;
  status: BidStatus;
  pwin: number;
  estimatedValue: string;
  dueDate: string;
  createdAt: string;
  complianceScore: number;
}

export const mockBids: MockBid[] = [
  {
    id: "draft-001",
    title: "Enterprise Cloud Migration and Modernization Services",
    solicitationNumber: "W91278-24-R-0042",
    agency: "U.S. Army Contracting Command",
    status: "draft",
    pwin: 20,
    estimatedValue: "$4.2M - $8.5M",
    dueDate: "Mar 15, 2025",
    createdAt: "Feb 18, 2025",
    complianceScore: 71,
  },
  {
    id: "bid-002",
    title: "Cybersecurity Operations Center (CSOC) Support",
    solicitationNumber: "HC1028-24-R-0015",
    agency: "DHA - Defense Health Agency",
    status: "in_review",
    pwin: 65,
    estimatedValue: "$2.1M - $3.8M",
    dueDate: "Mar 22, 2025",
    createdAt: "Feb 10, 2025",
    complianceScore: 92,
  },
  {
    id: "bid-003",
    title: "IT Infrastructure Managed Services",
    solicitationNumber: "70CMSD24R00000012",
    agency: "GSA - Federal Acquisition Service",
    status: "submitted",
    pwin: 78,
    estimatedValue: "$12M - $18M",
    dueDate: "Feb 28, 2025",
    createdAt: "Jan 20, 2025",
    complianceScore: 98,
  },
  {
    id: "bid-004",
    title: "Data Analytics Platform Development",
    solicitationNumber: "DTFAWA-24-R-00089",
    agency: "FAA - Federal Aviation Administration",
    status: "won",
    pwin: 85,
    estimatedValue: "$1.5M - $2.2M",
    dueDate: "Jan 31, 2025",
    createdAt: "Dec 15, 2024",
    complianceScore: 100,
  },
  {
    id: "bid-005",
    title: "Network Modernization & Zero Trust Architecture",
    solicitationNumber: "N00024-24-R-4421",
    agency: "NAVSEA - Naval Sea Systems Command",
    status: "lost",
    pwin: 42,
    estimatedValue: "$8M - $15M",
    dueDate: "Jan 15, 2025",
    createdAt: "Nov 28, 2024",
    complianceScore: 85,
  },
];

export const bidStatusConfig: Record<
  BidStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "border-amber-400/30 bg-amber-400/10 text-amber-400",
  },
  in_review: {
    label: "In Review",
    className: "border-neon-blue/30 bg-neon-blue/10 text-neon-blue",
  },
  submitted: {
    label: "Submitted",
    className: "border-neon-blue/30 bg-neon-blue/10 text-neon-blue",
  },
  won: {
    label: "Won",
    className: "border-neon-green/30 bg-neon-green/10 text-neon-green",
  },
  lost: {
    label: "Lost",
    className: "border-red-400/30 bg-red-400/10 text-red-400",
  },
};
