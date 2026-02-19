"use client";

export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 180, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 180, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0, 180, 255, 0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0, 230, 140, 0.06) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
