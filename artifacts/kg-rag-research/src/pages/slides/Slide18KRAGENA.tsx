const ACCENT = '#A855F7';

export default function Slide18KRAGENA() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute top-0 right-0 w-[40vw] h-[40vh] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)' }} />
      <div className="flex items-center gap-[1.5vw] px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(168,85,247,0.2)' }}>
        <div className="flex items-center justify-center w-[4.5vw] h-[4.5vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}18`, border: `2px solid ${ACCENT}`, color: ACCENT, fontSize: '1.8vw', fontFamily: 'Space Grotesk, sans-serif' }}>09</div>
        <div>
          <div className="font-display font-bold" style={{ fontSize: '2.2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>KRAGEN — Knowledge Retrieval-Augmented Generation Enhanced Network</div>
          <div className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Soman et al. · Bioinformatics 2024 — Biomedical Multi-gene QA</div>
        </div>
        <div className="ml-auto px-[1vw] py-[0.5vh] rounded font-body font-semibold" style={{ background: `${ACCENT}20`, color: ACCENT, fontSize: '1.3vw', border: `1px solid ${ACCENT}40`, fontFamily: 'DM Sans, sans-serif' }}>QUERY &amp; METHOD</div>
      </div>
      <div className="flex flex-1 gap-0 px-[4vw] py-[2.5vh]">
        <div className="flex flex-col gap-[2.5vh] pr-[3vw]" style={{ flex: '0 0 52%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: ACCENT, fontFamily: 'DM Mono, monospace' }}>The Research Question</div>
            <p className="font-display font-semibold leading-snug" style={{ fontSize: '2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', textWrap: 'balance' }}>
              "What disease pathway links Gene A to Disease B via Protein C?" — can you answer complex multi-gene biomedical questions by retrieving knowledge at each reasoning step, not just once upfront?
            </p>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>The Core Problem</div>
            <div className="flex flex-col gap-[1.2vh]">
              {[
                'Multi-gene biomedical questions require decomposing into a network of interconnected sub-problems — not just a linear chain',
                'A single upfront retrieval step misses knowledge needed only at later reasoning vertices',
                'Biomedical knowledge is sparse — hybrid dense + keyword search is needed to find rare gene-disease pathways',
              ].map((t, i) => (
                <div key={i} className="flex gap-[1vw] items-start">
                  <div className="mt-[0.5vh] w-[0.5vw] h-[0.5vw] rounded-full shrink-0" style={{ background: ACCENT }} />
                  <span className="font-body" style={{ fontSize: '1.6vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg p-[1.5vw]" style={{ background: `${ACCENT}0D`, border: `1px solid ${ACCENT}25` }}>
            <div className="font-mono uppercase tracking-widest mb-[0.8vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Domain &amp; Stack</div>
            <p className="font-body" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>Biomedical multi-gene pathway QA · Weaviate vector DB · dense similarity + BM25 keyword hybrid search</p>
          </div>
        </div>
        <div className="flex flex-col gap-[2vh] pl-[3vw]" style={{ flex: 1 }}>
          <div className="font-mono uppercase tracking-widest mb-[0.5vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>The Methodology</div>
          {[
            { n: '1', title: 'Graph-of-Thoughts Decomposition', desc: 'Break the question into a reasoning graph — not just a tree — of interconnected sub-problems with shared vertices' },
            { n: '2', title: 'Vertex-Level RAG', desc: 'For each vertex in the reasoning graph, run an independent retrieval step — knowledge is fetched only when needed for that sub-problem' },
            { n: '3', title: 'Hybrid Weaviate Search', desc: 'Each vertex retrieval uses dense vector similarity + BM25 keyword matching — critical for rare gene names and pathway identifiers' },
            { n: '4', title: 'Graph Aggregation', desc: 'Sub-problem answers propagate through the graph edges; final answer synthesizes across all vertices' },
          ].map((s) => (
            <div key={s.n} className="flex gap-[1vw] items-start">
              <div className="shrink-0 flex items-center justify-center w-[2.8vw] h-[2.8vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}15`, border: `1.5px solid ${ACCENT}50`, color: ACCENT, fontSize: '1.3vw', fontFamily: 'Space Grotesk, sans-serif' }}>{s.n}</div>
              <div>
                <div className="font-display font-semibold" style={{ fontSize: '1.5vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>{s.title}</div>
                <div className="font-body" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>{s.desc}</div>
              </div>
            </div>
          ))}
          <div className="rounded-xl p-[1.5vw] mt-[0.5vh]" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.25)' }}>
            <p className="font-body" style={{ fontSize: '1.4vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>
              <span style={{ color: '#00D4FF', fontWeight: 600 }}>Key insight:</span> Retrieving at each reasoning step — not once upfront — is architecturally similar to CogGRAG's bottom-up verification, but for graph-structured reasoning rather than tree decomposition.
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: ACCENT }} />
    </div>
  );
}
