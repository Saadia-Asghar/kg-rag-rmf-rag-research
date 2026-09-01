const base = import.meta.env.BASE_URL;

export default function Slide01Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#06091A' }}>
      {/* Background image */}
      <img
        src={`${base}hero-cosmos.jpg`}
        crossOrigin="anonymous"
        alt="Knowledge cosmos"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,9,26,0.85) 0%, rgba(6,9,26,0.6) 50%, rgba(6,9,26,0.9) 100%)' }} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-[4vw] pt-[3vh]">
        <div className="flex items-center gap-[1vw]">
          <div className="w-[0.4vw] h-[4vh]" style={{ background: '#00D4FF' }} />
          <span className="font-mono text-[1.5vw] tracking-widest uppercase" style={{ color: '#00D4FF', fontFamily: 'DM Mono, monospace' }}>KG-RAG SURVEY · 2026</span>
        </div>
        <span className="font-body text-[1.5vw]" style={{ color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>10 Papers · EMNLP · AAAI · NeurIPS · CVPR · ACL · NAACL</span>
      </div>

      {/* Main content — left-aligned */}
      <div className="absolute inset-0 flex flex-col justify-center px-[6vw]">
        <div className="mb-[2vh]">
          <span className="font-body text-[1.8vw] tracking-widest uppercase" style={{ color: '#7C3AED', fontFamily: 'DM Sans, sans-serif' }}>Research Presentation</span>
        </div>
        <h1 className="font-display font-bold leading-none tracking-tight mb-[3vh]" style={{ fontSize: '7vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', textWrap: 'balance' }}>
          Navigating the
          <span style={{ color: '#00D4FF' }}> KG-RAG</span>
          <br />Cosmos
        </h1>
        <p className="font-body font-light mb-[5vh]" style={{ fontSize: '2.2vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif', maxWidth: '55vw' }}>
          From differentiable retrieval to Riemannian manifolds — and the road to RMF-RAG
        </p>

        {/* Paper venue badges */}
        <div className="flex flex-wrap gap-[1vw]">
          {[
            { label: 'D-RAG', venue: 'EMNLP 25', color: '#00D4FF' },
            { label: 'CogGRAG', venue: 'AAAI 26', color: '#7C3AED' },
            { label: 'Goal-KG', venue: 'Info. 26', color: '#10B981' },
            { label: 'M³KG', venue: 'CVPR 26', color: '#F59E0B' },
            { label: 'KG-RAG', venue: 'Sci.Rep 25', color: '#F43F5E' },
            { label: 'GraphFlow', venue: 'NeurIPS 25', color: '#3B82F6' },
            { label: 'SG-RAG', venue: 'ICNLSP 24', color: '#EAB308' },
            { label: 'HyKGE', venue: 'ACL 25', color: '#14B8A6' },
            { label: 'KRAGEN', venue: 'Bioinf. 24', color: '#A855F7' },
            { label: 'KG²RAG', venue: 'NAACL 25', color: '#818CF8' },
          ].map((p) => (
            <div key={p.label} className="flex items-center gap-[0.4vw] px-[1vw] py-[0.6vh] rounded" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${p.color}40` }}>
              <div className="w-[0.5vw] h-[0.5vw] rounded-full" style={{ background: p.color }} />
              <span className="font-display font-semibold" style={{ fontSize: '1.2vw', color: p.color, fontFamily: 'Space Grotesk, sans-serif' }}>{p.label}</span>
              <span className="font-body" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>{p.venue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[0.4vh]" style={{ background: 'linear-gradient(90deg, #7C3AED, #00D4FF, #7C3AED)' }} />
    </div>
  );
}
