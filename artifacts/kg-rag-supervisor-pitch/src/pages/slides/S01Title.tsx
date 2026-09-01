export default function S01Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#F4F6FA' }}>

      {/* Subtle background texture */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(29,78,216,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      {/* Cobalt corner accent */}
      <div className="absolute top-0 left-0" style={{
        width: '40vw', height: '40vh',
        background: 'radial-gradient(circle at 0% 0%, rgba(29,78,216,0.07) 0%, transparent 70%)',
      }} />

      {/* Top label */}
      <div className="absolute" style={{ top: '4vh', left: '7vw' }}>
        <span style={{
          fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', fontWeight: 600,
          color: '#1D4ED8', letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Research Proposal Presentation
        </span>
      </div>

      {/* Slide number */}
      <div className="absolute" style={{ top: '4vh', right: '5vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#94A3B8' }}>01 / 12</span>
      </div>

      {/* Left content */}
      <div className="absolute flex flex-col justify-center" style={{ top: 0, left: 0, bottom: 0, width: '58%', paddingLeft: '7vw', paddingRight: '4vw' }}>

        {/* Thin cobalt rule */}
        <div style={{ width: '4vw', height: '0.35vh', background: '#1D4ED8', marginBottom: '3vh' }} />

        <h1 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '5vw', fontWeight: 800,
          color: '#0D1B2A', lineHeight: 1.1, marginBottom: '2.5vh',
          textWrap: 'balance',
        }}>
          From Flat Maps to Curved Space
        </h1>

        <p style={{
          fontFamily: "'Source Sans 3', sans-serif", fontSize: '2.2vw', fontWeight: 600,
          color: '#1D4ED8', lineHeight: 1.4, marginBottom: '1.5vh',
        }}>
          A Proposal for Riemannian Manifold-Filtered RAG
        </p>

        <p style={{
          fontFamily: "'Source Sans 3', sans-serif", fontSize: '2vw',
          color: '#64748B', lineHeight: 1.5, marginBottom: '4vh',
        }}>
          What I found reading 10 KG-RAG papers — and what I think we should build next.
        </p>

        {/* Stat pills */}
        <div style={{ display: 'flex', gap: '1.5vw' }}>
          <div style={{
            background: '#EFF2F7', border: '1.5px solid #CBD5E1',
            borderRadius: '0.6vw', padding: '1.2vh 1.8vw',
          }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.8vw', fontWeight: 800, color: '#1D4ED8' }}>10</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.6vw', color: '#64748B' }}>Papers reviewed</div>
          </div>
          <div style={{
            background: '#FEF2F2', border: '1.5px solid #FECACA',
            borderRadius: '0.6vw', padding: '1.2vh 1.8vw',
          }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.8vw', fontWeight: 800, color: '#DC2626' }}>1</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.6vw', color: '#64748B' }}>Shared blind spot</div>
          </div>
          <div style={{
            background: '#ECFDF5', border: '1.5px solid #A7F3D0',
            borderRadius: '0.6vw', padding: '1.2vh 1.8vw',
          }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.8vw', fontWeight: 800, color: '#059669' }}>1</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.6vw', color: '#64748B' }}>Solution proposed</div>
          </div>
        </div>
      </div>

      {/* Right: SVG — globe/manifold concept art */}
      <div className="absolute flex items-center justify-center" style={{ top: '10vh', right: '3vw', width: '38vw', height: '80vh' }}>
        <svg viewBox="0 0 420 420" style={{ width: '32vw', height: '32vw' }}>
          <defs>
            <radialGradient id="tg01" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(29,78,216,0.12)" />
              <stop offset="100%" stopColor="rgba(29,78,216,0.02)" />
            </radialGradient>
            <radialGradient id="tg02" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(5,150,105,0.18)" />
              <stop offset="70%" stopColor="rgba(5,150,105,0.04)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Outer sphere suggestion */}
          <circle cx="210" cy="210" r="188" fill="url(#tg01)" stroke="rgba(29,78,216,0.12)" strokeWidth="1.5" />

          {/* Latitude lines (ellipses suggesting a globe) */}
          <ellipse cx="210" cy="210" rx="188" ry="50" fill="none" stroke="rgba(29,78,216,0.15)" strokeWidth="1" />
          <ellipse cx="210" cy="210" rx="188" ry="100" fill="none" stroke="rgba(29,78,216,0.12)" strokeWidth="1" />
          <ellipse cx="210" cy="210" rx="188" ry="150" fill="none" stroke="rgba(29,78,216,0.1)" strokeWidth="1" />

          {/* Longitude lines */}
          <path d="M210 22 Q300 210 210 398" fill="none" stroke="rgba(29,78,216,0.12)" strokeWidth="1" />
          <path d="M210 22 Q120 210 210 398" fill="none" stroke="rgba(29,78,216,0.12)" strokeWidth="1" />
          <path d="M210 22 Q370 120 398 210" fill="none" stroke="rgba(29,78,216,0.08)" strokeWidth="1" />
          <path d="M210 22 Q50 120 22 210" fill="none" stroke="rgba(29,78,216,0.08)" strokeWidth="1" />

          {/* Geodesic path highlight — the key idea */}
          <path d="M80 280 Q160 90 340 160" fill="none" stroke="#1D4ED8" strokeWidth="2.5" strokeDasharray="none" />

          {/* Start node */}
          <circle cx="80" cy="280" r="10" fill="#1D4ED8" />
          <text x="55" y="305" fill="#0D1B2A" fontSize="12" fontFamily="'Sora', sans-serif" fontWeight="700">Gene</text>

          {/* Mid node */}
          <circle cx="200" cy="140" r="8" fill="rgba(29,78,216,0.5)" />
          <text x="206" y="136" fill="#1D4ED8" fontSize="11" fontFamily="'Sora', sans-serif">Disease</text>

          {/* End node */}
          <circle cx="340" cy="160" r="10" fill="#059669" />
          <text x="348" y="165" fill="#059669" fontSize="12" fontFamily="'Sora', sans-serif" fontWeight="700">Drug</text>

          {/* Geodesic label */}
          <text x="155" y="88" fill="#1D4ED8" fontSize="11" fontFamily="'Sora', sans-serif" fontWeight="600">geodesic path</text>
          <line x1="168" y1="92" x2="195" y2="118" stroke="#1D4ED8" strokeWidth="0.8" strokeDasharray="3,2" />

          {/* Emerald centre glow */}
          <circle cx="210" cy="210" r="30" fill="url(#tg02)" />

          {/* Equator label */}
          <text x="275" y="215" fill="rgba(100,116,139,0.6)" fontSize="10" fontFamily="'Sora', sans-serif">Poincaré Ball</text>
        </svg>
      </div>

      {/* Bottom cobalt bar */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: 'linear-gradient(90deg, #1D4ED8 0%, rgba(29,78,216,0.2) 100%)' }} />
    </div>
  );
}
