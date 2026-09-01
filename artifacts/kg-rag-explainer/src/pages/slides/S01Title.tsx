export default function S01Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex" style={{ background: '#1E1B4B' }}>
      {/* Decorative circles */}
      <div className="absolute top-[-8vh] right-[-8vw] w-[45vw] h-[45vw] rounded-full" style={{ background: 'rgba(37,99,235,0.18)' }} />
      <div className="absolute bottom-[-5vh] left-[-5vw] w-[30vw] h-[30vw] rounded-full" style={{ background: 'rgba(220,38,38,0.12)' }} />
      <div className="absolute top-[30vh] left-[38vw] w-[18vw] h-[18vw] rounded-full" style={{ background: 'rgba(234,179,8,0.09)' }} />

      {/* Left panel — main content */}
      <div className="relative z-10 flex flex-col justify-center px-[6vw] py-[6vh]" style={{ flex: '0 0 62%' }}>
        <div className="inline-flex items-center gap-[0.8vw] mb-[3vh] px-[1.2vw] py-[0.7vh] rounded-full self-start" style={{ background: 'rgba(37,99,235,0.25)', border: '1px solid rgba(37,99,235,0.5)' }}>
          <div className="w-[0.6vw] h-[0.6vw] rounded-full" style={{ background: '#60A5FA' }} />
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.2vw', color: '#93C5FD' }}>Simple Explainer — Start Here</span>
        </div>

        <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '5.2vw', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1, textWrap: 'balance' }}>
          Everything You Need<br/>to Explain
          <span style={{ color: '#60A5FA' }}> RMF-RAG</span>
        </h1>

        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '2vw', color: '#A5B4FC', marginTop: '2.5vh', lineHeight: 1.5, textWrap: 'balance' }}>
          10 methods, 10 gaps, 1 big idea —<br/>explained in plain English with a real example
        </p>

        <div style={{ marginTop: '4vh', display: 'flex', gap: '1.5vw', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.8vw', padding: '1.2vh 1.5vw' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2vw', fontWeight: 700, color: '#FFFFFF' }}>10</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#94A3B8' }}>Methods explained</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.8vw', padding: '1.2vh 1.5vw' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2vw', fontWeight: 700, color: '#FFFFFF' }}>1</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#94A3B8' }}>Novel idea</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.8vw', padding: '1.2vh 1.5vw' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2vw', fontWeight: 700, color: '#FFFFFF' }}>0</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#94A3B8' }}>Jargon required</div>
          </div>
        </div>
      </div>

      {/* Right panel — visual */}
      <div className="relative z-10 flex flex-col items-center justify-center" style={{ flex: 1 }}>
        {/* Poincaré disk teaser */}
        <svg viewBox="0 0 300 300" style={{ width: '28vw', height: '28vw' }}>
          <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(96,165,250,0.3)" strokeWidth="1.5" />
          <circle cx="150" cy="150" r="90" fill="none" stroke="rgba(96,165,250,0.15)" strokeWidth="1" />
          <circle cx="150" cy="150" r="50" fill="none" stroke="rgba(96,165,250,0.1)" strokeWidth="1" />
          {/* Center = general */}
          <circle cx="150" cy="150" r="10" fill="#60A5FA" />
          <text x="162" y="145" fill="#93C5FD" fontSize="10" fontFamily="DM Sans, sans-serif">General</text>
          {/* Mid ring */}
          <circle cx="110" cy="115" r="7" fill="rgba(96,165,250,0.7)" />
          <circle cx="190" cy="115" r="7" fill="rgba(96,165,250,0.7)" />
          <circle cx="150" cy="100" r="7" fill="rgba(96,165,250,0.7)" />
          <line x1="150" y1="150" x2="110" y2="115" stroke="rgba(96,165,250,0.4)" strokeWidth="1.5" />
          <line x1="150" y1="150" x2="190" y2="115" stroke="rgba(96,165,250,0.4)" strokeWidth="1.5" />
          <line x1="150" y1="150" x2="150" y2="100" stroke="rgba(96,165,250,0.4)" strokeWidth="1.5" />
          {/* Outer ring = specific */}
          <circle cx="70" cy="80" r="5" fill="#F472B6" />
          <circle cx="230" cy="80" r="5" fill="#F472B6" />
          <circle cx="150" cy="30" r="5" fill="#F472B6" />
          <circle cx="55" cy="180" r="5" fill="#F472B6" />
          <circle cx="245" cy="180" r="5" fill="#F472B6" />
          <line x1="110" y1="115" x2="70" y2="80" stroke="rgba(244,114,182,0.35)" strokeWidth="1" />
          <line x1="190" y1="115" x2="230" y2="80" stroke="rgba(244,114,182,0.35)" strokeWidth="1" />
          <line x1="150" y1="100" x2="150" y2="30" stroke="rgba(244,114,182,0.35)" strokeWidth="1" />
          <text x="50" y="260" fill="#64748B" fontSize="9" fontFamily="DM Sans, sans-serif">Poincaré Ball</text>
          <text x="50" y="273" fill="#64748B" fontSize="9" fontFamily="DM Sans, sans-serif">center = general, edge = specific</text>
        </svg>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#64748B', marginTop: '1vh', textAlign: 'center' }}>
          You will understand this by slide 25.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[0.4vh]" style={{ background: 'linear-gradient(90deg, #2563EB, #7C3AED, #DC2626)' }} />
    </div>
  );
}
