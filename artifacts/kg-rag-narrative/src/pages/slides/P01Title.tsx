export default function P01Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex" style={{ background: '#0E1420' }}>
      {/* Dot-grid texture */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(248,250,252,0.04) 1px, transparent 0)',
        backgroundSize: '48px 48px'
      }} />

      {/* Amber top-left corner accent */}
      <div className="absolute top-0 left-0" style={{
        width: '35vw', height: '35vw',
        background: 'radial-gradient(circle at 0% 0%, rgba(245,158,11,0.08) 0%, transparent 65%)'
      }} />

      {/* Left content panel */}
      <div className="relative z-10 flex flex-col justify-center px-[7vw] py-[6vh]" style={{ flex: '0 0 57%' }}>

        {/* Badge */}
        <div className="inline-flex items-center gap-[0.7vw] mb-[3.5vh] self-start px-[1.2vw] py-[0.5vh] rounded-full"
          style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)' }}>
          <div className="rounded-full" style={{ width: '0.5vw', height: '0.5vw', background: '#F59E0B' }} />
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.1vw', color: '#F59E0B', letterSpacing: '0.08em' }}>
            INVESTIGATION SERIES
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '5.2vw', fontWeight: 700,
          color: '#F8FAFC', lineHeight: 1.08, marginBottom: '2.5vh', textWrap: 'balance'
        }}>
          The Gap in<br />Knowledge Graph<br />Reasoning
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '2vw', color: '#94A3B8',
          lineHeight: 1.5, marginBottom: '4.5vh'
        }}>
          10 papers. 10 methodologies.<br />1 recurring blind spot.
        </p>

        {/* Stat pills */}
        <div style={{ display: 'flex', gap: '1.2vw' }}>
          <div style={{
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.28)',
            borderRadius: '0.6vw', padding: '0.9vh 1.4vw'
          }}>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '2.1vw', fontWeight: 700, color: '#F59E0B' }}>10</div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.2vw', color: '#64748B' }}>Papers reviewed</div>
          </div>
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)',
            borderRadius: '0.6vw', padding: '0.9vh 1.4vw'
          }}>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '2.1vw', fontWeight: 700, color: '#EF4444' }}>1</div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.2vw', color: '#64748B' }}>Shared blind spot</div>
          </div>
          <div style={{
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.28)',
            borderRadius: '0.6vw', padding: '0.9vh 1.4vw'
          }}>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '2.1vw', fontWeight: 700, color: '#10B981' }}>1</div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.2vw', color: '#64748B' }}>Solution found</div>
          </div>
        </div>
      </div>

      {/* Right: SVG network visualization */}
      <div className="relative z-10 flex items-center justify-center" style={{ flex: 1 }}>
        <svg viewBox="0 0 400 400" style={{ width: '30vw', height: '30vw' }}>
          <defs>
            <radialGradient id="ng01" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(245,158,11,0.07)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="185" fill="url(#ng01)" />

          {/* Ring edges amber → center crimson */}
          <line x1="200" y1="60" x2="200" y2="200" stroke="rgba(245,158,11,0.3)" strokeWidth="1.2" strokeDasharray="5,4" />
          <line x1="342" y1="130" x2="200" y2="200" stroke="rgba(245,158,11,0.3)" strokeWidth="1.2" strokeDasharray="5,4" />
          <line x1="340" y1="270" x2="200" y2="200" stroke="rgba(245,158,11,0.3)" strokeWidth="1.2" strokeDasharray="5,4" />
          <line x1="200" y1="342" x2="200" y2="200" stroke="rgba(245,158,11,0.3)" strokeWidth="1.2" strokeDasharray="5,4" />
          <line x1="58" y1="270" x2="200" y2="200" stroke="rgba(245,158,11,0.3)" strokeWidth="1.2" strokeDasharray="5,4" />
          <line x1="58" y1="130" x2="200" y2="200" stroke="rgba(245,158,11,0.3)" strokeWidth="1.2" strokeDasharray="5,4" />
          <line x1="285" y1="68" x2="200" y2="200" stroke="rgba(245,158,11,0.2)" strokeWidth="1" strokeDasharray="5,4" />
          <line x1="115" y1="68" x2="200" y2="200" stroke="rgba(245,158,11,0.2)" strokeWidth="1" strokeDasharray="5,4" />
          <line x1="358" y1="198" x2="200" y2="200" stroke="rgba(245,158,11,0.2)" strokeWidth="1" strokeDasharray="5,4" />
          <line x1="42" y1="198" x2="200" y2="200" stroke="rgba(245,158,11,0.2)" strokeWidth="1" strokeDasharray="5,4" />

          {/* Outer nodes — amber */}
          <circle cx="200" cy="60" r="9" fill="rgba(245,158,11,0.75)" />
          <circle cx="342" cy="130" r="9" fill="rgba(245,158,11,0.75)" />
          <circle cx="340" cy="270" r="9" fill="rgba(245,158,11,0.75)" />
          <circle cx="200" cy="342" r="9" fill="rgba(245,158,11,0.75)" />
          <circle cx="58" cy="270" r="9" fill="rgba(245,158,11,0.75)" />
          <circle cx="58" cy="130" r="9" fill="rgba(245,158,11,0.75)" />
          <circle cx="285" cy="68" r="7" fill="rgba(245,158,11,0.5)" />
          <circle cx="115" cy="68" r="7" fill="rgba(245,158,11,0.5)" />
          <circle cx="358" cy="198" r="7" fill="rgba(245,158,11,0.5)" />
          <circle cx="42" cy="198" r="7" fill="rgba(245,158,11,0.5)" />

          {/* Center node — crimson gap */}
          <circle cx="200" cy="200" r="22" fill="rgba(239,68,68,0.2)" />
          <circle cx="200" cy="200" r="16" fill="rgba(239,68,68,0.85)" />
          <text x="200" y="206" textAnchor="middle" fill="white" fontSize="16" fontFamily="IBM Plex Mono, monospace" fontWeight="500">?</text>

          {/* Paper labels */}
          <text x="200" y="46" textAnchor="middle" fill="rgba(148,163,184,0.7)" fontSize="9" fontFamily="IBM Plex Mono, monospace">D-RAG</text>
          <text x="355" y="127" fill="rgba(148,163,184,0.7)" fontSize="9" fontFamily="IBM Plex Mono, monospace">CogGRAG</text>
          <text x="352" y="280" fill="rgba(148,163,184,0.7)" fontSize="9" fontFamily="IBM Plex Mono, monospace">Goal-KG</text>
          <text x="163" y="360" fill="rgba(148,163,184,0.7)" fontSize="9" fontFamily="IBM Plex Mono, monospace">M³KG-RAG</text>
          <text x="2" y="284" fill="rgba(148,163,184,0.7)" fontSize="9" fontFamily="IBM Plex Mono, monospace">SG-RAG</text>
          <text x="6" y="127" fill="rgba(148,163,184,0.7)" fontSize="9" fontFamily="IBM Plex Mono, monospace">HyKGE</text>
          <text x="290" y="61" fill="rgba(148,163,184,0.5)" fontSize="8" fontFamily="IBM Plex Mono, monospace">GraphFlow</text>
          <text x="60" y="61" fill="rgba(148,163,184,0.5)" fontSize="8" fontFamily="IBM Plex Mono, monospace">KG-RAG</text>
          <text x="363" y="193" fill="rgba(148,163,184,0.5)" fontSize="8" fontFamily="IBM Plex Mono, monospace">KRAGEN</text>
          <text x="0" y="193" fill="rgba(148,163,184,0.5)" fontSize="8" fontFamily="IBM Plex Mono, monospace">KG²RAG</text>

          <text x="200" y="220" textAnchor="middle" fill="rgba(239,68,68,0.5)" fontSize="8" fontFamily="IBM Plex Mono, monospace">blind spot</text>
        </svg>
      </div>

      {/* Bottom amber gradient line */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.35vh', background: 'linear-gradient(90deg, transparent 0%, #F59E0B 50%, transparent 100%)' }} />
    </div>
  );
}
