const ACCENT = '#EAB308';

export default function Slide15SGRAGB() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute bottom-0 right-0 w-[38vw] h-[38vh] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(234,179,8,0.07) 0%, transparent 70%)' }} />
      <div className="flex items-center gap-[1.5vw] px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(234,179,8,0.2)' }}>
        <div className="flex items-center justify-center w-[4.5vw] h-[4.5vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}18`, border: `2px solid ${ACCENT}`, color: ACCENT, fontSize: '1.8vw', fontFamily: 'Space Grotesk, sans-serif' }}>07</div>
        <div>
          <div className="font-display font-bold" style={{ fontSize: '2.2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>SG-RAG — Results &amp; Key Findings</div>
          <div className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Saleh et al. · ICNLSP 2024 — MetaQA benchmark</div>
        </div>
        <div className="ml-auto px-[1vw] py-[0.5vh] rounded font-body font-semibold" style={{ background: `${ACCENT}20`, color: ACCENT, fontSize: '1.3vw', border: `1px solid ${ACCENT}40`, fontFamily: 'DM Sans, sans-serif' }}>RESULTS</div>
      </div>
      <div className="flex flex-1 gap-0 px-[4vw] py-[2.5vh]">
        <div className="flex flex-col gap-[2.5vh] pr-[3vw]" style={{ flex: '0 0 48%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="font-mono uppercase tracking-widest" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>MetaQA Accuracy by Hop Depth</div>
          <div className="flex flex-col gap-[1.8vh]">
            {[
              { hop: '1-Hop', sgrag: 90, vanilla: 42, color: ACCENT },
              { hop: '2-Hop', sgrag: 73, vanilla: 27, color: ACCENT },
              { hop: '3-Hop', sgrag: 58, vanilla: 19, color: ACCENT },
            ].map((r) => (
              <div key={r.hop} className="flex flex-col gap-[0.6vh]">
                <div className="flex justify-between items-center">
                  <span className="font-display font-semibold" style={{ fontSize: '1.5vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>{r.hop}</span>
                  <div className="flex gap-[1.5vw]">
                    <span className="font-body" style={{ fontSize: '1.3vw', color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}>Vanilla: {r.vanilla}%</span>
                    <span className="font-display font-bold" style={{ fontSize: '1.5vw', color: r.color, fontFamily: 'Space Grotesk, sans-serif' }}>SG-RAG: {r.sgrag}%</span>
                  </div>
                </div>
                <div className="relative w-full rounded-full h-[1.2vh]" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${r.vanilla}%`, background: '#334155' }} />
                  <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${r.sgrag}%`, background: `${r.color}40`, border: `1px solid ${r.color}` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg p-[1.5vw]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="font-mono uppercase tracking-widest mb-[0.5vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>The 3-Hop Problem</div>
            <p className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>90% → 58% accuracy drop from 1-hop to 3-hop reveals that Cypher-based traversal degrades significantly with depth — this is the exact gap RMF-RAG targets.</p>
          </div>
        </div>
        <div className="flex flex-col gap-[2.5vh] pl-[3vw]" style={{ flex: 1 }}>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Key Finding</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}30` }}>
              <p className="font-display font-semibold" style={{ fontSize: '1.7vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', textWrap: 'balance' }}>
                Graph traversal beats semantic search by 3× on 3-hop questions — but accuracy still drops sharply with depth, proving that multi-hop reasoning at scale remains unsolved.
              </p>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Limitation</div>
            <div className="flex gap-[0.8vw] items-start">
              <div className="mt-[0.5vh] w-[0.5vw] h-[0.5vw] shrink-0 rounded-full" style={{ background: '#F43F5E' }} />
              <span className="font-body" style={{ fontSize: '1.5vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Requires perfect LLM-generated Cypher — any schema mismatch or entity naming error breaks the entire pipeline. No learned component to recover from errors.</span>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Bridge to RMF-RAG</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.25)' }}>
              <p className="font-body" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>
                SG-RAG's 3-hop accuracy drop (90% → 58%) is the exact problem RMF-RAG proposes to solve. In Poincaré space, entities N hops deep have larger hyperbolic radius — <span style={{ color: '#00D4FF', fontWeight: 600 }}>depth is encoded geometrically</span>, not counted hop-by-hop.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: ACCENT }} />
    </div>
  );
}
