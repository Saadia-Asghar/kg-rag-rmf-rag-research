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
        }}>Measured pilot</span>
      </div>
      <div className="absolute" style={{ top: '3vh', right: '5vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#94A3B8' }}>10 / 12</span>
      </div>

      <div className="absolute" style={{ top: '9vh', left: '7vw', right: '5vw' }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '2.8vw', fontWeight: 800,
          color: '#0D1B2A', lineHeight: 1.1, marginBottom: '0.4vh',
        }}>
          Pilot Results
        </h2>
        <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.7vw', color: '#64748B', lineHeight: 1.25 }}>
          Hyperbolic retrieval beats learned Euclidean embedding — lexical overlap still leads on this pilot
        </div>
        <div style={{ width: '5vw', height: '0.3vh', background: '#059669', marginTop: '1.4vh' }} />
      </div>

      <div className="absolute" style={{ top: '30vh', left: '7vw', right: '5vw', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.4vw' }}>
        <div style={{
          background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '0.8vw',
          padding: '2vh 1.5vw', minHeight: '31vh',
        }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.65vw', fontWeight: 700, color: '#0D1B2A', marginBottom: '1.4vh' }}>
            Lexical baseline
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#64748B', marginBottom: '2.6vh' }}>
            String overlap ranking
          </div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '3.1vw', fontWeight: 800, color: '#2563EB', lineHeight: 1.05 }}>
            47.4%
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#374151', marginTop: '0.6vh' }}>
            Recall@5
          </div>
          <div style={{ height: '1px', background: '#E2E8F0', margin: '1.8vh 0 1.3vh' }} />
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.4vw', fontWeight: 800, color: '#0D1B2A', lineHeight: 1.05 }}>
            19.9%
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#374151', marginTop: '0.6vh' }}>
            MRR
          </div>
        </div>

        <div style={{
          background: '#EFF2F7', border: '1.5px solid #CBD5E1', borderRadius: '0.8vw',
          padding: '2vh 1.5vw', minHeight: '31vh',
        }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.65vw', fontWeight: 700, color: '#0D1B2A', marginBottom: '1.4vh' }}>
            Learned Euclidean
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#64748B', marginBottom: '2.6vh' }}>
            Flat graph embedding
          </div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '3.1vw', fontWeight: 800, color: '#DC2626', lineHeight: 1.05 }}>
            0.0%
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#374151', marginTop: '0.6vh' }}>
            Recall@5
          </div>
          <div style={{ height: '1px', background: '#CBD5E1', margin: '1.8vh 0 1.3vh' }} />
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.4vw', fontWeight: 800, color: '#0D1B2A', lineHeight: 1.05 }}>
            6.0%
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#374151', marginTop: '0.6vh' }}>
            MRR
          </div>
        </div>

        <div style={{
          background: '#ECFDF5', border: '2px solid #059669', borderRadius: '0.8vw',
          padding: '2vh 1.5vw', minHeight: '31vh',
        }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.65vw', fontWeight: 700, color: '#059669', marginBottom: '1.4vh' }}>
            RMF-RAG hyperbolic
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#374151', marginBottom: '2.6vh' }}>
            Poincaré-ball embedding
          </div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '3.1vw', fontWeight: 800, color: '#059669', lineHeight: 1.05 }}>
            21.1%
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#374151', marginTop: '0.6vh' }}>
            Recall@5
          </div>
          <div style={{ height: '1px', background: '#A7F3D0', margin: '1.8vh 0 1.3vh' }} />
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.4vw', fontWeight: 800, color: '#0D1B2A', lineHeight: 1.05 }}>
            13.1%
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#374151', marginTop: '0.6vh' }}>
            MRR
          </div>
        </div>
      </div>

      <div className="absolute" style={{ top: '20vh', left: '7vw' }}>
        <div style={{
          background: '#0D1B2A', borderRadius: '0.7vw', padding: '1.1vh 1.3vw',
          display: 'flex', alignItems: 'baseline', gap: '0.7vw',
        }}>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.7vw', fontWeight: 800, color: '#6EE7B7' }}>19</span>
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#F4F6FA' }}>recoverable test queries</span>
        </div>
      </div>

      <div className="absolute" style={{ left: '7vw', right: '7vw', bottom: '9.5vh', display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '2vw', alignItems: 'stretch' }}>
        <div style={{
          background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '0.7vw',
          padding: '1.5vh 1.4vw',
        }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', fontWeight: 700, color: '#0D1B2A', marginBottom: '0.5vh' }}>
            Honest read
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.6vw', color: '#374151', lineHeight: 1.3 }}>
            Curvature helps against the learned flat embedding, but the lexical baseline remains strongest on this small Kaggle pilot.
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
            No gene edges; graph relations are token-derived rather than curated biomedical relations.
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: 'linear-gradient(90deg, #059669 0%, rgba(5,150,105,0.2) 100%)' }} />
    </div>
  );
}