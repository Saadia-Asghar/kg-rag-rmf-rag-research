const ACCENT = '#818CF8';

export default function Slide20KG2RAGA() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute top-0 right-0 w-[40vw] h-[40vh] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)' }} />
      <div className="flex items-center gap-[1.5vw] px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(129,140,248,0.2)' }}>
        <div className="flex items-center justify-center w-[4.5vw] h-[4.5vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}18`, border: `2px solid ${ACCENT}`, color: ACCENT, fontSize: '1.8vw', fontFamily: 'Space Grotesk, sans-serif' }}>10</div>
        <div>
          <div className="font-display font-bold" style={{ fontSize: '2.2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>KG²RAG — Knowledge Graph-Guided Retrieval</div>
          <div className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Zhu, Xie, Liu, Li &amp; Hu · NAACL 2025</div>
        </div>
        <div className="ml-auto px-[1vw] py-[0.5vh] rounded font-body font-semibold" style={{ background: `${ACCENT}20`, color: ACCENT, fontSize: '1.3vw', border: `1px solid ${ACCENT}40`, fontFamily: 'DM Sans, sans-serif' }}>QUERY &amp; METHOD</div>
      </div>
      <div className="flex flex-1 gap-0 px-[4vw] py-[2.5vh]">
        <div className="flex flex-col gap-[2.5vh] pr-[3vw]" style={{ flex: '0 0 52%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: ACCENT, fontFamily: 'DM Mono, monospace' }}>The Research Question</div>
            <p className="font-display font-semibold leading-snug" style={{ fontSize: '2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', textWrap: 'balance' }}>
              Standard RAG retrieves isolated chunks — paragraph A and paragraph B, unconnected. How do you find factually related chunks even when they're semantically distant?
            </p>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>The Core Problem</div>
            <div className="flex flex-col gap-[1.2vh]">
              {[
                '"Paragraph A mentions Drug X. Paragraph B explains how Drug X works." — semantic search doesn\'t link them because the words are different',
                'LLM receives disconnected chunks and struggles to synthesize a coherent answer from them',
                'BM25 and dense retrieval both optimize for per-chunk relevance — not inter-chunk logical coherence',
              ].map((t, i) => (
                <div key={i} className="flex gap-[1vw] items-start">
                  <div className="mt-[0.5vh] w-[0.5vw] h-[0.5vw] rounded-full shrink-0" style={{ background: ACCENT }} />
                  <span className="font-body" style={{ fontSize: '1.6vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg p-[1.5vw]" style={{ background: `${ACCENT}0D`, border: `1px solid ${ACCENT}25` }}>
            <div className="font-mono uppercase tracking-widest mb-[0.8vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Tested On</div>
            <p className="font-body" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>HotpotQA — multi-hop Wikipedia QA requiring combining evidence from multiple documents</p>
          </div>
        </div>
        <div className="flex flex-col gap-[2vh] pl-[3vw]" style={{ flex: 1 }}>
          <div className="font-mono uppercase tracking-widest mb-[0.5vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>The Methodology — 4 Steps</div>
          {[
            { n: '1', title: 'Seed Chunks', desc: 'Standard top-k semantic retrieval to get initial relevant text chunks — same as conventional RAG' },
            { n: '2', title: 'KG Expansion via BFS', desc: 'Traverse the KG from seed chunk entities — find semantically distant but factually related chunks connected through shared KG nodes' },
            { n: '3', title: 'Maximum Spanning Tree (MST)', desc: 'Build a spanning tree over retrieved nodes, selecting the highest-information edges and eliminating redundant paths' },
            { n: '4', title: 'DFS Narrative Chunks', desc: 'Depth-first traversal of the MST produces coherent, logically flowing text paragraphs — LLM receives a connected narrative, not isolated pieces' },
          ].map((s) => (
            <div key={s.n} className="flex gap-[1vw] items-start">
              <div className="shrink-0 flex items-center justify-center w-[2.8vw] h-[2.8vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}15`, border: `1.5px solid ${ACCENT}50`, color: ACCENT, fontSize: '1.3vw', fontFamily: 'Space Grotesk, sans-serif' }}>{s.n}</div>
              <div>
                <div className="font-display font-semibold" style={{ fontSize: '1.5vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>{s.title}</div>
                <div className="font-body" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: ACCENT }} />
    </div>
  );
}
