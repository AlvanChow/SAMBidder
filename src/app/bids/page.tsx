import { FileText } from "lucide-react";

export default function BidsPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary mb-4">
        <FileText className="h-7 w-7 text-muted-foreground" />
      </div>
      <h1 className="text-xl font-semibold">My Bids</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm text-center">
        Your submitted and in-progress bids will appear here. Start by uploading
        an RFP on the home page.
      </p>
    </div>
  );
}
