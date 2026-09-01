export default function S08Pipeline() {
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
        }}>My Proposal</span>
      </div>
      <div className="absolute" style={{ top: '3vh', right: '5vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#94A3B8' }}>08 / 12</span>
      </div>

      <div className="absolute" style={{ top: '9vh', left: '7vw', right: '5vw' }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '2.8vw', fontWeight: 800,
          color: '#0D1B2A', lineHeight: 1.1, marginBottom: '0.4vh',
        }}>
          RMF-RAG — The 5-Step Pipeline
        </h2>
        <div style={{ width: '5vw', height: '0.3vh', background: '#059669', marginBottom: '1.8vh' }} />
      </div>

      <div className="absolute" style={{ top: '22vh', left: '7vw', right: '5vw', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3.5vw' }}>

        {/* Left: 5 steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>

          {[
            { n: 1, title: 'Hyperbolic Embedding', desc: 'Encode all KG nodes on the Poincaré ball — hierarchical structure preserved naturally', highlighted: false },
            { n: 2, title: 'Geodesic Retrieval', desc: 'Rank candidates by geodesic distance, not cosine similarity — so depth matters', highlighted: false },
            { n: 3, title: 'Curvature-Aware Hop', desc: 'Exponential map guides each hop along the manifold surface, not in a straight line', highlighted: false },
            { n: 4, title: 'Parallel Transport', desc: 'Carry semantic context across every hop without resetting — the most novel contribution', highlighted: true },
            { n: 5, title: 'Geodesic Verification', desc: 'Score the final answer by faithfulness of the full curved path — not just endpoint match', highlighted: false },
          ].map(({ n, title, desc, highlighted }) => (
            <div key={n} style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
              <div style={{
                minWidth: '3.2vw', height: '3.2vw', borderRadius: '50%', flexShrink: 0,
                background: highlighted ? '#0D1B2A' : '#059669',
                border: highlighted ? '2px solid #059669' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.7vw', fontWeight: 800, color: highlighted ? '#059669' : 'white' }}>{n}</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.65vw', fontWeight: 700, color: '#059669', lineHeight: 1.2 }}>{title}</div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#374151', lineHeight: 1.3 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: formula + key insight */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8vh', justifyContent: 'center' }}>

          <div style={{
            background: '#0D1B2A', borderRadius: '1vw', padding: '2vh 1.8vw',
            border: '2px solid rgba(5,150,105,0.4)',
          }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.3vw', fontWeight: 600, color: '#6EE7B7', marginBottom: '0.8vh', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Key Formula
            </div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2vw', fontWeight: 700, color: 'white', lineHeight: 1.3 }}>
              d_P(x,y) =
            </div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2vw', fontWeight: 700, color: '#6EE7B7', lineHeight: 1.3 }}>
              2 · arctanh(‖-x ⊕ y‖)
            </div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.45vw', color: '#94A3B8', marginTop: '0.8vh', lineHeight: 1.35 }}>
              where ⊕ is Möbius addition — the curved-space equivalent of vector addition
            </div>
          </div>

          <div style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: '0.8vw', padding: '1.4vh 1.6vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', fontWeight: 700, color: '#059669', marginBottom: '0.5vh' }}>
              Why this is different
            </div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.45vw', color: '#374151', lineHeight: 1.4 }}>
              We do not redesign the whole pipeline. We change the geometry underneath it. Five Euclidean operations become five Riemannian operations.
            </div>
          </div>

          <div style={{ background: '#EFF2F7', border: '1.5px solid #CBD5E1', borderRadius: '0.8vw', padding: '1.2vh 1.6vw' }}>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.45vw', color: '#374151', lineHeight: 1.4 }}>
              Step 4 — parallel transport — is borrowed from differential geometry and physics. It means we carry the direction of travel with us as we move through the graph.
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: 'linear-gradient(90deg, #059669 0%, rgba(5,150,105,0.2) 100%)' }} />
    </div>
  );
}
