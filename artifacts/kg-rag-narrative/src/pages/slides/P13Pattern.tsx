export default function P13Pattern() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex" style={{ background: '#0E1420' }}>
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(248,250,252,0.03) 1px, transparent 0)',
        backgroundSize: '48px 48px'
      }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.04) 0%, transparent 70%)' }} />

      <div className="relative z-10 flex flex-col justify-center px-[7vw] py-[5vh]" style={{ width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '3.5vh' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.1vw', color: '#94A3B8', letterSpacing: '0.1em', marginBottom: '1vh' }}>
            AFTER 10 PAPERS
          </div>
          <h2 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '4vw', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.1 }}>
            Every paper solved a real problem.<br />
            <span style={{ color: '#EF4444' }}>Every paper left the same assumption untouched.</span>
          </h2>
        </div>

        {/* Two-column list */}
        <div style={{ display: 'flex', gap: '4vw', marginBottom: '3vh' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', padding: '1.2vh 1.5vw', background: '#141C2E', borderRadius: '0.5vw', border: '1px solid rgba(248,250,252,0.06)' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2vw', color: '#F59E0B', width: '8vw', flexShrink: 0 }}>D-RAG</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#64748B', marginRight: 'auto' }}>··········</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#FCA5A5' }}>flat distances</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', padding: '1.2vh 1.5vw', background: '#141C2E', borderRadius: '0.5vw', border: '1px solid rgba(248,250,252,0.06)' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2vw', color: '#F59E0B', width: '8vw', flexShrink: 0 }}>CogGRAG</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#64748B', marginRight: 'auto' }}>··········</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#FCA5A5' }}>flat verification index</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', padding: '1.2vh 1.5vw', background: '#141C2E', borderRadius: '0.5vw', border: '1px solid rgba(248,250,252,0.06)' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2vw', color: '#F59E0B', width: '8vw', flexShrink: 0 }}>Goal-KG</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#64748B', marginRight: 'auto' }}>··········</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#FCA5A5' }}>flat vocabulary space</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', padding: '1.2vh 1.5vw', background: '#141C2E', borderRadius: '0.5vw', border: '1px solid rgba(248,250,252,0.06)' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2vw', color: '#F59E0B', width: '8vw', flexShrink: 0 }}>M³KG-RAG</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#64748B', marginRight: 'auto' }}>··········</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#FCA5A5' }}>flat per-modality spaces</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', padding: '1.2vh 1.5vw', background: '#141C2E', borderRadius: '0.5vw', border: '1px solid rgba(248,250,252,0.06)' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2vw', color: '#F59E0B', width: '8vw', flexShrink: 0 }}>KG-RAG Wang</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#64748B', marginRight: 'auto' }}>··········</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#FCA5A5' }}>flat hop weighting</span>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', padding: '1.2vh 1.5vw', background: '#141C2E', borderRadius: '0.5vw', border: '1px solid rgba(248,250,252,0.06)' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2vw', color: '#F59E0B', width: '8vw', flexShrink: 0 }}>GraphFlow</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#64748B', marginRight: 'auto' }}>··········</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#FCA5A5' }}>Euclidean flow model</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', padding: '1.2vh 1.5vw', background: '#141C2E', borderRadius: '0.5vw', border: '1px solid rgba(248,250,252,0.06)' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2vw', color: '#F59E0B', width: '8vw', flexShrink: 0 }}>SG-RAG</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#64748B', marginRight: 'auto' }}>··········</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#FCA5A5' }}>flat subgraph scoring</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', padding: '1.2vh 1.5vw', background: '#141C2E', borderRadius: '0.5vw', border: '1px solid rgba(248,250,252,0.06)' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2vw', color: '#F59E0B', width: '8vw', flexShrink: 0 }}>HyKGE</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#64748B', marginRight: 'auto' }}>··········</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#FCA5A5' }}>flat entity matching</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', padding: '1.2vh 1.5vw', background: '#141C2E', borderRadius: '0.5vw', border: '1px solid rgba(248,250,252,0.06)' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2vw', color: '#F59E0B', width: '8vw', flexShrink: 0 }}>KRAGEN</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#64748B', marginRight: 'auto' }}>··········</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#FCA5A5' }}>flat per-step embeddings</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw', padding: '1.2vh 1.5vw', background: '#141C2E', borderRadius: '0.5vw', border: '1px solid rgba(248,250,252,0.06)' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2vw', color: '#F59E0B', width: '8vw', flexShrink: 0 }}>KG²RAG</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#64748B', marginRight: 'auto' }}>··········</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#FCA5A5' }}>flat path extraction</span>
            </div>
          </div>
        </div>

        {/* Closing verdict */}
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.7vw', padding: '1.8vh 2.5vw', textAlign: 'center' }}>
          <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '2.2vw', fontWeight: 700, color: '#FCA5A5' }}>
            One assumption. Ten systems. Zero solutions.
          </span>
        </div>
      </div>
    </div>
  );
}
