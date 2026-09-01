const base = import.meta.env.BASE_URL;

export default function Slide24RMFHow() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(124,58,237,0.1) 0%, transparent 60%)' }} />

      <div className="flex items-center justify-between px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(124,58,237,0.2)' }}>
        <div>
          <div className="font-mono uppercase tracking-widest mb-[0.5vh]" style={{ fontSize: '1.1vw', color: '#7C3AED', fontFamily: 'DM Mono, monospace' }}>The Mechanism</div>
          <div className="font-display font-bold" style={{ fontSize: '2.8vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>How RMF-RAG Works</div>
        </div>
        <div className="px-[1.5vw] py-[0.8vh] rounded-lg font-display font-semibold" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)', color: '#7C3AED', fontSize: '1.4vw', fontFamily: 'Space Grotesk, sans-serif' }}>ARCHITECTURE</div>
      </div>

      <div className="flex flex-1 gap-0 px-[4vw] py-[2.5vh]">
        {/* Left — Poincaré visualization + formula */}
        <div className="flex flex-col gap-[2vh] pr-[3vw]" style={{ flex: '0 0 45%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          {/* Poincaré disk SVG */}
          <div className="flex items-center justify-center rounded-xl overflow-hidden" style={{ flex: 1, background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <svg viewBox="0 0 300 300" style={{ width: '22vw', height: '22vw' }}>
              {/* Disk boundary */}
              <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="1.5" />
              {/* Geodesic curves */}
              <path d="M 60 200 Q 150 80 240 200" fill="none" stroke="rgba(0,212,255,0.4)" strokeWidth="1.5" />
              <path d="M 80 240 Q 150 120 220 240" fill="none" stroke="rgba(124,58,237,0.4)" strokeWidth="1.5" />
              <path d="M 100 60 Q 200 150 100 240" fill="none" stroke="rgba(0,212,255,0.25)" strokeWidth="1" />
              {/* Center node — root entity */}
              <circle cx="150" cy="150" r="10" fill="#00D4FF" fillOpacity="0.9" />
              <text x="162" y="145" fill="#00D4FF" fontSize="10" fontFamily="DM Mono, monospace">Root</text>
              {/* 1-hop nodes */}
              <circle cx="110" cy="120" r="7" fill="rgba(0,212,255,0.6)" />
              <circle cx="190" cy="120" r="7" fill="rgba(0,212,255,0.6)" />
              <circle cx="150" cy="100" r="7" fill="rgba(0,212,255,0.6)" />
              {/* Lines from root to 1-hop */}
              <line x1="150" y1="150" x2="110" y2="120" stroke="rgba(0,212,255,0.35)" strokeWidth="1" />
              <line x1="150" y1="150" x2="190" y2="120" stroke="rgba(0,212,255,0.35)" strokeWidth="1" />
              <line x1="150" y1="150" x2="150" y2="100" stroke="rgba(0,212,255,0.35)" strokeWidth="1" />
              {/* 3-hop nodes — near boundary */}
              <circle cx="68" cy="90" r="5" fill="rgba(124,58,237,0.8)" />
              <circle cx="230" cy="90" r="5" fill="rgba(124,58,237,0.8)" />
              <circle cx="150" cy="35" r="5" fill="rgba(124,58,237,0.8)" />
              <circle cx="60" cy="170" r="5" fill="rgba(124,58,237,0.6)" />
              <circle cx="240" cy="170" r="5" fill="rgba(124,58,237,0.6)" />
              <text x="60" y="260" fill="#94A3B8" fontSize="9" fontFamily="DM Mono, monospace">← General (center)</text>
              <text x="60" y="275" fill="#94A3B8" fontSize="9" fontFamily="DM Mono, monospace">Specific → (boundary)</text>
              {/* Labels */}
              <text x="40" y="85" fill="#7C3AED" fontSize="9" fontFamily="DM Mono, monospace">3-hop</text>
              <text x="88" y="108" fill="rgba(0,212,255,0.7)" fontSize="9" fontFamily="DM Mono, monospace">1-hop</text>
            </svg>
          </div>

          {/* Formula */}
          <div className="rounded-xl p-[1.5vw]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="font-mono uppercase tracking-widest mb-[0.8vh]" style={{ fontSize: '1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Poincaré Geodesic Distance</div>
            <div className="font-mono" style={{ fontSize: '1.3vw', color: '#00D4FF', fontFamily: 'DM Mono, monospace' }}>
              d(u,v) = cosh⁻¹(1 + 2‖u−v‖² /
            </div>
            <div className="font-mono ml-[4vw]" style={{ fontSize: '1.3vw', color: '#00D4FF', fontFamily: 'DM Mono, monospace' }}>
              ((1−‖u‖²)(1−‖v‖²)))
            </div>
            <div className="mt-[0.8vh] font-body" style={{ fontSize: '1.2vw', color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}>where ‖u‖ &lt; 1, ‖v‖ &lt; 1 (inside the unit ball)</div>
          </div>
        </div>

        {/* Right — pipeline steps */}
        <div className="flex flex-col gap-[1.8vh] pl-[3vw]" style={{ flex: 1 }}>
          <div className="font-mono uppercase tracking-widest" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>The RMF-RAG Pipeline</div>
          {[
            { n: '1', title: 'Take D-RAG\'s open-source codebase as the base', sub: 'Best existing differentiable KG-RAG implementation (EMNLP 2025)', color: '#00D4FF' },
            { n: '2', title: 'Replace Euclidean GNN embeddings with Poincaré ball', sub: 'pip install geoopt → use geoopt.manifolds.PoincareBall for entity vectors', color: '#7C3AED' },
            { n: '3', title: 'Change distance function: L2 → Poincaré geodesic', sub: 'Single function swap — all other components unchanged for clean ablation', color: '#10B981' },
            { n: '4', title: 'Keep Gumbel-Softmax training loop intact', sub: 'Differentiability preserved through Riemannian backprop via geoopt.optim.RiemannianSGD', color: '#F59E0B' },
            { n: '5', title: 'Measure: does hyperbolic geometry help at 3-hop and 4-hop?', sub: 'Compare vs D-RAG baseline on WebQSP, CWQ, MetaQA-3hop — same everything, different geometry', color: '#F43F5E' },
          ].map((s) => (
            <div key={s.n} className="flex gap-[1vw] items-start rounded-lg px-[1.2vw] py-[1vh]" style={{ background: `${s.color}07`, border: `1px solid ${s.color}20` }}>
              <div className="shrink-0 flex items-center justify-center w-[2.5vw] h-[2.5vw] rounded-full font-display font-bold" style={{ background: `${s.color}15`, border: `1.5px solid ${s.color}`, color: s.color, fontSize: '1.2vw', fontFamily: 'Space Grotesk, sans-serif' }}>{s.n}</div>
              <div>
                <div className="font-display font-semibold" style={{ fontSize: '1.45vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>{s.title}</div>
                <div className="font-mono" style={{ fontSize: '1.2vw', color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: 'linear-gradient(90deg, #7C3AED, #00D4FF, #7C3AED)' }} />
    </div>
  );
}
