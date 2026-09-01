export default function S07Query() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#F4F6FA' }}>
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(29,78,216,0.04) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="absolute" style={{ top: '3vh', left: '7vw' }}>
        <span style={{
          background: 'rgba(29,78,216,0.1)', border: '1px solid rgba(29,78,216,0.25)',
          borderRadius: '2vw', padding: '0.3vh 1.2vw',
          fontFamily: "'Sora', sans-serif", fontSize: '1.2vw', fontWeight: 600,
          color: '#1D4ED8', letterSpacing: '0.07em', textTransform: 'uppercase',
        }}>Demonstration</span>
      </div>
      <div className="absolute" style={{ top: '3vh', right: '5vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#94A3B8' }}>07 / 12</span>
      </div>

      {/* Title */}
      <div className="absolute" style={{ top: '9vh', left: '7vw', right: '5vw' }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '2.6vw', fontWeight: 800,
          color: '#0D1B2A', lineHeight: 1.1, marginBottom: '0.3vh',
        }}>
          Sample Query: TCF7L2 → Type 2 Diabetes → Metformin
        </h2>
        <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.55vw', color: '#64748B', marginBottom: '0.5vh' }}>
          "How does the gene TCF7L2 connect to the drug Metformin?" — a real 3-hop biomedical question
        </div>
        <div style={{ width: '5vw', height: '0.3vh', background: '#1D4ED8', marginBottom: '1.5vh' }} />
      </div>

      <div className="absolute" style={{ top: '26vh', left: '7vw', right: '5vw', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3vw' }}>

        {/* Left: before/after comparison */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>

          {/* Old way */}
          <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '0.8vw', padding: '1.2vh 1.5vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.55vw', fontWeight: 800, color: '#DC2626', marginBottom: '0.7vh' }}>
              Euclidean KG-RAG — old approach
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45vh' }}>
              {[
                'TCF7L2 → cosine similarity finds 247 nearby nodes, picks top result',
                'Context resets — picks again from flat space, forgets gene origin',
                'Cannot reach Metformin — path broken at sparse edge',
              ].map((txt, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', fontWeight: 700, color: '#DC2626', minWidth: '1.5vw' }}>{i + 1}</span>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#374151', lineHeight: 1.3 }}>{txt}</span>
                </div>
              ))}
              <div style={{ marginTop: '0.4vh', fontFamily: "'Sora', sans-serif", fontSize: '1.45vw', fontWeight: 700, color: '#DC2626' }}>
                Result: fails or hallucinates a connection
              </div>
            </div>
          </div>

          {/* New way */}
          <div style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: '0.8vw', padding: '1.2vh 1.5vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.55vw', fontWeight: 800, color: '#059669', marginBottom: '0.7vh' }}>
              RMF-RAG — my approach
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45vh' }}>
              {[
                'TCF7L2 embeds on Poincaré ball → geodesic path leads to Disease cluster',
                'Parallel transport carries gene context → arrives at Type 2 Diabetes with directional memory',
                'Curvature narrows search → Metformin found via geodesic path',
              ].map((txt, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', fontWeight: 700, color: '#059669', minWidth: '1.5vw' }}>{i + 1}</span>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#374151', lineHeight: 1.3 }}>{txt}</span>
                </div>
              ))}
              <div style={{ marginTop: '0.4vh', fontFamily: "'Sora', sans-serif", fontSize: '1.45vw', fontWeight: 700, color: '#059669' }}>
                Result: faithful 3-hop answer with full path shown
              </div>
            </div>
          </div>
        </div>

        {/* Right: Poincare disk SVG */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#64748B', marginBottom: '1vh', textAlign: 'center' }}>
            The geodesic path through the Poincaré ball
          </div>
          <svg viewBox="0 0 320 300" style={{ width: '25vw', height: '23vw' }}>
            <defs>
              <radialGradient id="diskGrad7" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(29,78,216,0.06)" />
                <stop offset="100%" stopColor="rgba(29,78,216,0.01)" />
              </radialGradient>
            </defs>
            <circle cx="160" cy="150" r="138" fill="url(#diskGrad7)" stroke="rgba(29,78,216,0.25)" strokeWidth="2" />
            <circle cx="160" cy="150" r="80" fill="none" stroke="rgba(29,78,216,0.1)" strokeWidth="1" strokeDasharray="4,3" />
            <circle cx="160" cy="150" r="40" fill="none" stroke="rgba(29,78,216,0.08)" strokeWidth="1" strokeDasharray="4,3" />
            <path d="M75 90 Q130 60 160 112" fill="none" stroke="#1D4ED8" strokeWidth="3" />
            <path d="M160 112 Q210 140 245 215" fill="none" stroke="#059669" strokeWidth="3" />
            <polygon points="157,106 163,106 160,115" fill="#1D4ED8" />
            <polygon points="241,207 249,213 243,218" fill="#059669" />
            <circle cx="75" cy="90" r="18" fill="#1D4ED8" />
            <text x="75" y="86" textAnchor="middle" fill="white" fontSize="10" fontFamily="'Sora', sans-serif" fontWeight="700">TCF7L2</text>
            <text x="75" y="99" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="8" fontFamily="'Sora', sans-serif">gene</text>
            <text x="75" y="72" textAnchor="middle" fill="#1D4ED8" fontSize="9" fontFamily="'Sora', sans-serif" fontWeight="600">Hop 1 start</text>
            <circle cx="160" cy="148" r="20" fill="#7C3AED" />
            <text x="160" y="143" textAnchor="middle" fill="white" fontSize="9" fontFamily="'Sora', sans-serif" fontWeight="700">Type 2</text>
            <text x="160" y="155" textAnchor="middle" fill="white" fontSize="9" fontFamily="'Sora', sans-serif" fontWeight="700">Diabetes</text>
            <text x="160" y="172" textAnchor="middle" fill="#7C3AED" fontSize="9" fontFamily="'Sora', sans-serif">Hop 2 waypoint</text>
            <circle cx="245" cy="230" r="18" fill="#059669" />
            <text x="245" y="226" textAnchor="middle" fill="white" fontSize="10" fontFamily="'Sora', sans-serif" fontWeight="700">Metformin</text>
            <text x="245" y="238" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="8" fontFamily="'Sora', sans-serif">drug</text>
            <text x="245" y="253" textAnchor="middle" fill="#059669" fontSize="9" fontFamily="'Sora', sans-serif">Hop 3 answer</text>
            <text x="100" y="72" fill="#1D4ED8" fontSize="9" fontFamily="'Sora', sans-serif" fontWeight="600">geodesic</text>
            <text x="204" y="178" fill="#059669" fontSize="9" fontFamily="'Sora', sans-serif" fontWeight="600">geodesic</text>
            <text x="10" y="148" fill="#64748B" fontSize="8" fontFamily="'Sora', sans-serif">context</text>
            <text x="10" y="158" fill="#64748B" fontSize="8" fontFamily="'Sora', sans-serif">carried</text>
            <line x1="50" y1="153" x2="138" y2="148" stroke="rgba(100,116,139,0.4)" strokeWidth="1" strokeDasharray="3,2" />
            <text x="160" y="298" textAnchor="middle" fill="rgba(100,116,139,0.6)" fontSize="9" fontFamily="'Sora', sans-serif">Poincaré Ball boundary</text>
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: 'linear-gradient(90deg, #1D4ED8 0%, rgba(29,78,216,0.2) 100%)' }} />
    </div>
  );
}
