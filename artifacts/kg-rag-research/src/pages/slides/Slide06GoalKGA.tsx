const ACCENT = '#10B981';

export default function Slide06GoalKGA() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute top-0 right-0 w-[38vw] h-[38vh] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />

      <div className="flex items-center gap-[1.5vw] px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(16,185,129,0.2)' }}>
        <div className="flex items-center justify-center w-[4.5vw] h-[4.5vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}18`, border: `2px solid ${ACCENT}`, color: ACCENT, fontSize: '1.8vw', fontFamily: 'Space Grotesk, sans-serif' }}>03</div>
        <div>
          <div className="font-display font-bold" style={{ fontSize: '2.2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>Goal-Oriented KG RAG</div>
          <div className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Yano, Kitamura &amp; Kuwabara · Information 2026 · ICAART 2025</div>
        </div>
        <div className="ml-auto px-[1vw] py-[0.5vh] rounded font-body font-semibold" style={{ background: `${ACCENT}20`, color: ACCENT, fontSize: '1.3vw', border: `1px solid ${ACCENT}40`, fontFamily: 'DM Sans, sans-serif' }}>QUERY &amp; METHOD</div>
      </div>

      <div className="flex flex-1 gap-0 px-[4vw] py-[2.5vh]">
        <div className="flex flex-col gap-[2.5vh] pr-[3vw]" style={{ flex: '0 0 52%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: ACCENT, fontFamily: 'DM Mono, monospace' }}>The Research Question</div>
            <p className="font-display font-semibold leading-snug" style={{ fontSize: '2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', textWrap: 'balance' }}>
              Can a structured procedural knowledge graph beat ChatGPT at answering dense regulatory questions — with zero hallucination?
            </p>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>The Core Problem</div>
            <div className="flex flex-col gap-[1.2vh]">
              {[
                'Accounting manuals contain procedural logic: goal → sub-goals → actions → counter-actions',
                'ChatGPT-4o on Japanese FSA impairment testing: F1 score of only 0.15 — 85% wrong',
                'A flat text corpus loses the logical flow — you need the goal structure, not just the text',
              ].map((t, i) => (
                <div key={i} className="flex gap-[1vw] items-start">
                  <div className="mt-[0.5vh] w-[0.5vw] h-[0.5vw] rounded-full shrink-0" style={{ background: ACCENT }} />
                  <span className="font-body" style={{ fontSize: '1.6vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg p-[1.5vw]" style={{ background: `${ACCENT}0D`, border: `1px solid ${ACCENT}25` }}>
            <div className="font-mono uppercase tracking-widest mb-[0.8vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Domain</div>
            <p className="font-body" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>247-node Japanese FSA asset-impairment accounting procedure tree — entirely symbolic, no learned embeddings</p>
          </div>
        </div>

        <div className="flex flex-col gap-[2vh] pl-[3vw]" style={{ flex: 1 }}>
          <div className="font-mono uppercase tracking-widest mb-[0.5vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>The Methodology</div>
          {[
            { n: '1', title: 'Goal-Oriented Graph', desc: 'Model procedural knowledge as a function decomposition tree with ways, sub-functions, and counter-functions' },
            { n: '2', title: 'RDF/Turtle Storage', desc: 'Convert tree to RDF triples with RDFS schema; add :keyword properties (extracted by GPT-4o-mini) to each node' },
            { n: '3', title: 'SPARQL Query Generation', desc: 'User question → GPT-4o-mini generates a formal SPARQL graph query' },
            { n: '4', title: 'Execute on RDF Graph', desc: 'Run SPARQL directly on stored graph — no embedding lookup, pure symbolic matching' },
            { n: '5', title: 'Verbalize Results', desc: 'Convert query results back to natural language; allow follow-up drilling into sub-goals' },
          ].map((s) => (
            <div key={s.n} className="flex gap-[1vw] items-start">
              <div className="shrink-0 flex items-center justify-center w-[2.8vw] h-[2.8vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}15`, border: `1.5px solid ${ACCENT}50`, color: ACCENT, fontSize: '1.3vw', fontFamily: 'Space Grotesk, sans-serif' }}>{s.n}</div>
              <div>
                <div className="font-display font-semibold" style={{ fontSize: '1.5vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>{s.title}</div>
                <div className="font-body" style={{ fontSize: '1.3vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: ACCENT }} />
    </div>
  );
}
