const rows = [
  { paper: 'D-RAG — flat distances', fix: 'Geodesic loss function replaces Euclidean distance in training' },
  { paper: 'CogGRAG — flat verification', fix: 'Self-verification runs on the manifold, not via dot product' },
  { paper: 'Goal-KG — exact string match', fix: 'Fuzzy geodesic proximity replaces exact predicate matching' },
  { paper: 'M³KG-RAG — separate spaces', fix: 'Unified Poincaré ball across text, image, and table modalities' },
  { paper: 'KG-RAG Wang — equal hop weight', fix: 'Geodesic distance naturally decays with hop depth' },
  { paper: 'GraphFlow — Euclidean flows', fix: 'Riemannian normalizing flows replace Euclidean distributions' },
  { paper: 'SG-RAG — hop cliff at 3+', fix: 'Curvature prevents degradation — no context reset between hops' },
  { paper: 'HyKGE — exact entity match', fix: 'Geodesic proximity removes the exact-match dependency entirely' },
  { paper: 'KRAGEN — context reset', fix: 'Parallel transport carries context across every hop' },
  { paper: 'KG²RAG — sparse path failure', fix: 'Geodesic interpolation bridges missing or incomplete edges' },
];

export default function S09GapClosure() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#F4F6FA' }}>
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(5,150,105,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="absolute" style={{ top: '3vh', left: '7vw' }}>
        <span style={{
          background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)',
          borderRadius: '2vw', padding: '0.3vh 1.2vw',
          fontFamily: "'Sora', sans-serif", fontSize: '1.2vw', fontWeight: 600,
          color: '#059669', letterSpacing: '0.07em', textTransform: 'uppercase',
        }}>Validation</span>
      </div>
      <div className="absolute" style={{ top: '3vh', right: '5vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#94A3B8' }}>09 / 12</span>
      </div>

      <div className="absolute" style={{ top: '9vh', left: '7vw', right: '5vw' }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '2.8vw', fontWeight: 800,
          color: '#0D1B2A', lineHeight: 1.1, marginBottom: '0.4vh',
        }}>
          How RMF-RAG Closes Every Gap
        </h2>
        <div style={{ width: '5vw', height: '0.3vh', background: '#059669', marginBottom: '1.5vh' }} />
      </div>

      {/* Table */}
      <div className="absolute" style={{ top: '21vh', left: '7vw', right: '5vw' }}>

        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.8fr',
          background: '#0D1B2A', borderRadius: '0.5vw 0.5vw 0 0',
          padding: '0.7vh 1.2vw', gap: '2vw',
        }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', fontWeight: 700, color: '#F4F6FA' }}>Paper — Gap</div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', fontWeight: 700, color: '#6EE7B7' }}>RMF-RAG Fix</div>
        </div>

        {/* Rows */}
        {rows.map(({ paper, fix }, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 1.8fr',
            background: i % 2 === 0 ? '#EFF2F7' : '#F4F6FA',
            padding: '0.55vh 1.2vw', gap: '2vw',
            borderBottom: i < rows.length - 1 ? '1px solid #CBD5E1' : 'none',
            borderRadius: i === rows.length - 1 ? '0 0 0.5vw 0.5vw' : '0',
          }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.4vw', fontWeight: 600, color: '#DC2626', lineHeight: 1.25 }}>{paper}</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#374151', lineHeight: 1.25 }}>{fix}</div>
          </div>
        ))}
      </div>

      {/* Insight footer */}
      <div className="absolute" style={{ bottom: '2.5vh', left: '7vw', right: '5vw' }}>
        <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', fontWeight: 700, color: '#059669' }}>
          One fix — changing the geometry — addresses ten different problems. One root cause, one solution.
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: 'linear-gradient(90deg, #059669 0%, rgba(5,150,105,0.2) 100%)' }} />
    </div>
  );
}
