export default function P14BlindSpot() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex" style={{ background: '#0E1420' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 50%, rgba(239,68,68,0.05) 0%, transparent 60%)' }} />

      {/* Left: text explanation */}
      <div className="relative z-10 flex flex-col justify-center px-[7vw] py-[5vh]" style={{ flex: '0 0 52%' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#EF4444', letterSpacing: '0.1em', marginBottom: '1.5vh' }}>
          THE SHARED BLIND SPOT
        </div>
        <h2 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '3.4vw', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.15, marginBottom: '3.5vh' }}>
          Hierarchical knowledge lives on a curved surface
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.5vw', height: '0.5vw', borderRadius: '50%', background: '#EF4444', marginTop: '0.8vh', flexShrink: 0 }} />
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.7vw', color: '#F8FAFC', lineHeight: 1.5 }}>
              Knowledge graphs are not flat. Concept hierarchies are inherently tree-like.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.5vw', height: '0.5vw', borderRadius: '50%', background: '#EF4444', marginTop: '0.8vh', flexShrink: 0 }} />
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.7vw', color: '#F8FAFC', lineHeight: 1.5 }}>
              Tree-like structures embed with <span style={{ color: '#10B981', fontWeight: 600 }}>zero distortion</span> in hyperbolic space — but <span style={{ color: '#EF4444', fontWeight: 600 }}>near-infinite distortion</span> in Euclidean space.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.5vw', height: '0.5vw', borderRadius: '50%', background: '#EF4444', marginTop: '0.8vh', flexShrink: 0 }} />
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.7vw', color: '#F8FAFC', lineHeight: 1.5 }}>
              In flat space: Gene, TCF7L2, and its variants all sit at equal distances. Hierarchy is lost.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.5vw', height: '0.5vw', borderRadius: '50%', background: '#EF4444', marginTop: '0.8vh', flexShrink: 0 }} />
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.7vw', color: '#F8FAFC', lineHeight: 1.5 }}>
              Every paper above measured distances in the wrong geometry.
            </div>
          </div>
        </div>

        <div style={{ marginTop: '3.5vh', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.6vw', padding: '1.5vh 1.8vw' }}>
          <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.7vw', fontWeight: 600, color: '#FCA5A5' }}>
            This is not a tuning problem. It is a representation problem.
          </div>
        </div>
      </div>

      {/* Right: SVG comparison */}
      <div className="relative z-10 flex flex-col items-center justify-center" style={{ flex: 1, gap: '3vh' }}>
        {/* Euclidean — flat grid */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#EF4444', marginBottom: '1vh', letterSpacing: '0.06em' }}>EUCLIDEAN — FLAT</div>
          <svg viewBox="0 0 200 120" style={{ width: '20vw', height: '12vw' }}>
            <line x1="20" y1="60" x2="180" y2="60" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
            <line x1="100" y1="20" x2="100" y2="100" stroke="rgba(239,68,68,0.2)" strokeWidth="0.8" />
            <circle cx="40" cy="60" r="7" fill="rgba(239,68,68,0.7)" />
            <circle cx="100" cy="60" r="7" fill="rgba(239,68,68,0.7)" />
            <circle cx="160" cy="60" r="7" fill="rgba(239,68,68,0.7)" />
            <text x="40" y="80" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="IBM Plex Mono">Gene</text>
            <text x="100" y="80" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="IBM Plex Mono">TCF7L2</text>
            <text x="160" y="80" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="IBM Plex Mono">Variant</text>
            <text x="40" y="47" textAnchor="middle" fill="#EF4444" fontSize="8" fontFamily="IBM Plex Mono">d=1</text>
            <text x="130" y="47" textAnchor="middle" fill="#EF4444" fontSize="8" fontFamily="IBM Plex Mono">d=1</text>
          </svg>
          <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.2vw', color: '#64748B', marginTop: '0.5vh' }}>All distances equal — hierarchy invisible</div>
        </div>

        <div style={{ width: '60%', height: '1px', background: 'rgba(248,250,252,0.08)' }} />

        {/* Hyperbolic — curved */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#10B981', marginBottom: '1vh', letterSpacing: '0.06em' }}>HYPERBOLIC — CURVED</div>
          <svg viewBox="0 0 200 160" style={{ width: '20vw', height: '16vw' }}>
            <circle cx="100" cy="80" r="72" fill="none" stroke="rgba(16,185,129,0.25)" strokeWidth="1" />
            <circle cx="100" cy="80" r="45" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="0.8" />
            <circle cx="100" cy="80" r="20" fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth="0.8" />
            {/* Gene at center */}
            <circle cx="100" cy="80" r="9" fill="rgba(16,185,129,0.85)" />
            <text x="100" y="83" textAnchor="middle" fill="white" fontSize="7" fontFamily="IBM Plex Mono">Gene</text>
            {/* TCF7L2 at mid ring */}
            <circle cx="100" cy="36" r="7" fill="rgba(16,185,129,0.65)" />
            <text x="100" y="26" textAnchor="middle" fill="#6EE7B7" fontSize="8" fontFamily="IBM Plex Mono">TCF7L2</text>
            <line x1="100" y1="61" x2="100" y2="43" stroke="rgba(16,185,129,0.4)" strokeWidth="1.2" />
            {/* Variant at outer ring */}
            <circle cx="100" cy="10" r="5" fill="rgba(16,185,129,0.45)" />
            <text x="100" y="6" textAnchor="middle" fill="#6EE7B7" fontSize="7" fontFamily="IBM Plex Mono">Variant</text>
            <line x1="100" y1="29" x2="100" y2="15" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
          </svg>
          <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.2vw', color: '#6EE7B7', marginTop: '0.5vh' }}>Hierarchy preserved — center is general, edge is specific</div>
        </div>
      </div>
    </div>
  );
}
