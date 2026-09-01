export default function P17GapsClosed() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#071410' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 55%)' }} />

      <div className="relative z-10 flex flex-col px-[7vw] pt-[4vh] pb-[4vh]" style={{ height: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '3vh' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#6EE7B7', letterSpacing: '0.1em', marginBottom: '0.8vh' }}>THE FIX</div>
          <h2 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '3.4vw', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.1 }}>
            How RMF-RAG Closes Every Gap
          </h2>
        </div>

        {/* Two-column gap resolution table */}
        <div style={{ display: 'flex', gap: '2.5vw', flex: 1 }}>
          {/* Left column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.1vh' }}>
            <div style={{ background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.5vw', padding: '1.1vh 1.4vw', display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#F59E0B', flexShrink: 0, width: '8vw' }}>D-RAG</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#94A3B8', flexShrink: 0 }}>--</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#6EE7B7', lineHeight: 1.4 }}>flat distances replaced by geodesic distance on the Poincare ball</span>
            </div>
            <div style={{ background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.5vw', padding: '1.1vh 1.4vw', display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#F59E0B', flexShrink: 0, width: '8vw' }}>CogGRAG</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#94A3B8', flexShrink: 0 }}>--</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#6EE7B7', lineHeight: 1.4 }}>verification now queries a manifold-embedded index</span>
            </div>
            <div style={{ background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.5vw', padding: '1.1vh 1.4vw', display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#F59E0B', flexShrink: 0, width: '8vw' }}>Goal-KG</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#94A3B8', flexShrink: 0 }}>--</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#6EE7B7', lineHeight: 1.4 }}>geodesic nearest-neighbour handles surface-form variation</span>
            </div>
            <div style={{ background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.5vw', padding: '1.1vh 1.4vw', display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#F59E0B', flexShrink: 0, width: '8vw' }}>M³KG-RAG</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#94A3B8', flexShrink: 0 }}>--</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#6EE7B7', lineHeight: 1.4 }}>all modalities projected onto one shared manifold</span>
            </div>
            <div style={{ background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.5vw', padding: '1.1vh 1.4vw', display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#F59E0B', flexShrink: 0, width: '8vw' }}>KG-RAG Wang</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#94A3B8', flexShrink: 0 }}>--</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#6EE7B7', lineHeight: 1.4 }}>geodesic path length naturally discounts distant hops</span>
            </div>
          </div>
          {/* Right column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.1vh' }}>
            <div style={{ background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.5vw', padding: '1.1vh 1.4vw', display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#F59E0B', flexShrink: 0, width: '8vw' }}>GraphFlow</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#94A3B8', flexShrink: 0 }}>--</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#6EE7B7', lineHeight: 1.4 }}>flow distributions modeled on the manifold directly</span>
            </div>
            <div style={{ background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.5vw', padding: '1.1vh 1.4vw', display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#F59E0B', flexShrink: 0, width: '8vw' }}>SG-RAG</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#94A3B8', flexShrink: 0 }}>--</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#6EE7B7', lineHeight: 1.4 }}>subgraph expansion follows geodesics, not Euclidean radius</span>
            </div>
            <div style={{ background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.5vw', padding: '1.1vh 1.4vw', display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#F59E0B', flexShrink: 0, width: '8vw' }}>HyKGE</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#94A3B8', flexShrink: 0 }}>--</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#6EE7B7', lineHeight: 1.4 }}>hypothesis validated by geodesic proximity, not string equality</span>
            </div>
            <div style={{ background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.5vw', padding: '1.1vh 1.4vw', display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#F59E0B', flexShrink: 0, width: '8vw' }}>KRAGEN</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#94A3B8', flexShrink: 0 }}>--</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#6EE7B7', lineHeight: 1.4 }}>path state accumulates as a manifold point — not reset per step</span>
            </div>
            <div style={{ background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.5vw', padding: '1.1vh 1.4vw', display: 'flex', gap: '1vw', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#F59E0B', flexShrink: 0, width: '8vw' }}>KG²RAG</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#94A3B8', flexShrink: 0 }}>--</span>
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.4vw', color: '#6EE7B7', lineHeight: 1.4 }}>geodesic paths tolerate missing nodes via manifold interpolation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.35vh', background: 'linear-gradient(90deg, transparent 0%, #10B981 50%, transparent 100%)' }} />
    </div>
  );
}
