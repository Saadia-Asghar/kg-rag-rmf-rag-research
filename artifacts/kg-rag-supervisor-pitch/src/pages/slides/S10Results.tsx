export default function S10Results() {
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
          fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', fontWeight: 600,
          color: '#059669', letterSpacing: '0.07em', textTransform: 'uppercase',
        }}>Publication-grade benchmark</span>
      </div>
      <div className="absolute" style={{ top: '3vh', right: '5vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#94A3B8' }}>10 / 12</span>
      </div>

      <div className="absolute" style={{ top: '9vh', left: '7vw', right: '5vw' }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '2.8vw', fontWeight: 800,
          color: '#0D1B2A', lineHeight: 1.1, marginBottom: '0.4vh',
        }}>
          Hetionet Results
        </h2>
        <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.7vw', color: '#64748B', lineHeight: 1.25 }}>
          Five seeds · licensed biomedical relations · terminal links held out for 2-hop and 3-hop retrieval
        </div>
        <div style={{ width: '5vw', height: '0.3vh', background: '#059669', marginTop: '1.4vh' }} />
      </div>

      <div className="absolute" style={{ top: '20vh', left: '7vw', right: '5vw', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1.2vw' }}>
        {[
          { value: '5', label: 'random seeds', color: '#6EE7B7', background: '#0D1B2A' },
          { value: '3,200', label: 'gene–disease edges', color: '#2563EB', background: '#FFFFFF' },
          { value: '1,145', label: 'disease–compound edges', color: '#059669', background: '#FFFFFF' },
          { value: '823', label: 'gene–compound edges', color: '#D97706', background: '#FFFFFF' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: stat.background, border: stat.background === '#0D1B2A' ? 'none' : '1.5px solid #CBD5E1',
            borderRadius: '0.8vw', padding: '1.8vh 1.2vw', minHeight: '11vh',
          }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.35vw', fontWeight: 800, color: stat.color, lineHeight: 1.05 }}>
              {stat.value}
            </div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.35vw', color: stat.background === '#0D1B2A' ? '#F4F6FA' : '#475569', marginTop: '0.8vh', lineHeight: 1.15 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute" style={{ top: '35vh', left: '7vw', right: '5vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5vw' }}>
        {[
          { title: '2-hop test · Gene → Disease → Compound', rows: [['Lexical', '0.006', '0.009'], ['Euclidean', '0.011', '0.013'], ['RMF-RAG hyperbolic', '0.007', '0.012']] },
          { title: '3-hop test · Gene → Disease → Gene → Compound', rows: [['Lexical', '0.022', '0.022'], ['Euclidean', '0.011', '0.011'], ['RMF-RAG hyperbolic', '0.007', '0.015']] },
        ].map((task) => (
          <div key={task.title} style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '0.8vw', padding: '1.5vh 1.3vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.38vw', fontWeight: 700, color: '#0D1B2A', marginBottom: '1.1vh' }}>
              {task.title}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr 1fr', gap: '0.5vw', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.32vw' }}>
              <div style={{ color: '#94A3B8', fontWeight: 600 }}>METHOD</div>
              <div style={{ color: '#94A3B8', fontWeight: 600 }}>R@5</div>
              <div style={{ color: '#94A3B8', fontWeight: 600 }}>MRR</div>
              {task.rows.flatMap(([method, recall, mrr]) => [
                <div key={`${method}-name`} style={{ color: method === 'RMF-RAG hyperbolic' ? '#059669' : '#334155', fontWeight: method === 'RMF-RAG hyperbolic' ? 700 : 500 }}>{method}</div>,
                <div key={`${method}-recall`} style={{ color: '#334155' }}>{recall}</div>,
                <div key={`${method}-mrr`} style={{ color: method === 'RMF-RAG hyperbolic' ? '#059669' : '#334155', fontWeight: method === 'RMF-RAG hyperbolic' ? 700 : 500 }}>{mrr}</div>,
              ])}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute" style={{ left: '7vw', right: '7vw', bottom: '8.5vh', display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '2vw', alignItems: 'stretch' }}>
        <div style={{
          background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '0.7vw',
          padding: '1.5vh 1.4vw',
        }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.5vh' }}>
            Honest read
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.6vw', color: '#374151', lineHeight: 1.3 }}>
            Hyperbolic retrieval improves 3-hop MRR over Euclidean (0.015 vs 0.011), but not 2-hop MRR (0.012 vs 0.013). Intervals overlap, so this is a calibrated result—not a victory claim.
          </div>
        </div>
        <div style={{
          background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '0.7vw',
          padding: '1.5vh 1.4vw',
        }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', fontWeight: 700, color: '#9A3412', marginBottom: '0.5vh' }}>
            Limitation
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.6vw', color: '#7C2D12', lineHeight: 1.3 }}>
            Link retrieval is not clinical evidence. The next build adds licensed semantic text and independent therapeutic gold-standard labels.
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: 'linear-gradient(90deg, #059669 0%, rgba(5,150,105,0.2) 100%)' }} />
    </div>
  );
}