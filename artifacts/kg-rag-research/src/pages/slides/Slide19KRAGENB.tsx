const ACCENT = '#A855F7';

export default function Slide19KRAGENB() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute bottom-0 right-0 w-[38vw] h-[38vh] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)' }} />
      <div className="flex items-center gap-[1.5vw] px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(168,85,247,0.2)' }}>
        <div className="flex items-center justify-center w-[4.5vw] h-[4.5vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}18`, border: `2px solid ${ACCENT}`, color: ACCENT, fontSize: '1.8vw', fontFamily: 'Space Grotesk, sans-serif' }}>09</div>
        <div>
          <div className="font-display font-bold" style={{ fontSize: '2.2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>KRAGEN — Results &amp; Key Findings</div>
          <div className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Soman et al. · Bioinformatics 2024</div>
        </div>
        <div className="ml-auto px-[1vw] py-[0.5vh] rounded font-body font-semibold" style={{ background: `${ACCENT}20`, color: ACCENT, fontSize: '1.3vw', border: `1px solid ${ACCENT}40`, fontFamily: 'DM Sans, sans-serif' }}>RESULTS</div>
      </div>
      <div className="flex flex-1 gap-0 px-[4vw] py-[2.5vh]">
        <div className="flex flex-col gap-[2.5vh] pr-[3vw]" style={{ flex: '0 0 48%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="font-mono uppercase tracking-widest" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Core Architectural Contribution</div>
          <div className="rounded-xl p-[2vw]" style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}30` }}>
            <div className="font-display font-bold mb-[1.5vh]" style={{ fontSize: '1.8vw', color: ACCENT, fontFamily: 'Space Grotesk, sans-serif' }}>Graph-of-Thoughts RAG</div>
            <p className="font-body" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>
              Vertex-level retrieval at each reasoning step outperforms single-pass retrieval. This is KRAGEN's central finding: the timing of retrieval matters as much as the method.
            </p>
          </div>
          <div className="flex flex-col gap-[1.5vh]">
            <div className="font-mono uppercase tracking-widest mb-[0.3vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>vs. Alternative Approaches</div>
            {[
              { sys: 'No KG (LLM alone)', result: 'High hallucination, no pathway awareness', icon: '-' },
              { sys: 'Single-pass RAG', result: 'Misses knowledge needed at later steps', icon: '~' },
              { sys: 'KRAGEN (GoT + vertex RAG)', result: 'Correct multi-hop pathway answers', icon: '+' },
            ].map((r) => (
              <div key={r.sys} className="flex gap-[1vw] items-center rounded-lg px-[1.2vw] py-[0.8vh]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="font-display font-bold w-[1.8vw] text-center shrink-0" style={{ fontSize: '1.4vw', color: r.icon === '+' ? ACCENT : r.icon === '-' ? '#F43F5E' : '#94A3B8', fontFamily: 'Space Grotesk, sans-serif' }}>{r.icon}</div>
                <div>
                  <div className="font-body font-semibold" style={{ fontSize: '1.3vw', color: '#F1F5F9', fontFamily: 'DM Sans, sans-serif' }}>{r.sys}</div>
                  <div className="font-body" style={{ fontSize: '1.2vw', color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}>{r.result}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-[2.5vh] pl-[3vw]" style={{ flex: 1 }}>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Key Finding</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}30` }}>
              <p className="font-display font-semibold" style={{ fontSize: '1.7vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', textWrap: 'balance' }}>
                KG-guided retrieval at each reasoning step is better than one big retrieval step followed by reasoning — the graph structure itself guides what to look up next.
              </p>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Limitation</div>
            <div className="flex gap-[0.8vw] items-start">
              <div className="mt-[0.5vh] w-[0.5vw] h-[0.5vw] shrink-0 rounded-full" style={{ background: '#F43F5E' }} />
              <span className="font-body" style={{ fontSize: '1.5vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Domain-specific to biomedical gene-disease pathways; reasoning graph construction requires human domain expertise; Weaviate index must be rebuilt per domain</span>
            </div>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Bridge to RMF-RAG</div>
            <div className="rounded-xl p-[1.8vw]" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.25)' }}>
              <p className="font-body" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>
                KRAGEN's vertex-level retrieval loop could replace Weaviate cosine similarity with <span style={{ color: '#00D4FF', fontWeight: 600 }}>Poincaré geodesic distance</span> — hierarchical biological pathways (gene → protein → pathway → disease) embed naturally in hyperbolic space.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: ACCENT }} />
    </div>
  );
}
