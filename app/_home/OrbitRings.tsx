export function OrbitRings() {
  return (
    <>
      {/* Outer ring */}
      <div className="absolute w-80 h-80 rounded-full border border-amber-500/20 animate-spin-slow" />
      <div
        className="absolute w-64 h-64 rounded-full border border-amber-500/10"
        style={{ animation: "spin 12s linear infinite reverse" }}
      />

      {/* Orbit dots */}
      <div className="absolute w-80 h-80 rounded-full" style={{ animation: "spin 8s linear infinite" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-500 animate-glow" />
      </div>
      <div className="absolute w-64 h-64 rounded-full" style={{ animation: "spin 12s linear infinite reverse" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400" />
      </div>
    </>
  );
}
