"use client";

import { useState, useRef } from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  Building2,
  Calendar,
  DollarSign,
  Hash,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { BidWithDetails } from "@/lib/supabase/types";

interface BidSidebarProps {
  bid: BidWithDetails;
  onDocumentUpload: (docType: string, file: File) => Promise<void>;
  uploadedDocs: string[];
}

function formatValue(min: number, max: number): string {
  if (!min && !max) return "TBD";
  const fmt = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`;
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  return fmt(min || max);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "TBD";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const uploadableDocuments = [
  { id: "past-performance", label: "Past Performance", pwinBoost: 25 },
  { id: "capability-statement", label: "Capability Statement", pwinBoost: 20 },
  { id: "team-resumes", label: "Team Resumes", pwinBoost: 10 },
  { id: "certifications", label: "Certifications", pwinBoost: 10 },
];

export function BidSidebar({ bid, onDocumentUpload, uploadedDocs }: BidSidebarProps) {
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const rfpFields = [
    { icon: Building2, label: "Agency", value: bid.agency || "—" },
    { icon: Hash, label: "NAICS", value: bid.naics_code || "—" },
    { icon: Shield, label: "Set-Aside", value: bid.set_aside || "—" },
    { icon: Calendar, label: "Due Date", value: formatDate(bid.due_date) },
    {
      icon: DollarSign,
      label: "Est. Value",
      value: formatValue(bid.estimated_value_min, bid.estimated_value_max),
    },
  ];

  const handleUploadClick = (docId: string) => {
    if (uploadedDocs.includes(docId) || uploadingDoc) return;
    fileInputRefs.current[docId]?.click();
  };

  const handleFileChange = async (
    docId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(docId);
    try {
      await onDocumentUpload(docId, file);
    } finally {
      setUploadingDoc(null);
      if (fileInputRefs.current[docId]) {
        fileInputRefs.current[docId]!.value = "";
      }
    }
  };

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm sticky top-20">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-navy" />
          <h2 className="text-sm font-semibold">Bid Context</h2>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium leading-snug">{bid.title}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {bid.solicitation_number || "—"}
          </p>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2.5">
          {rfpFields.map((field) => (
            <div key={field.label} className="flex items-start gap-2.5">
              <field.icon className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">{field.label}</p>
                <p className="text-xs font-medium truncate">{field.value}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Upload Documents
          </p>
          <div className="space-y-2">
            {uploadableDocuments.map((doc) => {
              const isUploaded = uploadedDocs.includes(doc.id);
              const isUploading = uploadingDoc === doc.id;

              return (
                <div key={doc.id}>
                  <input
                    ref={(el) => {
                      fileInputRefs.current[doc.id] = el;
                    }}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFileChange(doc.id, e)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-full justify-start gap-2 h-9 text-xs transition-all ${
                      isUploaded
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-700"
                        : "hover:border-navy/30 hover:bg-navy-light"
                    }`}
                    onClick={() => handleUploadClick(doc.id)}
                    disabled={isUploading}
                  >
                    <AnimatePresence mode="wait">
                      {isUploaded ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="upload"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Upload
                            className={`h-3.5 w-3.5 ${isUploading ? "animate-pulse" : ""}`}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <span className="flex-1 text-left">
                      {isUploading ? "Uploading..." : doc.label}
                    </span>
                    {!isUploaded && (
                      <span className="text-[10px] text-navy font-medium">
                        +{doc.pwinBoost}%
                      </span>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
