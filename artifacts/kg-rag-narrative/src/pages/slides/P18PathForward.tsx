export default function P18PathForward() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex" style={{ background: '#071410' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(16,185,129,0.08) 0%, transparent 60%)' }} />
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(16,185,129,0.04) 1px, transparent 0)',
        backgroundSize: '44px 44px'
      }} />

      {/* Left: benchmarks + open question */}
      <div className="relative z-10 flex flex-col justify-center px-[7vw] py-[5vh]" style={{ flex: '0 0 44%' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#6EE7B7', letterSpacing: '0.1em', marginBottom: '1.5vh' }}>
          WHAT COMES NEXT
        </div>
        <h2 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '3.6vw', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.1, marginBottom: '3.5vh' }}>
          HyperKG-RAG
        </h2>

        <div style={{ marginBottom: '3vh' }}>
          <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.5vw', color: '#94A3B8', letterSpacing: '0.04em', marginBottom: '1.2vh' }}>FORMAL BENCHMARKS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.5vw', color: '#10B981' }}>MedQA-3hop</div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.5vw', color: '#10B981' }}>WebQSP-hard</div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.5vw', color: '#10B981' }}>BioASQ-multi</div>
          </div>
        </div>

        <div style={{ marginBottom: '3vh' }}>
          <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.5vw', color: '#94A3B8', letterSpacing: '0.04em', marginBottom: '1vh' }}>ABLATION</div>
          <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.6vw', color: '#F8FAFC', lineHeight: 1.45 }}>
            Euclidean baseline vs Poincare ball vs product manifold — isolate the geometry effect
          </div>
        </div>

        <div style={{ background: '#0D1F1A', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '0.6vw', padding: '1.5vh 1.6vw' }}>
          <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.5vw', color: '#94A3B8', marginBottom: '0.5vh' }}>The open question</div>
          <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.6vw', color: '#6EE7B7', lineHeight: 1.45 }}>
            Product manifolds (hyperbolic x spherical x Euclidean) for multi-relational graphs
          </div>
        </div>
      </div>

      {/* Right: 10-week timeline */}
      <div className="relative z-10 flex flex-col justify-center px-[4vw] py-[5vh]" style={{ flex: 1 }}>
        <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.5vw', color: '#94A3B8', letterSpacing: '0.04em', marginBottom: '2vh' }}>
          10-WEEK IMPLEMENTATION PLAN
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2vw', color: '#10B981', flexShrink: 0, width: '8vw' }}>Weeks 1–2</div>
            <div style={{ width: '1px', height: '4vh', background: 'rgba(16,185,129,0.3)', flexShrink: 0 }} />
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.6vw', color: '#F8FAFC' }}>KG embedding in Poincare ball</div>
          </div>
          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2vw', color: '#10B981', flexShrink: 0, width: '8vw' }}>Weeks 3–4</div>
            <div style={{ width: '1px', height: '4vh', background: 'rgba(16,185,129,0.3)', flexShrink: 0 }} />
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.6vw', color: '#F8FAFC' }}>Geodesic retriever implementation</div>
          </div>
          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2vw', color: '#10B981', flexShrink: 0, width: '8vw' }}>Weeks 5–6</div>
            <div style={{ width: '1px', height: '4vh', background: 'rgba(16,185,129,0.3)', flexShrink: 0 }} />
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.6vw', color: '#F8FAFC' }}>End-to-end pipeline integration</div>
          </div>
          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2vw', color: '#10B981', flexShrink: 0, width: '8vw' }}>Weeks 7–8</div>
            <div style={{ width: '1px', height: '4vh', background: 'rgba(16,185,129,0.3)', flexShrink: 0 }} />
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.6vw', color: '#F8FAFC' }}>Evaluation harness + ablation runs</div>
          </div>
          <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'center' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2vw', color: '#10B981', flexShrink: 0, width: '8vw' }}>Weeks 9–10</div>
            <div style={{ width: '1px', height: '4vh', background: 'rgba(16,185,129,0.3)', flexShrink: 0 }} />
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.6vw', color: '#F8FAFC' }}>Paper write-up and submission</div>
          </div>
        </div>

        <div style={{ marginTop: '3.5vh', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '0.6vw', padding: '1.5vh 1.8vw' }}>
          <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.8vw', fontWeight: 600, color: '#10B981' }}>
            This deck is the roadmap. The research starts now.
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.35vh', background: 'linear-gradient(90deg, transparent 0%, #10B981 50%, transparent 100%)' }} />
    </div>
  );
}
