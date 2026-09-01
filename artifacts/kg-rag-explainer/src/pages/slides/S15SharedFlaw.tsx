export default function S15SharedFlaw() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#1E1B4B' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(220,38,38,0.12) 0%, transparent 60%)' }} />

      {/* Top label */}
      <div style={{ padding: '4vh 5vw 2vh', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#A5B4FC' }}>SECTION BREAK — ALL 10 PAPERS REVIEWED</div>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '4vw', fontWeight: 800, color: '#FFFFFF', margin: '0.5vh 0 0', textWrap: 'balance' }}>
          They all have the<br/><span style={{ color: '#F87171' }}>same underlying flaw</span>
        </h2>
      </div>

      {/* Paper grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1vh', padding: '0 4vw 2vh', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '0.7vw', padding: '1.2vh 1.2vw', display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#67E8F9' }}>D-RAG</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.15vw', color: '#94A3B8', lineHeight: 1.4 }}>Trains well → flat Euclidean distance</div>
        </div>
        <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '0.7vw', padding: '1.2vh 1.2vw', display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#A78BFA' }}>CogGRAG</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.15vw', color: '#94A3B8', lineHeight: 1.4 }}>Verifies each step → flat search underneath</div>
        </div>
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '0.7vw', padding: '1.2vh 1.2vw', display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#6EE7B7' }}>Goal-KG</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.15vw', color: '#94A3B8', lineHeight: 1.4 }}>Exact queries → vocabulary mismatch</div>
        </div>
        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '0.7vw', padding: '1.2vh 1.2vw', display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#FCD34D' }}>M³KG-RAG</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.15vw', color: '#94A3B8', lineHeight: 1.4 }}>All 3 modalities → separate flat spaces</div>
        </div>
        <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '0.7vw', padding: '1.2vh 1.2vw', display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#FDA4AF' }}>KG-RAG Wang</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.15vw', color: '#94A3B8', lineHeight: 1.4 }}>Dual channel → hops counted equally</div>
        </div>
        <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '0.7vw', padding: '1.2vh 1.2vw', display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#93C5FD' }}>GraphFlow</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.15vw', color: '#94A3B8', lineHeight: 1.4 }}>Flow matching → still Euclidean space</div>
        </div>
        <div style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: '0.7vw', padding: '1.2vh 1.2vw', display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#FEF08A' }}>SG-RAG</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.15vw', color: '#94A3B8', lineHeight: 1.4 }}>Graph paths → 90% → 58% accuracy cliff</div>
        </div>
        <div style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: '0.7vw', padding: '1.2vh 1.2vw', display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#5EEAD4' }}>HyKGE</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.15vw', color: '#94A3B8', lineHeight: 1.4 }}>Hypothesis first → exact match still needed</div>
        </div>
        <div style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '0.7vw', padding: '1.2vh 1.2vw', display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#D8B4FE' }}>KRAGEN</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.15vw', color: '#94A3B8', lineHeight: 1.4 }}>Step-by-step search → flat cosine each time</div>
        </div>
        <div style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: '0.7vw', padding: '1.2vh 1.2vw', display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#C7D2FE' }}>KG²RAG</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.15vw', color: '#94A3B8', lineHeight: 1.4 }}>Graph connections → sparse = broken</div>
        </div>
      </div>

      {/* The shared insight */}
      <div style={{ margin: '0 4vw 3vh', background: 'rgba(220,38,38,0.12)', border: '2px solid rgba(220,38,38,0.4)', borderRadius: '1vw', padding: '2vh 2.5vw', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2vw' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2vw', fontWeight: 800, color: '#F87171', flexShrink: 0 }}>The shared flaw:</div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.7vw', color: '#FFFFFF', margin: 0, lineHeight: 1.4 }}>
            Knowledge graphs are <strong>hierarchical</strong> — general things at the top, specific things at the bottom. Every one of these 10 systems treats the graph as if it were <strong>flat</strong>. That is like using a city street map to navigate a mountain range.
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[0.4vh]" style={{ background: 'linear-gradient(90deg, #2563EB, #7C3AED, #DC2626)' }} />
    </div>
  );
}
