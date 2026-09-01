const ACCENT = '#14B8A6';

export default function Slide17HyKGEB() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute bottom-0 left-0 w-[38vw] h-[38vh] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)' }} />
      <div className="flex items-center gap-[1.5vw] px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(20,184,166,0.2)' }}>
        <div className="flex items-center justify-center w-[4.5vw] h-[4.5vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}18`, border: `2px solid ${ACCENT}`, color: ACCENT, fontSize: '1.8vw', fontFamily: 'Space Grotesk, sans-serif' }}>08</div>
        <div>
          <div className="font-display font-bold" style={{ fontSize: '2.2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>HyKGE — Results &amp; Key Findings</div>
          <div className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Xinke Jiang et al. · ACL 2025</div>
        </div>
        <div className="ml-auto px-[1vw] py-[0.5vh] rounded font-body font-semibold" style={{ background: `${ACCENT}20`, color: ACCENT, fontSize: '1.3vw', border: `1px solid ${ACCENT}40`, fontFamily: 'DM Sans, sans-serif' }}>RESULTS</div>
      </div>
      <div className="flex flex-1 gap-0 px-[4vw] py-[2.5vh]">
        <div className="flex flex-col gap-[2.5vh] pr-[3vw]" style={{ flex: '0 0 48%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="font-mono uppercase tracking-widest" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Medical Benchmark Results</div>
          <div className="flex gap-[1.5vw]">
            <div className="flex flex-col items-center justify-center rounded-xl p-[1.5vw]" style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}30`, flex: 1 }}>
              <div className="font-display font-bold" style={{ fontSize: '4vw', color: ACCENT, lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>+14.3%</div>
              <div className="font-body text-center mt-[0.5vh]" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>MMCU-Medical Exact Match</div>
              <div className="font-body text-center" style={{ fontSize: '1.2vw', color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}>43.52% → 57.82%</div>
            </div>
          </div>
          <div className="flex gap-[1.5vw]">
            <div className="flex flex-col items-center justify-center rounded-xl p-[1.5vw]" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', flex: 1 }}>
              <div className="font-display font-bold" style={{ fontSize: '4vw', color: '#F43F5E', lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>-57%</div>
              <div className="font-body text-center mt-[0.5vh]" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Hallucination rate reduction</div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl p-[1.5vw]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', flex: 1 }}>
              <div className="font-display font-bold" style={{ fontSize: '4vw', color: '#94A3B8', lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>+84%</div>
              <div className="font-body text-center mt-[0.5vh]" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Context relevance gain</div>
            </div>
          </div>
          <div className="rounded-lg p-[1.4vw]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="font-mono uppercase tracking-widest mb-[0.5vh]" style={{ fontSize: '1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Limitation</div>
            <span className="font-body" style={{ fontSize: '1.35vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>W2NER entity linking still requires exact entity match after hypothesis expansion — vague or multi-word medical concepts can still fail alignment</span>
          </div>
        </div>
        <div className="flex flex-col gap-[2.5vh] pl-[3vw]" style={{ flex: 1 }}>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Key Finding</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}30` }}>
              <p className="font-display font-semibold" style={{ fontSize: '1.7vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', textWrap: 'balance' }}>
                Generating a hypothesis first — before retrieval — is the most effective way to bridge the vocabulary gap between patient language and clinical knowledge graphs.
              </p>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>What "Hy" Really Means — Correction for Lit Review</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.3)' }}>
              <p className="font-body" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>
                Any existing literature review claiming HyKGE uses "hyperbolic geometry" is <span style={{ color: '#F43F5E', fontWeight: 600 }}>incorrect</span>. "Hy" = Hypothesis. There is no Poincaré ball, no Riemannian metric, and no geodesic distance in this paper.
              </p>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Bridge to RMF-RAG</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.25)' }}>
              <p className="font-body" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>
                RMF-RAG could replace HyKGE's W2NER entity alignment with <span style={{ color: '#00D4FF', fontWeight: 600 }}>Poincaré geodesic proximity</span> — representing both hypothesis fragments and KG nodes as points in hyperbolic space and retrieving by manifold distance.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: ACCENT }} />
    </div>
  );
}
