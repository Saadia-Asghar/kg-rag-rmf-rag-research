const ACCENT = '#14B8A6';

export default function Slide16HyKGEA() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute top-0 right-0 w-[40vw] h-[40vh] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)' }} />
      <div className="flex items-center gap-[1.5vw] px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(20,184,166,0.2)' }}>
        <div className="flex items-center justify-center w-[4.5vw] h-[4.5vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}18`, border: `2px solid ${ACCENT}`, color: ACCENT, fontSize: '1.8vw', fontFamily: 'Space Grotesk, sans-serif' }}>08</div>
        <div>
          <div className="font-display font-bold" style={{ fontSize: '2.2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>HyKGE — Hypothesis Knowledge Graph Enhanced RAG</div>
          <div className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Xinke Jiang et al. · ACL 2025 — Medical LLMs</div>
        </div>
        <div className="ml-auto px-[1vw] py-[0.5vh] rounded font-body font-semibold" style={{ background: `${ACCENT}20`, color: ACCENT, fontSize: '1.3vw', border: `1px solid ${ACCENT}40`, fontFamily: 'DM Sans, sans-serif' }}>QUERY &amp; METHOD</div>
      </div>
      <div className="flex flex-1 gap-0 px-[4vw] py-[2.5vh]">
        <div className="flex flex-col gap-[2.5vh] pr-[3vw]" style={{ flex: '0 0 52%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="rounded-lg p-[1.4vw]" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.35)' }}>
            <div className="font-mono uppercase tracking-widest mb-[0.5vh]" style={{ fontSize: '1vw', color: '#7C3AED', fontFamily: 'DM Mono, monospace' }}>Important Clarification</div>
            <p className="font-body font-semibold" style={{ fontSize: '1.4vw', color: '#F1F5F9', fontFamily: 'DM Sans, sans-serif' }}>
              "Hy" stands for <span style={{ color: ACCENT }}>Hypothesis</span> — NOT hyperbolic. HyKGE has no Poincaré or Riemannian geometry. This is a common misreading.
            </p>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: ACCENT, fontFamily: 'DM Mono, monospace' }}>The Research Question</div>
            <p className="font-display font-semibold leading-snug" style={{ fontSize: '2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', textWrap: 'balance' }}>
              If a patient says "my stomach hurts and I get acid sometimes," the KG has "GERD" — how do you bridge that vocabulary gap before retrieval?
            </p>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>The Core Problem</div>
            <div className="flex flex-col gap-[1.2vh]">
              {[
                'Patient queries use lay language; medical KGs use clinical terminology — retrieval finds nothing',
                'Without query expansion, even perfect KGs return empty results for vague symptom descriptions',
                'Hallucination from medical LLMs: 55%+ error rate when retrieval context is missing or wrong',
              ].map((t, i) => (
                <div key={i} className="flex gap-[1vw] items-start">
                  <div className="mt-[0.5vh] w-[0.5vw] h-[0.5vw] rounded-full shrink-0" style={{ background: ACCENT }} />
                  <span className="font-body" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[2vh] pl-[3vw]" style={{ flex: 1 }}>
          <div className="font-mono uppercase tracking-widest mb-[0.5vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>The Methodology</div>
          {[
            { n: '1', title: 'Hypothesis Output (HO) Generation', desc: 'LLM generates a "potential answer hypothesis" from the vague patient query — "stomach hurts" expands to "GERD, H2 blockers, antacids, gastroesophageal reflux..."' },
            { n: '2', title: 'W2NER Entity Linking', desc: 'Extracts clean medical entities from the hypothesis; aligns them with KG entities using GTE embeddings' },
            { n: '3', title: '3-Chain Retrieval', desc: 'Finds paths, co-ancestors, and co-occurrences in UMLS + CMeKG medical knowledge graphs' },
            { n: '4', title: 'HO Fragment Reranking', desc: 'Breaks hypothesis into distinct fragments; reranks retrieved KG chains by diversity + relevance to avoid redundancy' },
          ].map((s) => (
            <div key={s.n} className="flex gap-[1vw] items-start">
              <div className="shrink-0 flex items-center justify-center w-[2.8vw] h-[2.8vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}15`, border: `1.5px solid ${ACCENT}50`, color: ACCENT, fontSize: '1.3vw', fontFamily: 'Space Grotesk, sans-serif' }}>{s.n}</div>
              <div>
                <div className="font-display font-semibold" style={{ fontSize: '1.5vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>{s.title}</div>
                <div className="font-body" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>{s.desc}</div>
              </div>
            </div>
          ))}
          <div className="rounded-lg p-[1.3vw]" style={{ background: `${ACCENT}0D`, border: `1px solid ${ACCENT}25` }}>
            <p className="font-body" style={{ fontSize: '1.35vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>Tested on MMCU-Medical and GRBENCH medical KG benchmarks with LLaMA and Qwen models</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: ACCENT }} />
    </div>
  );
}
