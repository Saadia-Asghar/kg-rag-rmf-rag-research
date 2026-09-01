export default function P16Solution() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex" style={{ background: '#071410' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(16,185,129,0.08) 0%, transparent 60%)' }} />

      {/* Left: pipeline steps + formula */}
      <div className="relative z-10 flex flex-col justify-center px-[7vw] py-[5vh]" style={{ flex: '0 0 55%' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#6EE7B7', letterSpacing: '0.1em', marginBottom: '1.5vh' }}>
          THE SOLUTION
        </div>
        <h2 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '3.2vw', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.1, marginBottom: '3vh' }}>
          Poincare Ball + Geodesic Retrieval Pipeline
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4vh', marginBottom: '3vh' }}>
          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center', background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.6vw', padding: '1.2vh 1.5vw' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.8vw', fontWeight: 700, color: '#10B981', flexShrink: 0, width: '2vw' }}>1</div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.6vw', color: '#F8FAFC', lineHeight: 1.4 }}>
              Embed all KG entities in a Poincare ball using <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#6EE7B7' }}>geoopt</span> + Riemannian SGD
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center', background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.6vw', padding: '1.2vh 1.5vw' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.8vw', fontWeight: 700, color: '#10B981', flexShrink: 0, width: '2vw' }}>2</div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.6vw', color: '#F8FAFC', lineHeight: 1.4 }}>
              Project the query into the same manifold at inference time
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center', background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.6vw', padding: '1.2vh 1.5vw' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.8vw', fontWeight: 700, color: '#10B981', flexShrink: 0, width: '2vw' }}>3</div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.6vw', color: '#F8FAFC', lineHeight: 1.4 }}>
              Retrieve nearest neighbours via <span style={{ color: '#10B981', fontWeight: 600 }}>geodesic distance</span> — not cosine similarity
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center', background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.6vw', padding: '1.2vh 1.5vw' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.8vw', fontWeight: 700, color: '#10B981', flexShrink: 0, width: '2vw' }}>4</div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.6vw', color: '#F8FAFC', lineHeight: 1.4 }}>
              Traverse hops along the manifold — each hop stays geometrically coherent
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center', background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.6vw', padding: '1.2vh 1.5vw' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.8vw', fontWeight: 700, color: '#10B981', flexShrink: 0, width: '2vw' }}>5</div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.6vw', color: '#F8FAFC', lineHeight: 1.4 }}>
              Score paths by accumulated geodesic distance — shorter = semantically tighter
            </div>
          </div>
        </div>

        {/* Formula */}
        <div style={{ background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '0.6vw', padding: '1.5vh 1.8vw' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.9vw', color: '#6EE7B7', marginBottom: '0.6vh', letterSpacing: '0.06em' }}>GEODESIC DISTANCE</div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.5vw', color: '#A7F3D0', letterSpacing: '0.02em' }}>
            d(u,v) = arcosh(1 + 2||u-v||² / ((1-||u||²)(1-||v||²)))
          </div>
        </div>
      </div>

      {/* Right: Poincare disk with hop path */}
      <div className="relative z-10 flex items-center justify-center" style={{ flex: 1 }}>
        <div style={{ textAlign: 'center' }}>
          <svg viewBox="0 0 280 280" style={{ width: '26vw', height: '26vw' }}>
            <defs>
              <radialGradient id="diskGlow2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(16,185,129,0.12)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <circle cx="140" cy="140" r="128" fill="url(#diskGlow2)" />
            <circle cx="140" cy="140" r="126" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
            <circle cx="140" cy="140" r="84" fill="none" stroke="rgba(16,185,129,0.18)" strokeWidth="0.8" />
            <circle cx="140" cy="140" r="46" fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="0.8" />

            {/* Geodesic path Gene -> Disease -> Drug */}
            <path d="M 140 140 Q 140 96 140 56" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="5,3" />
            <path d="M 140 56 Q 190 32 218 14" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="5,3" />

            {/* Gene center */}
            <circle cx="140" cy="140" r="14" fill="rgba(16,185,129,0.9)" />
            <text x="140" y="144" textAnchor="middle" fill="white" fontSize="9" fontFamily="IBM Plex Mono">Gene</text>

            {/* Disease mid */}
            <circle cx="140" cy="58" r="11" fill="rgba(16,185,129,0.7)" />
            <text x="140" y="44" textAnchor="middle" fill="#6EE7B7" fontSize="9" fontFamily="IBM Plex Mono">Disease</text>

            {/* Drug outer */}
            <circle cx="215" cy="16" r="8" fill="rgba(16,185,129,0.5)" />
            <text x="218" y="9" fill="#A7F3D0" fontSize="8" fontFamily="IBM Plex Mono">Drug</text>

            {/* Hop labels */}
            <text x="155" y="102" fill="#6EE7B7" fontSize="8" fontFamily="IBM Plex Mono">hop 1</text>
            <text x="182" y="44" fill="#6EE7B7" fontSize="8" fontFamily="IBM Plex Mono">hop 2</text>

            <text x="140" y="268" textAnchor="middle" fill="rgba(110,231,183,0.5)" fontSize="8" fontFamily="IBM Plex Mono">Poincare disk — gene to drug via geodesic</text>
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.35vh', background: 'linear-gradient(90deg, transparent 0%, #10B981 50%, transparent 100%)' }} />
    </div>
  );
}
