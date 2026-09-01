const ACCENT = '#3B82F6';

export default function Slide13GraphFlowB() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute bottom-0 left-0 w-[38vw] h-[38vh] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)' }} />
      <div className="flex items-center gap-[1.5vw] px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="flex items-center justify-center w-[4.5vw] h-[4.5vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}18`, border: `2px solid ${ACCENT}`, color: ACCENT, fontSize: '1.8vw', fontFamily: 'Space Grotesk, sans-serif' }}>06</div>
        <div>
          <div className="font-display font-bold" style={{ fontSize: '2.2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>GraphFlow — Results &amp; Key Findings</div>
          <div className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Yu et al. · NeurIPS 2025 — Closest prior work to RMF-RAG</div>
        </div>
        <div className="ml-auto px-[1vw] py-[0.5vh] rounded font-body font-semibold" style={{ background: `${ACCENT}20`, color: ACCENT, fontSize: '1.3vw', border: `1px solid ${ACCENT}40`, fontFamily: 'DM Sans, sans-serif' }}>RESULTS</div>
      </div>
      <div className="flex flex-1 gap-0 px-[4vw] py-[2.5vh]">
        <div className="flex flex-col gap-[2.5vh] pr-[3vw]" style={{ flex: '0 0 48%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="font-mono uppercase tracking-widest" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>STaRK Benchmark Performance</div>
          <div className="flex flex-col items-center justify-center rounded-xl p-[2vw]" style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}30` }}>
            <div className="font-display font-bold" style={{ fontSize: '7vw', color: ACCENT, lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>+10%</div>
            <div className="font-body text-center mt-[1vh]" style={{ fontSize: '1.8vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>Hit rate improvement over GPT-4o baseline on multi-step reasoning tasks</div>
          </div>
          <div className="rounded-lg p-[1.5vw]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="font-mono uppercase tracking-widest mb-[0.8vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Limitation</div>
            <div className="flex flex-col gap-[0.8vh]">
              <div className="flex gap-[0.8vw] items-start">
                <div className="mt-[0.5vh] w-[0.5vw] h-[0.5vw] shrink-0 rounded-full" style={{ background: '#F43F5E' }} />
                <span className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>High latency on dynamic graphs — changing KG requires retraining the flow estimator</span>
              </div>
              <div className="flex gap-[0.8vw] items-start">
                <div className="mt-[0.5vh] w-[0.5vw] h-[0.5vw] shrink-0 rounded-full" style={{ background: '#F43F5E' }} />
                <span className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Works best on text-rich KGs; sparse domain graphs underperform</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[2.5vh] pl-[3vw]" style={{ flex: 1 }}>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Key Finding</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}30` }}>
              <p className="font-display font-semibold" style={{ fontSize: '1.7vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', textWrap: 'balance' }}>
                Treating multi-step retrieval as flow matching — with distributed credit across transitions — outperforms step-by-step path search by enabling richer policy learning.
              </p>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>The Geometry Gap</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.35)' }}>
              <p className="font-body mb-[1.5vh]" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>
                GraphFlow proves flow matching works for KG retrieval. But it uses <span style={{ color: ACCENT, fontWeight: 600 }}>flat Euclidean space</span> — where hierarchical KG structure is distorted.
              </p>
              <p className="font-body" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>
                RMF-RAG's proposal: run the same flow matching on a <span style={{ color: '#7C3AED', fontWeight: 600 }}>Riemannian hyperbolic manifold</span>. Tree-like KGs fit naturally in Poincaré space — the flow estimator would need fewer parameters and converge faster.
              </p>
            </div>
          </div>
          <div className="rounded-lg p-[1.5vw]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="font-mono" style={{ fontSize: '1.3vw', color: '#64748B', fontFamily: 'DM Mono, monospace' }}>GraphFlow (NeurIPS 2025) = nearest prior work to RMF-RAG. Same insight, different geometry.</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: ACCENT }} />
    </div>
  );
}
