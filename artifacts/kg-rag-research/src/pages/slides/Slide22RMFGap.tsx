export default function Slide22RMFGap() {
  const papers = [
    { n: '01', title: 'D-RAG', gap: 'Euclidean GNN embeddings distort hierarchical KG depth', color: '#00D4FF' },
    { n: '02', title: 'CogGRAG', gap: 'Cosine similarity KG expansion ignores tree structure', color: '#7C3AED' },
    { n: '03', title: 'Goal-Oriented KG', gap: 'Keyword matching fails on synonyms — no semantic embedding', color: '#10B981' },
    { n: '04', title: 'M³KG-RAG', gap: 'Modality embeddings live in different Euclidean sub-spaces', color: '#F59E0B' },
    { n: '05', title: 'KG-RAG (Wang)', gap: 'Euclidean path distance scoring loses hierarchical depth', color: '#F43F5E' },
    { n: '06', title: 'GraphFlow', gap: 'Flow matching in flat Euclidean space — hierarchy distorted', color: '#3B82F6' },
    { n: '07', title: 'SG-RAG', gap: '3-hop accuracy drops 32 pts — depth encoding via Cypher breaks', color: '#EAB308' },
    { n: '08', title: 'HyKGE', gap: 'W2NER entity alignment requires exact keyword match', color: '#14B8A6' },
    { n: '09', title: 'KRAGEN', gap: 'Cosine similarity misses rare hierarchical gene–disease links', color: '#A855F7' },
    { n: '10', title: 'KG²RAG', gap: 'BFS fails on sparse KGs — no path, no connection found', color: '#818CF8' },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.12) 0%, transparent 60%)' }} />

      {/* Header */}
      <div className="flex items-center justify-between px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <div className="font-display font-bold" style={{ fontSize: '2.8vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>What All 10 Papers Share</div>
          <div className="font-body" style={{ fontSize: '1.5vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>The common limitation that points toward RMF-RAG</div>
        </div>
        <div className="px-[1.5vw] py-[0.8vh] rounded-lg font-display font-semibold" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)', color: '#7C3AED', fontSize: '1.4vw', fontFamily: 'Space Grotesk, sans-serif' }}>THE GAP</div>
      </div>

      {/* Grid of papers */}
      <div className="flex-1 px-[4vw] py-[2vh] grid grid-cols-2 gap-[1.2vh]">
        {papers.map((p) => (
          <div key={p.n} className="flex items-center gap-[1vw] rounded-lg px-[1.2vw] py-[0.9vh]" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${p.color}25` }}>
            <div className="shrink-0 flex items-center justify-center w-[2.5vw] h-[2.5vw] rounded-full font-display font-bold" style={{ background: `${p.color}15`, border: `1.5px solid ${p.color}`, color: p.color, fontSize: '1.1vw', fontFamily: 'Space Grotesk, sans-serif' }}>{p.n}</div>
            <div className="flex-1 min-w-0">
              <span className="font-display font-semibold" style={{ fontSize: '1.3vw', color: p.color, fontFamily: 'Space Grotesk, sans-serif' }}>{p.title} </span>
              <span className="font-body" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>— {p.gap}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom callout */}
      <div className="mx-[4vw] mb-[2.5vh] rounded-xl px-[2vw] py-[1.8vh]" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.4)' }}>
        <div className="flex items-center gap-[2vw]">
          <div className="font-display font-bold" style={{ fontSize: '1.8vw', color: '#7C3AED', fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap' }}>The Shared Insight:</div>
          <p className="font-display font-semibold" style={{ fontSize: '1.6vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>
            Every system that uses learned embeddings encodes KG structure in flat Euclidean space — which distorts the tree-like hierarchies that multi-hop reasoning depends on. <span style={{ color: '#00D4FF' }}>Hyperbolic space encodes hierarchy naturally.</span>
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: 'linear-gradient(90deg, #00D4FF, #7C3AED, #00D4FF)' }} />
    </div>
  );
}
