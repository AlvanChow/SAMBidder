import { Separator } from "@/components/ui/separator";

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm">
      <div className="p-5 pb-4">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Separator />
      <div className="p-5">{children}</div>
    </div>
  );
}
