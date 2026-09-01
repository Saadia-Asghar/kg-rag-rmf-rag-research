const phases = [
  { wk: 'Wk 1–2', title: 'Baseline + Poincaré Embedding', desc: 'Port KG-RAG baseline to PyTorch, set up Poincaré embedding layer', highlighted: false },
  { wk: 'Wk 3–4', title: 'Geodesic Retrieval Module', desc: 'Implement geodesic retrieval, replace cosine similarity throughout', highlighted: false },
  { wk: 'Wk 5–6', title: 'Parallel Transport Hop Module', desc: 'Build parallel transport + curvature scheduler — the novel contribution', highlighted: true },
  { wk: 'Wk 7–8', title: 'Integration + Benchmarking', desc: 'Full RAG pipeline integration, test on MedQA and BioASQ benchmarks', highlighted: false },
  { wk: 'Wk 9–10', title: 'Ablations + Paper Sections', desc: 'Flat vs. curved per-component ablations, write up results', highlighted: false },
];

export default function S10Plan() {
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
        }}>Implementation</span>
      </div>
      <div className="absolute" style={{ top: '3vh', right: '5vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#94A3B8' }}>11 / 12</span>
      </div>

      <div className="absolute" style={{ top: '9vh', left: '7vw', right: '5vw' }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '2.8vw', fontWeight: 800,
          color: '#0D1B2A', lineHeight: 1.1, marginBottom: '0.2vh',
        }}>
          HyperKG-RAG — 10-Week Build Plan
        </h2>
        <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#64748B', marginBottom: '0.4vh' }}>
          Goal: implement and benchmark RMF-RAG — MedQA, BioASQ, WebQSP
        </div>
        <div style={{ width: '5vw', height: '0.3vh', background: '#059669', marginBottom: '1.5vh' }} />
      </div>

      <div className="absolute" style={{ top: '23vh', left: '7vw', right: '5vw', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3.5vw' }}>

        {/* Left: timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9vh' }}>
          {phases.map(({ wk, title, desc, highlighted }) => (
            <div key={wk} style={{ display: 'flex', gap: '1.2vw', alignItems: 'stretch' }}>
              <div style={{
                minWidth: '5vw', borderRadius: '0.5vw',
                background: highlighted ? '#0D1B2A' : '#059669',
                border: highlighted ? '2px solid #059669' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0.6vh 0',
              }}>
                <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.35vw', fontWeight: 800, color: highlighted ? '#059669' : 'white', textAlign: 'center' }}>{wk}</span>
              </div>
              <div style={{
                background: highlighted ? '#ECFDF5' : '#EFF2F7',
                border: `1px solid ${highlighted ? '#A7F3D0' : '#CBD5E1'}`,
                borderRadius: '0.5vw', padding: '0.7vh 1.1vw', flex: 1,
              }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.55vw', fontWeight: 700, color: highlighted ? '#059669' : '#0D1B2A', lineHeight: 1.2 }}>{title}</div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: highlighted ? '#374151' : '#64748B', lineHeight: 1.3 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: targets + note */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8vh', justifyContent: 'center' }}>

          <div style={{ background: '#0D1B2A', borderRadius: '1vw', padding: '2vh 1.8vw', border: '2px solid rgba(5,150,105,0.4)' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.3vw', fontWeight: 600, color: '#6EE7B7', marginBottom: '1vh', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Target benchmarks</div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.8vw', fontWeight: 700, color: 'white', lineHeight: 1.4 }}>MedQA (3-hop)</div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.8vw', fontWeight: 700, color: 'white', lineHeight: 1.4 }}>BioASQ (multi-hop)</div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.8vw', fontWeight: 700, color: 'white', lineHeight: 1.4, marginBottom: '1.2vh' }}>WebQSP</div>
            <div style={{ height: '1px', background: 'rgba(110,231,183,0.3)', marginBottom: '1.2vh' }} />
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.55vw', color: '#6EE7B7', lineHeight: 1.4 }}>+8–12% on 3-hop accuracy</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.55vw', color: '#6EE7B7', lineHeight: 1.4 }}>40% fewer hallucinations</div>
          </div>

          <div style={{ background: '#EFF2F7', border: '1.5px solid #CBD5E1', borderRadius: '0.8vw', padding: '1.4vh 1.6vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.45vw', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.5vh' }}>Key risk addressed</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#374151', lineHeight: 1.4 }}>
              Poincaré embedding training time — we start from pretrained hyperbolic embeddings from existing biomedical KG work.
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: 'linear-gradient(90deg, #059669 0%, rgba(5,150,105,0.2) 100%)' }} />
    </div>
  );
}
