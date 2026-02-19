"use client";

export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-1 z-50"
        style={{
          background:
            "linear-gradient(90deg, #BF0A30 0%, #BF0A30 33%, #ffffff 33%, #ffffff 66%, #002868 66%, #002868 100%)",
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0, 40, 104, 0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(191, 10, 48, 0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-20 left-10 w-[300px] h-[300px] opacity-15"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(201, 162, 39, 0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
