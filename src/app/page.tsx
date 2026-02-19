import { FileUploader } from "@/components/drop-zone/file-uploader";

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Win More <span className="text-neon-blue text-glow-blue">Government</span> Contracts
        </h1>
        <p className="mt-4 max-w-lg mx-auto text-base text-muted-foreground leading-relaxed">
          Upload your RFP and get a compliant, AI-generated proposal in minutes.
          The TurboTax for government contracting.
        </p>
      </div>
      <FileUploader />
    </div>
  );
}
