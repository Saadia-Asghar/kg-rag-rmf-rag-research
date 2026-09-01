const ACCENT = '#7C3AED';

export default function Slide05CogGRAGB() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />

      <div className="flex items-center gap-[1.5vw] px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(124,58,237,0.2)' }}>
        <div className="flex items-center justify-center w-[4.5vw] h-[4.5vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}18`, border: `2px solid ${ACCENT}`, color: ACCENT, fontSize: '1.8vw', fontFamily: 'Space Grotesk, sans-serif' }}>02</div>
        <div>
          <div className="font-display font-bold" style={{ fontSize: '2.2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>CogGRAG — Results &amp; Key Findings</div>
          <div className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Cheng et al. · AAAI 2026</div>
        </div>
        <div className="ml-auto px-[1vw] py-[0.5vh] rounded font-body font-semibold" style={{ background: `${ACCENT}20`, color: ACCENT, fontSize: '1.3vw', border: `1px solid ${ACCENT}40`, fontFamily: 'DM Sans, sans-serif' }}>RESULTS</div>
      </div>

      <div className="flex flex-1 gap-0 px-[4vw] py-[2.5vh]">
        <div className="flex flex-col gap-[2.5vh] pr-[3vw]" style={{ flex: '0 0 48%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="font-mono uppercase tracking-widest" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Star Result — Hallucination</div>
          <div className="flex gap-[1.5vw]">
            <div className="flex flex-col items-center justify-center rounded-xl p-[1.5vw]" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', flex: 1 }}>
              <div className="font-display font-bold" style={{ fontSize: '4.5vw', color: '#F43F5E', lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>55.2%</div>
              <div className="font-body text-center" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Hallucination rate — baseline LLM</div>
            </div>
            <div className="flex items-center">
              <div className="font-display font-bold" style={{ fontSize: '3vw', color: '#94A3B8', fontFamily: 'Space Grotesk, sans-serif' }}>→</div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl p-[1.5vw]" style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}30`, flex: 1 }}>
              <div className="font-display font-bold" style={{ fontSize: '4.5vw', color: ACCENT, lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>25.0%</div>
              <div className="font-body text-center" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Hallucination rate — CogGRAG</div>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="grid grid-cols-3 px-[1vw] py-[0.8vh]" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <span className="font-mono" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Benchmark</span>
              <span className="font-mono" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Model</span>
              <span className="font-mono" style={{ fontSize: '1.1vw', color: ACCENT, fontFamily: 'DM Mono, monospace' }}>F1</span>
            </div>
            {[
              ['HotpotQA', 'LLaMA2-13B', '35.5%'],
              ['CWQ', 'LLaMA2-13B', '55.8%'],
              ['WebQSP', 'Qwen2.5-32B', '73.0%'],
            ].map(([d, m, r]) => (
              <div key={d} className="grid grid-cols-3 px-[1vw] py-[0.8vh]" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="font-body" style={{ fontSize: '1.3vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>{d}</span>
                <span className="font-body" style={{ fontSize: '1.3vw', color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}>{m}</span>
                <span className="font-body font-semibold" style={{ fontSize: '1.3vw', color: ACCENT, fontFamily: 'DM Sans, sans-serif' }}>{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[2.5vh] pl-[3vw]" style={{ flex: 1 }}>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Key Finding</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}30` }}>
              <p className="font-display font-semibold" style={{ fontSize: '1.7vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', textWrap: 'balance' }}>
                Explicit verification and honest abstention ("I don't know") are the most powerful anti-hallucination mechanisms in this survey — cutting error rate by 55%.
              </p>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Cost</div>
            <div className="flex gap-[0.8vw] items-start">
              <div className="mt-[0.5vh] w-[0.5vw] h-[0.5vw] shrink-0 rounded-full" style={{ background: '#F43F5E' }} />
              <span className="font-body" style={{ fontSize: '1.5vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>18–35 seconds per question — multiple LLM calls make CogGRAG expensive for real-time use</span>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Bridge to RMF-RAG</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.25)' }}>
              <p className="font-body" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>
                CogGRAG's mind-map tree is a perfect natural hierarchy for Poincaré space. Parent nodes (general) sit near the <span style={{ color: '#00D4FF', fontWeight: 600 }}>center</span>; leaf nodes (specific) near the <span style={{ color: '#00D4FF', fontWeight: 600 }}>boundary</span>. Geodesic flow could replace cosine-filtered expansion.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: ACCENT }} />
    </div>
  );
}
