"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Link2, Loader2, CheckCircle2, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

type UploadState = "idle" | "uploading" | "parsing" | "complete";

const parsingSteps = [
  "Extracting document structure...",
  "Identifying compliance requirements...",
  "Mapping FAR/DFAR clauses...",
  "Analyzing evaluation criteria...",
  "Building requirement matrix...",
];

export function FileUploader() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const animateProgress = useCallback((onDone: () => void) => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 8 + 2;
      if (p >= 95) {
        p = 95;
        clearInterval(interval);
        onDone();
      }
      setProgress(Math.min(p, 95));
      if (p > 20) setState("parsing");
      setCurrentStep(Math.min(Math.floor(p / 20), parsingSteps.length - 1));
    }, 200);
    return interval;
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      if (!user) {
        router.push("/login");
        return;
      }

      setFileName(file.name);
      setError("");
      setState("uploading");
      setProgress(0);

      let intervalId: ReturnType<typeof setInterval>;
      const progressDone = new Promise<void>((resolve) => {
        intervalId = animateProgress(resolve);
      });

      const formData = new FormData();
      formData.append("file", file);

      try {
        const [res] = await Promise.all([
          fetch("/api/rfp/upload", { method: "POST", body: formData }),
          progressDone,
        ]);

        clearInterval(intervalId!);

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Upload failed");
        }

        const data = await res.json();
        setProgress(100);
        setState("complete");
        await new Promise((r) => setTimeout(r, 600));
        router.push(`/bid/${data.bidId}`);
      } catch (err) {
        clearInterval(intervalId!);
        setState("idle");
        setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      }
    },
    [router, animateProgress, user]
  );

  const handleUrlSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!user) {
        router.push("/login");
        return;
      }

      const url = urlInputRef.current?.value?.trim();
      if (!url) return;

      setFileName(url);
      setError("");
      setState("uploading");
      setProgress(0);

      let intervalId: ReturnType<typeof setInterval>;
      const progressDone = new Promise<void>((resolve) => {
        intervalId = animateProgress(resolve);
      });

      const formData = new FormData();
      formData.append("rfpUrl", url);

      try {
        const [res] = await Promise.all([
          fetch("/api/rfp/upload", { method: "POST", body: formData }),
          progressDone,
        ]);

        clearInterval(intervalId!);

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Upload failed");
        }

        const data = await res.json();
        setProgress(100);
        setState("complete");
        await new Promise((r) => setTimeout(r, 600));
        router.push(`/bid/${data.bidId}`);
      } catch (err) {
        clearInterval(intervalId!);
        setState("idle");
        setError(err instanceof Error ? err.message : "Failed to process URL. Please try again.");
      }
    },
    [router, animateProgress, user]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (state !== "idle") {
    return (
      <UploadingState state={state} progress={progress} step={currentStep} fileName={fileName} />
    );
  }

  // Unauthenticated: show sign-in prompt instead of upload zone
  if (!user) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative cursor-default rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center bg-white shadow-sm"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-light">
              <Upload className="h-7 w-7 text-navy/70" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">Upload your RFP</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Sign in to start analyzing government contracts
              </p>
            </div>
            <Link href="/login">
              <Button className="gap-2 bg-navy text-white hover:bg-navy-dark h-10 px-6">
                <LogIn className="h-4 w-4" />
                Sign in to Upload
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 bg-white shadow-sm ${
          isDragging
            ? "border-navy bg-navy-light shadow-md"
            : "border-gray-300 hover:border-navy/50 hover:shadow-md"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileSelect}
        />

        <motion.div
          animate={isDragging ? { scale: 1.05, y: -4 } : { scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex flex-col items-center gap-4"
        >
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
              isDragging ? "bg-navy/15" : "bg-navy-light"
            }`}
          >
            <Upload className={`h-7 w-7 transition-colors ${isDragging ? "text-navy" : "text-navy/70"}`} />
          </div>

          <div>
            <p className="text-lg font-semibold text-foreground">
              {isDragging ? "Drop your RFP here" : "Upload your RFP"}
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Drag & drop a PDF, or click to browse
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span>PDF, DOC, DOCX up to 20MB</span>
          </div>
        </motion.div>
      </motion.div>

      {error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground">OR PASTE A URL</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleUrlSubmit} className="mt-6 flex gap-3">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={urlInputRef}
            type="url"
            placeholder="https://sam.gov/opp/..."
            className="h-11 pl-10 bg-white border-border focus:border-navy"
          />
        </div>
        <Button type="submit" className="h-11 bg-navy text-white hover:bg-navy-dark px-6">
          Analyze
        </Button>
      </form>
    </div>
  );
}

function UploadingState({
  state,
  progress,
  step,
  fileName,
}: {
  state: UploadState;
  progress: number;
  step: number;
  fileName: string;
}) {
  const isComplete = state === "complete";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                isComplete ? "bg-success-light" : "bg-navy-light"
              }`}
            >
              {isComplete ? (
                <CheckCircle2 className="h-8 w-8 text-success" />
              ) : (
                <Loader2 className="h-8 w-8 text-navy animate-spin" />
              )}
            </div>
          </div>

          <div className="w-full text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">{fileName}</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-base font-semibold text-foreground"
              >
                {isComplete ? "Analysis complete!" : parsingSteps[step]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="w-full">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <motion.div
                className={`h-full rounded-full ${isComplete ? "bg-success" : "bg-navy"}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
