export default function S11Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0D1B2A' }}>
      {/* Subtle texture */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(29,78,216,0.12) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      {/* Emerald glow top-right */}
      <div className="absolute" style={{
        top: 0, right: 0,
        width: '45vw', height: '50vh',
        background: 'radial-gradient(circle at 100% 0%, rgba(5,150,105,0.14) 0%, transparent 70%)',
      }} />

      <div className="absolute" style={{ top: '4vh', left: '7vw' }}>
        <span style={{
          background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.35)',
          borderRadius: '2vw', padding: '0.4vh 1.2vw',
          fontFamily: "'Sora', sans-serif", fontSize: '1.3vw', fontWeight: 600,
          color: '#6EE7B7', letterSpacing: '0.07em', textTransform: 'uppercase',
        }}>Why This Matters</span>
      </div>
      <div className="absolute" style={{ top: '4vh', right: '5vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#475569' }}>12 / 12</span>
      </div>

      <div className="absolute" style={{ top: '11vh', left: '7vw', right: '5vw' }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '3.4vw', fontWeight: 800,
          color: '#F8FAFC', lineHeight: 1.15, marginBottom: '0.6vh',
        }}>
          Why This Matters — And Why Now
        </h2>
        <div style={{ width: '5vw', height: '0.35vh', background: '#059669', marginBottom: '2.5vh' }} />
      </div>

      <div className="absolute" style={{ top: '26vh', left: '7vw', right: '5vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4vw' }}>

        {/* Left: 4 points */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>

          <div style={{ borderLeft: '3px solid #1D4ED8', paddingLeft: '1.5vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.7vw', fontWeight: 700, color: '#93C5FD', marginBottom: '0.4vh', textTransform: 'uppercase', letterSpacing: '0.06em' }}>The Gap</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#CBD5E1', lineHeight: 1.4 }}>
              10 state-of-the-art systems share the same geometry assumption — and none of them fixed it
            </div>
          </div>

          <div style={{ borderLeft: '3px solid #059669', paddingLeft: '1.5vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.7vw', fontWeight: 700, color: '#6EE7B7', marginBottom: '0.4vh', textTransform: 'uppercase', letterSpacing: '0.06em' }}>The Opportunity</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#CBD5E1', lineHeight: 1.4 }}>
              Hyperbolic geometry tools are now mature — geoopt and PoincaréEmb libraries are production-ready
            </div>
          </div>

          <div style={{ borderLeft: '3px solid #059669', paddingLeft: '1.5vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.7vw', fontWeight: 700, color: '#6EE7B7', marginBottom: '0.4vh', textTransform: 'uppercase', letterSpacing: '0.06em' }}>The Application</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#CBD5E1', lineHeight: 1.4 }}>
              Biomedical multi-hop reasoning — drug discovery, gene-disease pathways, clinical decision support
            </div>
          </div>

          <div style={{ borderLeft: '3px solid #6EE7B7', paddingLeft: '1.5vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.7vw', fontWeight: 700, color: '#6EE7B7', marginBottom: '0.4vh', textTransform: 'uppercase', letterSpacing: '0.06em' }}>My Contribution</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#CBD5E1', lineHeight: 1.4 }}>
              First complete Riemannian-geometry-native KG-RAG pipeline — geometry is the architecture, not an add-on
            </div>
          </div>
        </div>

        {/* Right: pull quote + closing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3vh', justifyContent: 'center' }}>

          <div style={{
            background: 'rgba(5,150,105,0.12)', border: '2px solid rgba(5,150,105,0.35)',
            borderRadius: '1vw', padding: '3vh 2.5vw',
          }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.4vw', fontWeight: 600, color: '#6EE7B7', marginBottom: '1.5vh', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              One line for the room
            </div>
            <div style={{
              fontFamily: "'Sora', sans-serif", fontSize: '2.2vw', fontWeight: 700,
              color: '#F8FAFC', lineHeight: 1.4, textWrap: 'balance',
            }}>
              "Every existing system draws on a flat map. I am proposing we use a globe."
            </div>
          </div>

          <div style={{ background: 'rgba(29,78,216,0.12)', border: '1.5px solid rgba(29,78,216,0.3)', borderRadius: '0.8vw', padding: '2vh 2vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.7vw', fontWeight: 700, color: '#93C5FD', marginBottom: '0.8vh' }}>
              Request to sir
            </div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#CBD5E1', lineHeight: 1.5 }}>
              I believe this is publishable and would like to pursue it as my thesis direction — with your guidance on which benchmark to prioritize first.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: 'linear-gradient(90deg, #059669 0%, #1D4ED8 50%, rgba(29,78,216,0.2) 100%)' }} />
    </div>
  );
}
