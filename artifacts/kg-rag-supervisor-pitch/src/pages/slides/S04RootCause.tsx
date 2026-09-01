export default function S04RootCause() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#F4F6FA' }}>
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(220,38,38,0.04) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="absolute" style={{ top: '4vh', left: '7vw' }}>
        <span style={{
          background: 'rgba(220,38,38,0.09)', border: '1px solid rgba(220,38,38,0.25)',
          borderRadius: '2vw', padding: '0.4vh 1.2vw',
          fontFamily: "'Sora', sans-serif", fontSize: '1.3vw', fontWeight: 600,
          color: '#DC2626', letterSpacing: '0.07em', textTransform: 'uppercase',
        }}>Root Cause</span>
      </div>
      <div className="absolute" style={{ top: '4vh', right: '5vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#94A3B8' }}>04 / 12</span>
      </div>

      <div className="absolute" style={{ top: '11vh', left: '7vw', right: '5vw' }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '3.4vw', fontWeight: 800,
          color: '#0D1B2A', lineHeight: 1.15, marginBottom: '0.6vh',
        }}>
          They All Assume the World Is Flat
        </h2>
        <div style={{ width: '5vw', height: '0.35vh', background: '#DC2626', marginBottom: '2.5vh' }} />
      </div>

      {/* Two-column layout */}
      <div className="absolute" style={{ top: '26vh', left: '7vw', right: '5vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4vw' }}>

        {/* Left: the assumption */}
        <div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2vw', fontWeight: 700, color: '#DC2626', marginBottom: '1.5vh', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            What all 10 papers assume
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4vh' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1vw' }}>
              <div style={{ width: '0.6vw', height: '0.6vw', borderRadius: '50%', background: '#DC2626', marginTop: '0.7vh', flexShrink: 0 }} />
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '2vw', color: '#374151', lineHeight: 1.4 }}>
                Distances between nodes are straight lines
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1vw' }}>
              <div style={{ width: '0.6vw', height: '0.6vw', borderRadius: '50%', background: '#DC2626', marginTop: '0.7vh', flexShrink: 0 }} />
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '2vw', color: '#374151', lineHeight: 1.4 }}>
                All directions are treated equally
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1vw' }}>
              <div style={{ width: '0.6vw', height: '0.6vw', borderRadius: '50%', background: '#DC2626', marginTop: '0.7vh', flexShrink: 0 }} />
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '2vw', color: '#374151', lineHeight: 1.4 }}>
                Hierarchy must be squeezed in artificially
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1vw' }}>
              <div style={{ width: '0.6vw', height: '0.6vw', borderRadius: '50%', background: '#DC2626', marginTop: '0.7vh', flexShrink: 0 }} />
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '2vw', color: '#374151', lineHeight: 1.4 }}>
                Tree-like knowledge structure is lost or distorted
              </span>
            </div>
          </div>

          <div style={{ marginTop: '3vh', padding: '1.8vh 1.6vw', background: 'rgba(220,38,38,0.07)', border: '1.5px solid rgba(220,38,38,0.2)', borderRadius: '0.7vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.9vw', fontWeight: 700, color: '#DC2626', marginBottom: '0.5vh' }}>Real medical knowledge:</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#374151', lineHeight: 1.5 }}>
              Gene → Disease → Drug → Interaction → Side Effect
            </div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#64748B', marginTop: '0.5vh' }}>
              This is a hierarchy — a tree — not a flat grid. Hierarchies expand exponentially. Flat space cannot hold them without distortion.
            </div>
          </div>
        </div>

        {/* Right: SVG tree overflowing a flat box */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.8vw', fontWeight: 600, color: '#64748B', marginBottom: '1.5vh', textAlign: 'center' }}>
            A hierarchy squeezed into flat Euclidean space
          </div>
          <svg viewBox="0 0 360 280" style={{ width: '28vw', height: '22vw' }}>
            {/* Flat box boundary */}
            <rect x="20" y="20" width="320" height="230" fill="none" stroke="rgba(220,38,38,0.4)" strokeWidth="2" strokeDasharray="6,4" rx="4" />
            <text x="290" y="16" fill="#DC2626" fontSize="10" fontFamily="'Sora', sans-serif" fontWeight="600">flat space</text>

            {/* Root node */}
            <circle cx="180" cy="50" r="12" fill="#1D4ED8" />
            <text x="180" y="54" textAnchor="middle" fill="white" fontSize="9" fontFamily="'Sora', sans-serif" fontWeight="700">Gene</text>

            {/* Level 2 */}
            <line x1="180" y1="62" x2="90" y2="110" stroke="#64748B" strokeWidth="1.5" />
            <line x1="180" y1="62" x2="270" y2="110" stroke="#64748B" strokeWidth="1.5" />
            <circle cx="90" cy="118" r="11" fill="#1D4ED8" opacity="0.7" />
            <text x="90" y="122" textAnchor="middle" fill="white" fontSize="8" fontFamily="'Sora', sans-serif">Dis1</text>
            <circle cx="270" cy="118" r="11" fill="#1D4ED8" opacity="0.7" />
            <text x="270" y="122" textAnchor="middle" fill="white" fontSize="8" fontFamily="'Sora', sans-serif">Dis2</text>

            {/* Level 3 */}
            <line x1="90" y1="129" x2="45" y2="175" stroke="#94A3B8" strokeWidth="1.2" />
            <line x1="90" y1="129" x2="120" y2="175" stroke="#94A3B8" strokeWidth="1.2" />
            <line x1="270" y1="129" x2="240" y2="175" stroke="#94A3B8" strokeWidth="1.2" />
            <line x1="270" y1="129" x2="310" y2="175" stroke="#94A3B8" strokeWidth="1.2" />
            <circle cx="45" cy="182" r="10" fill="#059669" opacity="0.6" />
            <text x="45" y="186" textAnchor="middle" fill="white" fontSize="7" fontFamily="'Sora', sans-serif">Drug</text>
            <circle cx="120" cy="182" r="10" fill="#059669" opacity="0.6" />
            <text x="120" y="186" textAnchor="middle" fill="white" fontSize="7" fontFamily="'Sora', sans-serif">Drug</text>
            <circle cx="240" cy="182" r="10" fill="#059669" opacity="0.6" />
            <text x="240" y="186" textAnchor="middle" fill="white" fontSize="7" fontFamily="'Sora', sans-serif">Drug</text>
            <circle cx="310" cy="182" r="10" fill="#059669" opacity="0.6" />
            <text x="310" y="186" textAnchor="middle" fill="white" fontSize="7" fontFamily="'Sora', sans-serif">Drug</text>

            {/* Level 4 overflowing */}
            <line x1="45" y1="192" x2="20" y2="240" stroke="#DC2626" strokeWidth="1.2" strokeDasharray="4,3" />
            <line x1="310" y1="192" x2="340" y2="240" stroke="#DC2626" strokeWidth="1.2" strokeDasharray="4,3" />
            <circle cx="20" cy="248" r="9" fill="rgba(220,38,38,0.5)" />
            <circle cx="340" cy="248" r="9" fill="rgba(220,38,38,0.5)" />
            <text x="180" y="258" textAnchor="middle" fill="#DC2626" fontSize="9" fontFamily="'Sora', sans-serif" fontWeight="600">level 4 overflows the box...</text>
          </svg>

          <div style={{
            marginTop: '1.5vh',
            fontFamily: "'Sora', sans-serif", fontSize: '1.7vw', fontWeight: 700,
            color: '#DC2626', textAlign: 'center',
          }}>
            My insight: use a space that is already curved.
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: 'linear-gradient(90deg, #DC2626 0%, rgba(220,38,38,0.2) 100%)' }} />
    </div>
  );
}
