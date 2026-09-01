export default function S02Papers() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#F4F6FA' }}>
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(29,78,216,0.04) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      {/* Badge */}
      <div className="absolute" style={{ top: '4vh', left: '7vw' }}>
        <span style={{
          background: 'rgba(29,78,216,0.1)', border: '1px solid rgba(29,78,216,0.25)',
          borderRadius: '2vw', padding: '0.4vh 1.2vw',
          fontFamily: "'Sora', sans-serif", fontSize: '1.3vw', fontWeight: 600,
          color: '#1D4ED8', letterSpacing: '0.07em', textTransform: 'uppercase',
        }}>Reading</span>
      </div>

      <div className="absolute" style={{ top: '4vh', right: '5vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#94A3B8' }}>02 / 12</span>
      </div>

      {/* Headline */}
      <div className="absolute" style={{ top: '11vh', left: '7vw', right: '5vw' }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '3.4vw', fontWeight: 800,
          color: '#0D1B2A', lineHeight: 1.15, marginBottom: '0.6vh',
        }}>
          10 KG-RAG Papers — One Common Thread
        </h2>
        <div style={{ width: '5vw', height: '0.35vh', background: '#1D4ED8', marginBottom: '3vh' }} />
      </div>

      {/* Two-column grid of papers */}
      <div className="absolute" style={{ top: '26vh', left: '7vw', right: '5vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2vh 4vw' }}>

        {/* Col 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4vh' }}>

          <div style={{ borderLeft: '3px solid #1D4ED8', paddingLeft: '1.2vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2vw', fontWeight: 700, color: '#0D1B2A' }}>D-RAG</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#64748B', lineHeight: 1.3 }}>Joint retrieval + reasoning training</div>
          </div>

          <div style={{ borderLeft: '3px solid #1D4ED8', paddingLeft: '1.2vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2vw', fontWeight: 700, color: '#0D1B2A' }}>CogGRAG</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#64748B', lineHeight: 1.3 }}>Self-verification reasoning loops</div>
          </div>

          <div style={{ borderLeft: '3px solid #1D4ED8', paddingLeft: '1.2vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2vw', fontWeight: 700, color: '#0D1B2A' }}>Goal-KG</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#64748B', lineHeight: 1.3 }}>SPARQL-style goal-directed queries</div>
          </div>

          <div style={{ borderLeft: '3px solid #1D4ED8', paddingLeft: '1.2vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2vw', fontWeight: 700, color: '#0D1B2A' }}>M³KG-RAG</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#64748B', lineHeight: 1.3 }}>Multimodal — text, image, and table</div>
          </div>

          <div style={{ borderLeft: '3px solid #1D4ED8', paddingLeft: '1.2vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2vw', fontWeight: 700, color: '#0D1B2A' }}>KG-RAG (Wang et al.)</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#64748B', lineHeight: 1.3 }}>Dual BM25 + BERT retrieval channels</div>
          </div>
        </div>

        {/* Col 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4vh' }}>

          <div style={{ borderLeft: '3px solid rgba(29,78,216,0.4)', paddingLeft: '1.2vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2vw', fontWeight: 700, color: '#0D1B2A' }}>GraphFlow</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#64748B', lineHeight: 1.3 }}>Flow-matching over graph edges</div>
          </div>

          <div style={{ borderLeft: '3px solid rgba(29,78,216,0.4)', paddingLeft: '1.2vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2vw', fontWeight: 700, color: '#0D1B2A' }}>SG-RAG</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#64748B', lineHeight: 1.3 }}>Subgraph-level retrieval (not just nodes)</div>
          </div>

          <div style={{ borderLeft: '3px solid rgba(29,78,216,0.4)', paddingLeft: '1.2vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2vw', fontWeight: 700, color: '#0D1B2A' }}>HyKGE</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#64748B', lineHeight: 1.3 }}>Hypothesis-first generation, then search</div>
          </div>

          <div style={{ borderLeft: '3px solid rgba(29,78,216,0.4)', paddingLeft: '1.2vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2vw', fontWeight: 700, color: '#0D1B2A' }}>KRAGEN</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#64748B', lineHeight: 1.3 }}>LLM-guided hop-by-hop planning</div>
          </div>

          <div style={{ borderLeft: '3px solid rgba(29,78,216,0.4)', paddingLeft: '1.2vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2vw', fontWeight: 700, color: '#0D1B2A' }}>KG²RAG</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#64748B', lineHeight: 1.3 }}>Path-grounded answer verification</div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="absolute" style={{ bottom: '3.5vh', left: '7vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.7vw', color: '#94A3B8' }}>
          Each paper is clever. All 10 share one hidden assumption.
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: 'linear-gradient(90deg, #1D4ED8 0%, rgba(29,78,216,0.2) 100%)' }} />
    </div>
  );
}
