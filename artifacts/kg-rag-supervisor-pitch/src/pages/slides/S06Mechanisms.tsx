export default function S06Mechanisms() {
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
        }}>Mechanism</span>
      </div>
      <div className="absolute" style={{ top: '4vh', right: '5vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#94A3B8' }}>06 / 12</span>
      </div>

      <div className="absolute" style={{ top: '11vh', left: '7vw', right: '5vw' }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '3.4vw', fontWeight: 800,
          color: '#0D1B2A', lineHeight: 1.15, marginBottom: '0.6vh',
        }}>
          How It Changes Every Query Mechanism
        </h2>
        <div style={{ width: '5vw', height: '0.35vh', background: '#1D4ED8', marginBottom: '2.2vh' }} />
      </div>

      {/* Table */}
      <div className="absolute" style={{ top: '25vh', left: '7vw', right: '5vw' }}>

        {/* Header row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr',
          background: '#0D1B2A', borderRadius: '0.6vw 0.6vw 0 0',
          padding: '1.2vh 1.5vw', gap: '1.5vw', marginBottom: '0.2vh',
        }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.8vw', fontWeight: 700, color: '#F4F6FA' }}>Operation</div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.8vw', fontWeight: 700, color: '#FCA5A5' }}>Before — Euclidean</div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.8vw', fontWeight: 700, color: '#6EE7B7' }}>After — Riemannian</div>
        </div>

        {/* Row 1 */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr',
          background: '#EFF2F7', padding: '1.1vh 1.5vw', gap: '1.5vw',
          borderBottom: '1px solid #CBD5E1',
        }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.9vw', fontWeight: 700, color: '#0D1B2A' }}>Embedding</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#DC2626' }}>Flat dot product</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#059669' }}>Mobius transformation on Poincare ball</div>
        </div>

        {/* Row 2 */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr',
          background: '#F4F6FA', padding: '1.1vh 1.5vw', gap: '1.5vw',
          borderBottom: '1px solid #CBD5E1',
        }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.9vw', fontWeight: 700, color: '#0D1B2A' }}>Retrieval</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#DC2626' }}>Cosine similarity ranking</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#059669' }}>Geodesic distance ranking</div>
        </div>

        {/* Row 3 */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr',
          background: '#EFF2F7', padding: '1.1vh 1.5vw', gap: '1.5vw',
          borderBottom: '1px solid #CBD5E1',
        }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.9vw', fontWeight: 700, color: '#0D1B2A' }}>Hop traversal</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#DC2626' }}>Fixed step-size in flat space</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#059669' }}>Curvature-aware exponential map</div>
        </div>

        {/* Row 4 */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr',
          background: '#F4F6FA', padding: '1.1vh 1.5vw', gap: '1.5vw',
          borderBottom: '1px solid #CBD5E1',
        }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.9vw', fontWeight: 700, color: '#0D1B2A' }}>Hop weighting</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#DC2626' }}>Equal weight at every hop</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#059669' }}>Distance decays naturally with depth</div>
        </div>

        {/* Row 5 */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr',
          background: '#EFF2F7', padding: '1.1vh 1.5vw', gap: '1.5vw',
          borderBottom: '1px solid #CBD5E1',
        }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.9vw', fontWeight: 700, color: '#0D1B2A' }}>Context memory</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#DC2626' }}>Reset at each hop — no memory</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#059669' }}>Parallel transport preserves direction</div>
        </div>

        {/* Row 6 */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr',
          background: '#F4F6FA', padding: '1.1vh 1.5vw', gap: '1.5vw',
          borderRadius: '0 0 0.6vw 0.6vw',
        }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.9vw', fontWeight: 700, color: '#0D1B2A' }}>Answer check</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#DC2626' }}>Euclidean path score</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.9vw', color: '#059669' }}>Geodesic path faithfulness check</div>
        </div>
      </div>

      {/* Footnote */}
      <div className="absolute" style={{ bottom: '3.5vh', left: '7vw', right: '5vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#64748B' }}>
          Like a GPS that understands the real shape of the terrain — not just driving equal distances on a flat road.
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: 'linear-gradient(90deg, #1D4ED8 0%, rgba(29,78,216,0.2) 100%)' }} />
    </div>
  );
}
