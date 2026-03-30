export function OrbitRings() {
  return (
    <svg
      className="absolute w-80 h-80"
      viewBox="0 0 320 320"
      fill="none"
      aria-hidden="true"
    >
      {/* Static ring borders — rotating a circle is visually identical to not rotating it */}
      <circle cx="160" cy="160" r="159" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
      <circle cx="160" cy="160" r="127" stroke="rgba(245,158,11,0.1)" strokeWidth="1" />

      {/* Outer orbiting dot — one rotating group instead of a full div */}
      <g style={{ transformBox: 'view-box', transformOrigin: 'center', animation: 'spin 8s linear infinite', willChange: 'transform' }}>
        <circle cx="160" cy="1" r="10" fill="rgba(245,158,11,0.25)" className="animate-glow-opacity" />
        <circle cx="160" cy="1" r="5"  fill="#F59E0B" />
      </g>

      {/* Inner orbiting dot */}
      <g style={{ transformBox: 'view-box', transformOrigin: 'center', animation: 'spin 12s linear infinite reverse', willChange: 'transform' }}>
        <circle cx="160" cy="33" r="3.5" fill="#FBBF24" />
      </g>
    </svg>
  );
}
