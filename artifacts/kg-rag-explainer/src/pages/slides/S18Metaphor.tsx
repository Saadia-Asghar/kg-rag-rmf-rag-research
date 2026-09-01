export default function S18Metaphor() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>
      <div style={{ background: '#1E1B4B', padding: '2.5vh 4vw 2vh' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#A5B4FC', marginBottom: '0.5vh' }}>THE KEY METAPHOR</div>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '3vw', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
          GPS navigation vs. drawing a straight line on a map
        </h2>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '3vw', padding: '3vh 4vw', alignItems: 'stretch' }}>

        {/* Left — straight line */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#FFF0F0', borderRadius: '0.8vw', padding: '2vh 2vw', border: '2px solid #FCA5A5', flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#DC2626', marginBottom: '1vh' }}>ALL 10 PAPERS: Straight-line distance</div>
            <svg viewBox="0 0 280 130" style={{ width: '100%', marginBottom: '1.5vh' }}>
              <ellipse cx="140" cy="85" rx="120" ry="55" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4,3" />
              <line x1="35" y1="65" x2="245" y2="65" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
              <circle cx="35" cy="65" r="7" fill="#2563EB" />
              <circle cx="245" cy="65" r="7" fill="#DC2626" />
              <text x="35" y="82" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="DM Sans, sans-serif">New York</text>
              <text x="245" y="82" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="DM Sans, sans-serif">London</text>
              <text x="140" y="50" textAnchor="middle" fill="#DC2626" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="bold">Straight line through Earth</text>
              <text x="140" y="105" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="DM Sans, sans-serif">5,570 km — impossible to fly</text>
            </svg>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.45vw', color: '#991B1B', lineHeight: 1.5, margin: 0 }}>
              Euclidean distance measures the straight line through the middle of the Earth. Mathematically clean. Physically impossible. In a knowledge graph: it ignores the curved hierarchical structure, making deep facts seem "far" when they're actually reachable by following the structure.
            </p>
          </div>
        </div>

        {/* Middle — vs */}
        <div style={{ flex: '0 0 8%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '3vw', fontWeight: 800, color: '#94A3B8' }}>vs</div>
        </div>

        {/* Right — GPS */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#EFF6FF', borderRadius: '0.8vw', padding: '2vh 2vw', border: '2px solid #93C5FD', flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#1D4ED8', marginBottom: '1vh' }}>RMF-RAG: Geodesic distance (GPS)</div>
            <svg viewBox="0 0 280 130" style={{ width: '100%', marginBottom: '1.5vh' }}>
              <ellipse cx="140" cy="85" rx="120" ry="55" fill="rgba(37,99,235,0.06)" stroke="#2563EB" strokeWidth="1.5" />
              <path d="M 35 65 Q 140 -10 245 65" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
              <circle cx="35" cy="65" r="7" fill="#2563EB" />
              <circle cx="245" cy="65" r="7" fill="#16A34A" />
              <text x="35" y="82" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="DM Sans, sans-serif">New York</text>
              <text x="245" y="82" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="DM Sans, sans-serif">London</text>
              <text x="140" y="20" textAnchor="middle" fill="#2563EB" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="bold">Great circle arc</text>
              <text x="140" y="105" textAnchor="middle" fill="#16A34A" fontSize="10" fontFamily="DM Sans, sans-serif">5,571 km — the real flight path</text>
            </svg>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.45vw', color: '#1E40AF', lineHeight: 1.5, margin: 0 }}>
              GPS uses the great-circle arc — the shortest path along the curved surface of the Earth. RMF-RAG does the same for knowledge graphs: measures distance along the curved surface of the Poincaré ball, following the hierarchy rather than ignoring it.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom callout */}
      <div style={{ margin: '0 4vw 2.5vh', background: '#FFFBEB', borderRadius: '0.8vw', padding: '1.5vh 2vw', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 700, color: '#92400E', flexShrink: 0 }}>Bottom line:</div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.5vw', color: '#78350F', margin: 0, lineHeight: 1.4 }}>
          The Earth is round — you need curved geometry to navigate it. Knowledge graphs are hierarchical — you need curved geometry to navigate them. RMF-RAG provides that geometry.
        </p>
      </div>
    </div>
  );
}
