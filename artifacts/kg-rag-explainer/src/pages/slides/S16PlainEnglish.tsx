export default function S16PlainEnglish() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>
      <div style={{ background: '#1E1B4B', padding: '2.5vh 4vw 2vh' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#A5B4FC', marginBottom: '0.5vh' }}>RMF-RAG — IN PLAIN ENGLISH</div>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '3vw', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
          What is RMF-RAG? <span style={{ color: '#60A5FA' }}>(The simple version)</span>
        </h2>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '3vw', padding: '2.5vh 4vw', alignItems: 'stretch' }}>

        {/* Left — the core idea */}
        <div style={{ flex: '0 0 54%', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#EFF6FF', borderRadius: '0.8vw', padding: '2vh 2vw', border: '2px solid #93C5FD' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#1D4ED8', marginBottom: '0.8vh' }}>THE CORE IDEA</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.7vw', color: '#1E3A8A', lineHeight: 1.5, margin: 0 }}>
              Imagine the knowledge graph is not a flat map — it is a <strong>dome</strong>. General facts (like "drug") sit at the center. Specific facts (like "Metformin for Type 2 Diabetes") sit near the outer edge. The further from the center, the more specific the fact.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5vw', flex: 1 }}>
            <div style={{ flex: 1, background: '#F0FDF4', borderRadius: '0.8vw', padding: '1.8vh 1.8vw', border: '1px solid #86EFAC' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#15803D', marginBottom: '0.8vh' }}>Old way (all 10 papers)</div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.4vw', color: '#166534', lineHeight: 1.5, margin: 0 }}>
                Measure distance between facts in a straight line, as if the dome were flat. This makes deep facts (3 hops away) seem "far" even when they're the right answer.
              </p>
            </div>
            <div style={{ flex: 1, background: '#EFF6FF', borderRadius: '0.8vw', padding: '1.8vh 1.8vw', border: '1px solid #93C5FD' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#1D4ED8', marginBottom: '0.8vh' }}>RMF-RAG way</div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.4vw', color: '#1E40AF', lineHeight: 1.5, margin: 0 }}>
                Measure distance along the curve of the dome. Deep, specific facts are naturally reachable — the curved geometry encodes their depth automatically.
              </p>
            </div>
          </div>

          <div style={{ background: '#FFFBEB', borderRadius: '0.8vw', padding: '1.5vh 1.8vw', border: '1px solid #FDE68A' }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 700, color: '#92400E' }}>Full name: </span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.5vw', color: '#78350F' }}>Riemannian Manifold Flow RAG — "Riemannian" means curved surface, "manifold" means the mathematical shape of that surface</span>
          </div>
        </div>

        {/* Right — visual dome */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5vh' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#78716C' }}>FLAT MAP vs. DOME</div>
          <svg viewBox="0 0 320 440" style={{ width: '100%', maxHeight: '68vh' }}>
            {/* FLAT MAP */}
            <rect x="10" y="10" width="300" height="130" rx="10" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1.5" />
            <text x="160" y="35" textAnchor="middle" fill="#92400E" fontSize="12" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">FLAT MAP (old approach)</text>
            <line x1="40" y1="80" x2="280" y2="80" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="40" cy="80" r="10" fill="#2563EB" />
            <circle cx="160" cy="80" r="10" fill="#16A34A" />
            <circle cx="280" cy="80" r="10" fill="#DC2626" />
            <text x="40" y="105" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="DM Sans, sans-serif">TCF7L2</text>
            <text x="160" y="105" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="DM Sans, sans-serif">Diabetes</text>
            <text x="280" y="105" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="DM Sans, sans-serif">Metformin</text>
            <text x="160" y="125" textAnchor="middle" fill="#B45309" fontSize="10" fontFamily="DM Sans, sans-serif">All nodes seem "equally far apart"</text>

            {/* DOME */}
            <rect x="10" y="155" width="300" height="270" rx="10" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.5" />
            <text x="160" y="178" textAnchor="middle" fill="#1D4ED8" fontSize="12" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">DOME (RMF-RAG approach)</text>

            {/* Dome arc */}
            <path d="M 40 360 Q 160 200 280 360" fill="rgba(37,99,235,0.08)" stroke="#2563EB" strokeWidth="2" />

            {/* Center — general */}
            <circle cx="160" cy="280" r="14" fill="#2563EB" />
            <text x="160" y="274" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="DM Sans, sans-serif" fontWeight="bold">Drug</text>
            <text x="160" y="285" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="DM Sans, sans-serif">(general)</text>

            {/* Mid ring */}
            <circle cx="115" cy="250" r="11" fill="#16A34A" />
            <text x="115" y="246" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="DM Sans, sans-serif">Diabetes</text>
            <text x="115" y="256" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontFamily="DM Sans, sans-serif">drug</text>
            <circle cx="205" cy="250" r="11" fill="#16A34A" />
            <text x="205" y="246" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="DM Sans, sans-serif">Hypert.</text>
            <text x="205" y="256" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontFamily="DM Sans, sans-serif">drug</text>
            <line x1="160" y1="266" x2="115" y2="261" stroke="#16A34A" strokeWidth="1.5" />
            <line x1="160" y1="266" x2="205" y2="261" stroke="#16A34A" strokeWidth="1.5" />

            {/* Outer ring — specific */}
            <circle cx="80" cy="215" r="9" fill="#DC2626" />
            <text x="80" y="211" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontFamily="DM Sans, sans-serif">Metformin</text>
            <text x="80" y="220" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontFamily="DM Sans, sans-serif">(specific)</text>
            <circle cx="150" cy="210" r="9" fill="#DC2626" />
            <text x="150" y="206" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontFamily="DM Sans, sans-serif">Insulin</text>
            <text x="150" y="215" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontFamily="DM Sans, sans-serif">glargine</text>
            <line x1="115" y1="239" x2="80" y2="224" stroke="#DC2626" strokeWidth="1.2" />
            <line x1="115" y1="239" x2="150" y2="219" stroke="#DC2626" strokeWidth="1.2" />

            {/* Labels */}
            <text x="30" y="290" fill="#1D4ED8" fontSize="9" fontFamily="DM Mono, monospace">center =</text>
            <text x="30" y="302" fill="#1D4ED8" fontSize="9" fontFamily="DM Mono, monospace">general</text>
            <text x="220" y="205" fill="#DC2626" fontSize="9" fontFamily="DM Mono, monospace">edge =</text>
            <text x="220" y="217" fill="#DC2626" fontSize="9" fontFamily="DM Mono, monospace">specific</text>

            {/* Geodesic path highlight */}
            <path d="M 80 215 Q 100 245 115 250 Q 135 265 160 280" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="5,3" />
            <text x="185" y="340" fill="#B45309" fontSize="10" fontFamily="DM Sans, sans-serif">Geodesic path</text>
            <text x="185" y="353" fill="#B45309" fontSize="10" fontFamily="DM Sans, sans-serif">= follows the curve</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
