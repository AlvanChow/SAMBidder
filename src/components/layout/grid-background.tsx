"use client";

export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(26, 115, 199, 0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(46, 139, 87, 0.04) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
