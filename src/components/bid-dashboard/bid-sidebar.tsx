"use client";

import { useState } from "react";
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
import { mockRfpDetails } from "@/lib/mock-data";

interface BidSidebarProps {
  onDocumentUpload: (docType: string) => void;
  uploadedDocs: string[];
}

const rfpFields = [
  { icon: Building2, label: "Agency", value: mockRfpDetails.agency },
  { icon: Hash, label: "NAICS", value: mockRfpDetails.naicsCode },
  { icon: Shield, label: "Set-Aside", value: mockRfpDetails.setAside },
  { icon: Calendar, label: "Due Date", value: mockRfpDetails.dueDate },
  { icon: DollarSign, label: "Est. Value", value: mockRfpDetails.estimatedValue },
];

const uploadableDocuments = [
  { id: "past-performance", label: "Past Performance", pwinBoost: 25 },
  { id: "capability-statement", label: "Capability Statement", pwinBoost: 20 },
  { id: "team-resumes", label: "Team Resumes", pwinBoost: 10 },
  { id: "certifications", label: "Certifications", pwinBoost: 10 },
];

export function BidSidebar({ onDocumentUpload, uploadedDocs }: BidSidebarProps) {
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const handleUpload = async (docId: string) => {
    if (uploadedDocs.includes(docId) || uploadingDoc) return;
    setUploadingDoc(docId);
    await new Promise((r) => setTimeout(r, 800));
    onDocumentUpload(docId);
    setUploadingDoc(null);
  };

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm sticky top-20">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-navy" />
          <h2 className="text-sm font-semibold">Bid Context</h2>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium leading-snug">
            {mockRfpDetails.title}
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            {mockRfpDetails.solicitationNumber}
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
                <Button
                  key={doc.id}
                  variant="outline"
                  size="sm"
                  className={`w-full justify-start gap-2 h-9 text-xs transition-all ${
                    isUploaded
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-700"
                      : "hover:border-navy/30 hover:bg-navy-light"
                  }`}
                  onClick={() => handleUpload(doc.id)}
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
                          className={`h-3.5 w-3.5 ${
                            isUploading ? "animate-pulse" : ""
                          }`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="flex-1 text-left">{doc.label}</span>
                  {!isUploaded && (
                    <span className="text-[10px] text-navy font-medium">
                      +{doc.pwinBoost}%
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
