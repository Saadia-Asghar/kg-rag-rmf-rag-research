export default function S05Geometry() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#F4F6FA' }}>
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(29,78,216,0.04) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="absolute" style={{ top: '4vh', left: '7vw' }}>
        <span style={{
          background: 'rgba(29,78,216,0.1)', border: '1px solid rgba(29,78,216,0.25)',
          borderRadius: '2vw', padding: '0.4vh 1.2vw',
          fontFamily: "'Sora', sans-serif", fontSize: '1.3vw', fontWeight: 600,
          color: '#1D4ED8', letterSpacing: '0.07em', textTransform: 'uppercase',
        }}>The Shift</span>
      </div>
      <div className="absolute" style={{ top: '4vh', right: '5vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#94A3B8' }}>05 / 12</span>
      </div>

      <div className="absolute" style={{ top: '11vh', left: '7vw', right: '5vw' }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '3.4vw', fontWeight: 800,
          color: '#0D1B2A', lineHeight: 1.15, marginBottom: '0.6vh',
        }}>
          Euclidean vs. Riemannian — What Changes
        </h2>
        <div style={{ width: '5vw', height: '0.35vh', background: '#1D4ED8', marginBottom: '2.5vh' }} />
      </div>

      <div className="absolute" style={{ top: '26vh', left: '7vw', right: '5vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3vw' }}>

        {/* Left: Euclidean */}
        <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '1vw', padding: '2vh 2vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2vw', fontWeight: 800, color: '#DC2626', marginBottom: '1.2vh' }}>
            Euclidean — Flat Space
          </div>

          {/* Flat grid SVG */}
          <div style={{ marginBottom: '1.5vh', display: 'flex', justifyContent: 'center' }}>
            <svg viewBox="0 0 220 130" style={{ width: '16vw', height: '10vw' }}>
              {/* Grid lines */}
              <line x1="20" y1="25" x2="200" y2="25" stroke="rgba(220,38,38,0.2)" strokeWidth="1" />
              <line x1="20" y1="65" x2="200" y2="65" stroke="rgba(220,38,38,0.2)" strokeWidth="1" />
              <line x1="20" y1="105" x2="200" y2="105" stroke="rgba(220,38,38,0.2)" strokeWidth="1" />
              <line x1="20" y1="20" x2="20" y2="115" stroke="rgba(220,38,38,0.2)" strokeWidth="1" />
              <line x1="70" y1="20" x2="70" y2="115" stroke="rgba(220,38,38,0.2)" strokeWidth="1" />
              <line x1="120" y1="20" x2="120" y2="115" stroke="rgba(220,38,38,0.2)" strokeWidth="1" />
              <line x1="170" y1="20" x2="170" y2="115" stroke="rgba(220,38,38,0.2)" strokeWidth="1" />
              {/* Nodes at equal distances */}
              <circle cx="20" cy="65" r="6" fill="#DC2626" />
              <circle cx="70" cy="65" r="6" fill="#DC2626" />
              <circle cx="120" cy="65" r="6" fill="#DC2626" />
              <circle cx="170" cy="65" r="6" fill="#DC2626" />
              {/* Straight line distances — all equal */}
              <line x1="26" y1="65" x2="64" y2="65" stroke="#DC2626" strokeWidth="1.5" />
              <line x1="76" y1="65" x2="114" y2="65" stroke="#DC2626" strokeWidth="1.5" />
              <line x1="126" y1="65" x2="164" y2="65" stroke="#DC2626" strokeWidth="1.5" />
              <text x="47" y="60" textAnchor="middle" fill="#DC2626" fontSize="8" fontFamily="'Sora', sans-serif">d</text>
              <text x="95" y="60" textAnchor="middle" fill="#DC2626" fontSize="8" fontFamily="'Sora', sans-serif">d</text>
              <text x="145" y="60" textAnchor="middle" fill="#DC2626" fontSize="8" fontFamily="'Sora', sans-serif">d</text>
              <text x="5" y="68" fill="#64748B" fontSize="7" fontFamily="'Sora', sans-serif">G</text>
              <text x="55" y="80" fill="#64748B" fontSize="7" fontFamily="'Sora', sans-serif">D</text>
              <text x="105" y="80" fill="#64748B" fontSize="7" fontFamily="'Sora', sans-serif">Dr</text>
              <text x="155" y="80" fill="#64748B" fontSize="7" fontFamily="'Sora', sans-serif">I</text>
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh' }}>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#374151' }}>
              Distance: <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>d = sqrt[(x₂-x₁)² + (y₂-y₁)²]</span>
            </div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#374151' }}>Grows linearly — 2x distance = 2x hops</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#374151' }}>Cannot represent hierarchy naturally</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#374151' }}>Used in: all 10 papers reviewed</div>
          </div>
        </div>

        {/* Right: Riemannian */}
        <div style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: '1vw', padding: '2vh 2vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2vw', fontWeight: 800, color: '#059669', marginBottom: '1.2vh' }}>
            Riemannian — Poincaré Ball
          </div>

          {/* Poincaré disk SVG */}
          <div style={{ marginBottom: '1.5vh', display: 'flex', justifyContent: 'center' }}>
            <svg viewBox="0 0 220 130" style={{ width: '16vw', height: '10vw' }}>
              {/* Disk boundary */}
              <circle cx="110" cy="65" r="58" fill="rgba(5,150,105,0.06)" stroke="rgba(5,150,105,0.4)" strokeWidth="1.5" />
              {/* Inner rings — hierarchy layers */}
              <circle cx="110" cy="65" r="30" fill="none" stroke="rgba(5,150,105,0.2)" strokeWidth="1" />
              <circle cx="110" cy="65" r="15" fill="none" stroke="rgba(5,150,105,0.15)" strokeWidth="1" />
              {/* Root node at center */}
              <circle cx="110" cy="65" r="7" fill="#059669" />
              <text x="110" y="58" textAnchor="middle" fill="#059669" fontSize="7" fontFamily="'Sora', sans-serif">Gene</text>
              {/* Layer 2 nodes — close but expanding */}
              <circle cx="85" cy="50" r="5.5" fill="#059669" opacity="0.7" />
              <circle cx="135" cy="50" r="5.5" fill="#059669" opacity="0.7" />
              <text x="82" y="44" fill="#64748B" fontSize="6" fontFamily="'Sora', sans-serif">Dis1</text>
              <text x="128" y="44" fill="#64748B" fontSize="6" fontFamily="'Sora', sans-serif">Dis2</text>
              {/* Geodesic curves to layer 2 */}
              <path d="M105 60 Q92 52 89 54" fill="none" stroke="#059669" strokeWidth="1.2" />
              <path d="M115 60 Q128 52 131 54" fill="none" stroke="#059669" strokeWidth="1.2" />
              {/* Layer 3 nodes — near boundary */}
              <circle cx="62" cy="40" r="5" fill="#059669" opacity="0.5" />
              <circle cx="90" cy="28" r="5" fill="#059669" opacity="0.5" />
              <circle cx="130" cy="28" r="5" fill="#059669" opacity="0.5" />
              <circle cx="158" cy="40" r="5" fill="#059669" opacity="0.5" />
              <text x="47" y="38" fill="#64748B" fontSize="6" fontFamily="'Sora', sans-serif">Drug</text>
              <text x="86" y="23" fill="#64748B" fontSize="6" fontFamily="'Sora', sans-serif">Drug</text>
              {/* Curved geodesics */}
              <path d="M81 47 Q70 40 66 43" fill="none" stroke="rgba(5,150,105,0.5)" strokeWidth="1" />
              <path d="M84 46 Q87 36 87 32" fill="none" stroke="rgba(5,150,105,0.5)" strokeWidth="1" />
              <path d="M136 46 Q133 36 133 32" fill="none" stroke="rgba(5,150,105,0.5)" strokeWidth="1" />
              <path d="M139 47 Q150 40 154 43" fill="none" stroke="rgba(5,150,105,0.5)" strokeWidth="1" />
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh' }}>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#374151' }}>
              Distance: <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>d(x,y) = 2·arctanh(‖-x⊕y‖)</span>
            </div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#374151' }}>Grows exponentially — fits hierarchy naturally</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#374151' }}>Geodesic (curved path) = semantic relationship</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#374151' }}>Natural fit for Gene → Disease → Drug chains</div>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="absolute" style={{ bottom: '3vh', left: '7vw', right: '5vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#64748B' }}>
          <span style={{ color: '#1D4ED8', fontWeight: 700 }}>Geodesic</span> = the shortest curved path on a curved surface, like a flight path on a globe. In the Poincaré ball, geodesics are the true semantic paths between concepts.
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: 'linear-gradient(90deg, #1D4ED8 0%, rgba(29,78,216,0.2) 100%)' }} />
    </div>
  );
}
