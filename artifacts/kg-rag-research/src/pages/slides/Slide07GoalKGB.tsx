const ACCENT = '#10B981';

export default function Slide07GoalKGB() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute bottom-0 right-0 w-[38vw] h-[38vh] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)' }} />
      <div className="flex items-center gap-[1.5vw] px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(16,185,129,0.2)' }}>
        <div className="flex items-center justify-center w-[4.5vw] h-[4.5vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}18`, border: `2px solid ${ACCENT}`, color: ACCENT, fontSize: '1.8vw', fontFamily: 'Space Grotesk, sans-serif' }}>03</div>
        <div>
          <div className="font-display font-bold" style={{ fontSize: '2.2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>Goal-Oriented KG — Results &amp; Key Findings</div>
          <div className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Yano et al. · Information 2026</div>
        </div>
        <div className="ml-auto px-[1vw] py-[0.5vh] rounded font-body font-semibold" style={{ background: `${ACCENT}20`, color: ACCENT, fontSize: '1.3vw', border: `1px solid ${ACCENT}40`, fontFamily: 'DM Sans, sans-serif' }}>RESULTS</div>
      </div>
      <div className="flex flex-1 gap-0 px-[4vw] py-[2.5vh]">
        <div className="flex flex-col gap-[2.5vh] pr-[3vw]" style={{ flex: '0 0 48%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="font-mono uppercase tracking-widest" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>F1 Score Comparison</div>
          <div className="flex flex-col gap-[1.5vh]">
            {[
              { sys: 'Proposed (SPARQL on goal-tree)', f1: 0.83, color: ACCENT },
              { sys: 'Microsoft GraphRAG', f1: 0.40, color: '#94A3B8' },
              { sys: 'ChatGPT-4o alone', f1: 0.15, color: '#F43F5E' },
            ].map((r) => (
              <div key={r.sys} className="flex flex-col gap-[0.5vh]">
                <div className="flex justify-between">
                  <span className="font-body" style={{ fontSize: '1.4vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>{r.sys}</span>
                  <span className="font-display font-bold" style={{ fontSize: '1.6vw', color: r.color, fontFamily: 'Space Grotesk, sans-serif' }}>{r.f1}</span>
                </div>
                <div className="w-full rounded-full h-[1vh]" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded-full" style={{ width: `${r.f1 * 100}%`, background: r.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-[2vw] mt-[1vh]">
            <div className="flex flex-col items-center justify-center rounded-xl p-[1.5vw]" style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}30`, flex: 1 }}>
              <div className="font-display font-bold" style={{ fontSize: '4.5vw', color: ACCENT, lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>9.4s</div>
              <div className="font-body text-center" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Response time</div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl p-[1.5vw]" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', flex: 1 }}>
              <div className="font-display font-bold" style={{ fontSize: '4.5vw', color: '#F43F5E', lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>4 min</div>
              <div className="font-body text-center" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>GraphRAG index build</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[2.5vh] pl-[3vw]" style={{ flex: 1 }}>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Key Finding</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}30` }}>
              <p className="font-display font-semibold" style={{ fontSize: '1.7vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', textWrap: 'balance' }}>
                Symbolic SPARQL on a hand-built goal graph beats GPT-4o by 5.5× on specialized procedural knowledge — proving that structure beats scale for rule-driven domains.
              </p>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Limitation</div>
            <div className="flex gap-[0.8vw] items-start">
              <div className="mt-[0.5vh] w-[0.5vw] h-[0.5vw] shrink-0 rounded-full" style={{ background: '#F43F5E' }} />
              <span className="font-body" style={{ fontSize: '1.5vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Keyword matching fails on synonyms or vague queries — needs exact entity match to navigate the graph</span>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Bridge to RMF-RAG</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.25)' }}>
              <p className="font-body" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>
                This paper's goal-tree is exactly the data Poincaré embeddings were designed for. RMF-RAG's <span style={{ color: '#00D4FF', fontWeight: 600 }}>geodesic distance</span> would replace keyword matching — enabling synonym-robust retrieval without losing the hierarchical structure.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: ACCENT }} />
    </div>
  );
}
