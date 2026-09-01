const ACCENT = '#F43F5E';

export default function Slide11KGRagWangB() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute bottom-0 right-0 w-[38vw] h-[38vh] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.07) 0%, transparent 70%)' }} />
      <div className="flex items-center gap-[1.5vw] px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(244,63,94,0.2)' }}>
        <div className="flex items-center justify-center w-[4.5vw] h-[4.5vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}18`, border: `2px solid ${ACCENT}`, color: ACCENT, fontSize: '1.8vw', fontFamily: 'Space Grotesk, sans-serif' }}>05</div>
        <div>
          <div className="font-display font-bold" style={{ fontSize: '2.2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>KG-RAG Wang et al. — Results &amp; Key Findings</div>
          <div className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Scientific Reports 2025</div>
        </div>
        <div className="ml-auto px-[1vw] py-[0.5vh] rounded font-body font-semibold" style={{ background: `${ACCENT}20`, color: ACCENT, fontSize: '1.3vw', border: `1px solid ${ACCENT}40`, fontFamily: 'DM Sans, sans-serif' }}>RESULTS</div>
      </div>
      <div className="flex flex-1 gap-0 px-[4vw] py-[2.5vh]">
        <div className="flex flex-col gap-[2.5vh] pr-[3vw]" style={{ flex: '0 0 48%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="font-mono uppercase tracking-widest" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Performance vs. DPR+BART Baseline</div>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="grid grid-cols-4 px-[1vw] py-[0.8vh]" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {['Dataset', 'Metric', 'Baseline', 'KG-RAG'].map((h) => (
                <span key={h} className="font-mono" style={{ fontSize: '1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{h}</span>
              ))}
            </div>
            {[
              ['Natural Qs', 'EM', '42.3%', '49.8%'],
              ['Natural Qs', 'F1', '57.8%', '64.2%'],
              ['PubMedQA', 'Accuracy', '~74.5%', '81.3%'],
              ['OpenDialKG', 'K-F1', '41.3%', '52.8%'],
            ].map(([d, m, b, r]) => (
              <div key={d + m} className="grid grid-cols-4 px-[1vw] py-[0.7vh]" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="font-body" style={{ fontSize: '1.25vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>{d}</span>
                <span className="font-body" style={{ fontSize: '1.25vw', color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}>{m}</span>
                <span className="font-body" style={{ fontSize: '1.25vw', color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}>{b}</span>
                <span className="font-body font-semibold" style={{ fontSize: '1.25vw', color: ACCENT, fontFamily: 'DM Sans, sans-serif' }}>{r}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg p-[1.2vw]" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <div className="font-mono uppercase tracking-widest mb-[0.5vh]" style={{ fontSize: '1vw', color: '#F59E0B', fontFamily: 'DM Mono, monospace' }}>Reporting Note</div>
            <p className="font-body" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Abstract cites 81.3% PubMedQA but Table 6 shows 68.9% EM — both are correct for different metrics (accuracy vs. exact match). Read carefully.</p>
          </div>
        </div>
        <div className="flex flex-col gap-[2.5vh] pl-[3vw]" style={{ flex: 1 }}>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Key Finding</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}30` }}>
              <p className="font-display font-semibold" style={{ fontSize: '1.7vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', textWrap: 'balance' }}>
                Fusing text retrieval and GNN path retrieval dynamically — not statically — lets the generator pick the most relevant knowledge type at each decoding step.
              </p>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Limitation</div>
            <div className="flex gap-[0.8vw] items-start">
              <div className="mt-[0.5vh] w-[0.5vw] h-[0.5vw] shrink-0 rounded-full" style={{ background: '#F43F5E' }} />
              <span className="font-body" style={{ fontSize: '1.5vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Static KG requires manual expert updates; path selection is expensive at scale; no multilingual support</span>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Bridge to RMF-RAG</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.25)' }}>
              <p className="font-body" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>
                The path attention scoring mechanism is exactly where Riemannian geometry helps most: replacing Euclidean path distance with <span style={{ color: '#00D4FF', fontWeight: 600 }}>Poincaré geodesic distance</span> would naturally weight shorter hierarchical paths over longer ones.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: ACCENT }} />
    </div>
  );
}
