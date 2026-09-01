export default function Slide23RMFWhat() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(0,212,255,0.07) 0%, transparent 55%), radial-gradient(ellipse at 70% 50%, rgba(124,58,237,0.08) 0%, transparent 55%)' }} />

      <div className="flex items-center justify-between px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
        <div>
          <div className="font-mono uppercase tracking-widest mb-[0.5vh]" style={{ fontSize: '1.1vw', color: '#00D4FF', fontFamily: 'DM Mono, monospace' }}>Proposed Research Direction</div>
          <div className="font-display font-bold" style={{ fontSize: '2.8vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>What is RMF-RAG?</div>
        </div>
        <div className="px-[1.5vw] py-[0.8vh] rounded-lg font-display font-semibold" style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.4)', color: '#00D4FF', fontSize: '1.4vw', fontFamily: 'Space Grotesk, sans-serif' }}>NOVEL IDEA</div>
      </div>

      <div className="flex flex-1 gap-0 px-[4vw] py-[2.5vh]">
        {/* Left — definition */}
        <div className="flex flex-col gap-[2.5vh] pr-[3vw]" style={{ flex: '0 0 50%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="rounded-xl p-[2vw]" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.25)' }}>
            <div className="font-mono uppercase tracking-widest mb-[1vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Full Name</div>
            <div className="font-display font-bold" style={{ fontSize: '2vw', color: '#00D4FF', fontFamily: 'Space Grotesk, sans-serif' }}>Riemannian Manifold Flow RAG</div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Core Hypothesis</div>
            <p className="font-display font-semibold" style={{ fontSize: '1.8vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', textWrap: 'balance' }}>
              Embedding KG entities in a Poincaré ball and retrieving by geodesic distance — instead of Euclidean cosine similarity — improves 3-hop and 4-hop answer accuracy while reducing hallucinations.
            </p>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Novelty Verdict</div>
            <div className="flex flex-col gap-[1vh]">
              {[
                { claim: 'Poincaré KG embeddings for RAG retrieval', rating: 'NOVEL', color: '#10B981' },
                { claim: 'Geodesic distance as the retrieval score', rating: 'NOVEL', color: '#10B981' },
                { claim: 'Addressing multi-hop failure via curvature', rating: 'NOVEL', color: '#10B981' },
                { claim: 'Hyperbolic cross-attention in LLM decoder', rating: 'PARTIAL', color: '#F59E0B' },
              ].map((n) => (
                <div key={n.claim} className="flex items-center justify-between gap-[1vw]">
                  <span className="font-body" style={{ fontSize: '1.4vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>{n.claim}</span>
                  <span className="font-mono font-bold shrink-0" style={{ fontSize: '1.1vw', color: n.color, fontFamily: 'DM Mono, monospace' }}>{n.rating}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — 3 core innovations */}
        <div className="flex flex-col gap-[2vh] pl-[3vw]" style={{ flex: 1 }}>
          <div className="font-mono uppercase tracking-widest" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Three Core Innovations</div>
          {[
            {
              n: '1',
              title: 'Poincaré Ball Entity Embedding',
              desc: 'KG entities are embedded in a Poincaré ball of dimension d. Hierarchically general entities (root concepts) sit near the center; specific leaf entities (multi-hop deep) sit near the boundary. Depth is encoded geometrically.',
              color: '#00D4FF',
            },
            {
              n: '2',
              title: 'Geodesic Distance Retrieval',
              desc: 'Instead of cosine similarity, retrieve by minimum Poincaré geodesic distance: d(u,v) = cosh⁻¹(1 + 2‖u−v‖² / ((1−‖u‖²)(1−‖v‖²))). This distance naturally weights multi-hop depth — 3-hop entities are geometrically further than 1-hop entities.',
              color: '#7C3AED',
            },
            {
              n: '3',
              title: 'D-RAG Training Loop (Preserved)',
              desc: 'Keep D-RAG\'s Gumbel-Softmax differentiable training intact — swap only the Euclidean GNN embeddings for geoopt Poincaré ball embeddings and the distance function. Everything else stays the same for a clean ablation.',
              color: '#10B981',
            },
          ].map((s) => (
            <div key={s.n} className="flex gap-[1vw] rounded-xl p-[1.5vw]" style={{ background: `${s.color}08`, border: `1px solid ${s.color}25` }}>
              <div className="shrink-0 flex items-center justify-center w-[3vw] h-[3vw] rounded-full font-display font-bold" style={{ background: `${s.color}15`, border: `2px solid ${s.color}`, color: s.color, fontSize: '1.4vw', fontFamily: 'Space Grotesk, sans-serif' }}>{s.n}</div>
              <div>
                <div className="font-display font-semibold" style={{ fontSize: '1.5vw', color: s.color, fontFamily: 'Space Grotesk, sans-serif' }}>{s.title}</div>
                <div className="font-body" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: 'linear-gradient(90deg, #00D4FF, #7C3AED, #10B981)' }} />
    </div>
  );
}
