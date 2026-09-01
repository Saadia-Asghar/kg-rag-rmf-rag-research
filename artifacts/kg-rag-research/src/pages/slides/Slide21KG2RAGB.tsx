const ACCENT = '#818CF8';

export default function Slide21KG2RAGB() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute bottom-0 left-0 w-[38vw] h-[38vh] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.07) 0%, transparent 70%)' }} />
      <div className="flex items-center gap-[1.5vw] px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(129,140,248,0.2)' }}>
        <div className="flex items-center justify-center w-[4.5vw] h-[4.5vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}18`, border: `2px solid ${ACCENT}`, color: ACCENT, fontSize: '1.8vw', fontFamily: 'Space Grotesk, sans-serif' }}>10</div>
        <div>
          <div className="font-display font-bold" style={{ fontSize: '2.2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>KG²RAG — Results &amp; Key Findings</div>
          <div className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Zhu et al. · NAACL 2025</div>
        </div>
        <div className="ml-auto px-[1vw] py-[0.5vh] rounded font-body font-semibold" style={{ background: `${ACCENT}20`, color: ACCENT, fontSize: '1.3vw', border: `1px solid ${ACCENT}40`, fontFamily: 'DM Sans, sans-serif' }}>RESULTS</div>
      </div>
      <div className="flex flex-1 gap-0 px-[4vw] py-[2.5vh]">
        <div className="flex flex-col gap-[2.5vh] pr-[3vw]" style={{ flex: '0 0 48%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="font-mono uppercase tracking-widest" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>HotpotQA F1 Score Comparison</div>
          <div className="flex flex-col gap-[1.5vh]">
            {[
              { sys: 'Semantic RAG', f1: 0.617, color: '#64748B' },
              { sys: 'Hybrid RAG (BM25 + Dense)', f1: 0.653, color: '#94A3B8' },
              { sys: 'KG²RAG', f1: 0.663, color: ACCENT },
            ].map((r) => (
              <div key={r.sys} className="flex flex-col gap-[0.5vh]">
                <div className="flex justify-between">
                  <span className="font-body" style={{ fontSize: '1.4vw', color: r.color, fontFamily: 'DM Sans, sans-serif' }}>{r.sys}</span>
                  <span className="font-display font-bold" style={{ fontSize: '1.6vw', color: r.color, fontFamily: 'Space Grotesk, sans-serif' }}>{r.f1}</span>
                </div>
                <div className="w-full rounded-full h-[1vh]" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded-full" style={{ width: `${r.f1 * 100}%`, background: r.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-[1.5vw]">
            <div className="flex flex-col items-center justify-center rounded-xl p-[1.5vw]" style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}30`, flex: 1 }}>
              <div className="font-display font-bold" style={{ fontSize: '4vw', color: ACCENT, lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>8.1</div>
              <div className="font-body text-center mt-[0.5vh]" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Avg chunks used (vs 10 for others)</div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl p-[1.5vw]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', flex: 1 }}>
              <div className="font-display font-bold" style={{ fontSize: '4vw', color: '#94A3B8', lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>19%</div>
              <div className="font-body text-center mt-[0.5vh]" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Fewer chunks, better answers</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[2.5vh] pl-[3vw]" style={{ flex: 1 }}>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Key Finding</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}30` }}>
              <p className="font-display font-semibold" style={{ fontSize: '1.7vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', textWrap: 'balance' }}>
                Using the KG to find factually-connected chunks — not just semantically similar ones — produces better answers with fewer tokens sent to the LLM.
              </p>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Critical Gap</div>
            <div className="rounded-xl p-[1.5vw]" style={{ background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.25)' }}>
              <p className="font-body" style={{ fontSize: '1.5vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>
                KG²RAG fails when the KG is sparse — BFS finds no connecting paths, and MST has nothing to prune. Performance collapses on domain-specific sparse knowledge graphs.
              </p>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Bridge to RMF-RAG</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.25)' }}>
              <p className="font-body" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>
                RMF-RAG's geodesic flow avoids BFS entirely — instead of counting hops, it retrieves by <span style={{ color: '#00D4FF', fontWeight: 600 }}>Poincaré distance</span>. Potentially more robust to sparse KGs where BFS finds no paths but semantic proximity still exists.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: ACCENT }} />
    </div>
  );
}
