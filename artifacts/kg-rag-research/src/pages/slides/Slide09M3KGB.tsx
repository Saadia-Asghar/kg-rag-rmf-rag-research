const ACCENT = '#F59E0B';

export default function Slide09M3KGB() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute bottom-0 left-0 w-[38vw] h-[38vh] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)' }} />
      <div className="flex items-center gap-[1.5vw] px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(245,158,11,0.2)' }}>
        <div className="flex items-center justify-center w-[4.5vw] h-[4.5vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}18`, border: `2px solid ${ACCENT}`, color: ACCENT, fontSize: '1.8vw', fontFamily: 'Space Grotesk, sans-serif' }}>04</div>
        <div>
          <div className="font-display font-bold" style={{ fontSize: '2.2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>M³KG-RAG — Results &amp; Key Findings</div>
          <div className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Park et al. · CVPR 2026</div>
        </div>
        <div className="ml-auto px-[1vw] py-[0.5vh] rounded font-body font-semibold" style={{ background: `${ACCENT}20`, color: ACCENT, fontSize: '1.3vw', border: `1px solid ${ACCENT}40`, fontFamily: 'DM Sans, sans-serif' }}>RESULTS</div>
      </div>
      <div className="flex flex-1 gap-0 px-[4vw] py-[2.5vh]">
        <div className="flex flex-col gap-[2.5vh] pr-[3vw]" style={{ flex: '0 0 48%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="font-mono uppercase tracking-widest" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>VALOR Benchmark — Model Judge Score</div>
          <div className="flex flex-col gap-[1.5vh]">
            {[
              { sys: 'No retrieval', score: 32.42, max: 50 },
              { sys: 'VAT-KG (prior best)', score: 35.44, max: 50 },
              { sys: 'M³KG-RAG (Ours)', score: 44.67, max: 50 },
            ].map((r, i) => (
              <div key={r.sys} className="flex flex-col gap-[0.5vh]">
                <div className="flex justify-between">
                  <span className="font-body" style={{ fontSize: '1.4vw', color: i === 2 ? ACCENT : '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>{r.sys}</span>
                  <span className="font-display font-bold" style={{ fontSize: '1.6vw', color: i === 2 ? ACCENT : '#64748B', fontFamily: 'Space Grotesk, sans-serif' }}>{r.score}</span>
                </div>
                <div className="w-full rounded-full h-[1vh]" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(r.score / r.max) * 100}%`, background: i === 2 ? ACCENT : '#334155' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-[1.5vw]">
            <div className="flex flex-col items-center justify-center rounded-xl p-[1.5vw]" style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}30`, flex: 1 }}>
              <div className="font-display font-bold" style={{ fontSize: '4vw', color: ACCENT, lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>60.2%</div>
              <div className="font-body text-center" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Judge preference win rate over baseline</div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl p-[1.5vw]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', flex: 1 }}>
              <div className="font-display font-bold" style={{ fontSize: '4vw', color: '#94A3B8', lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>+26%</div>
              <div className="font-body text-center" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Gain over no-retrieval baseline</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[2.5vh] pl-[3vw]" style={{ flex: 1 }}>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Key Finding</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}30` }}>
              <p className="font-display font-semibold" style={{ fontSize: '1.7vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', textWrap: 'balance' }}>
                Grounding verification (GRASP) is the crucial step — removing facts that aren't visually or audibly confirmed cuts hallucinated claims before they reach the LLM.
              </p>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Limitation</div>
            <div className="flex gap-[0.8vw] items-start">
              <div className="mt-[0.5vh] w-[0.5vw] h-[0.5vw] shrink-0 rounded-full" style={{ background: '#F43F5E' }} />
              <span className="font-body" style={{ fontSize: '1.5vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Multi-stage LLM pipeline requires H100 GPU — computationally heavy; thresholds need per-benchmark tuning</span>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Bridge to RMF-RAG</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.25)' }}>
              <p className="font-body" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>
                The multimodal "embedding gap" could be addressed by modality-specific <span style={{ color: '#00D4FF', fontWeight: 600 }}>Riemannian manifolds</span> with cross-modal geodesic alignment — a natural extension of RMF-RAG's hyperbolic space.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: ACCENT }} />
    </div>
  );
}
