export default function S12HyKGEGap() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>
      <div style={{ background: '#1E1B4B', padding: '2vh 4vw 1.8vh', display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
        <div style={{ background: '#14B8A6', color: '#FFFFFF', borderRadius: '50%', width: '3.5vw', height: '3.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 800, flexShrink: 0 }}>08</div>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC' }}>PAPER 8 OF 10 — ACL 2025</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2.4vw', fontWeight: 800, color: '#FFFFFF' }}>HyKGE — Hypothesis Knowledge Graph Enhanced RAG</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '2.5vw', padding: '2.5vh 4vw' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#F0FDF4', borderRadius: '0.8vw', padding: '2vh 2vw', border: '2px solid #86EFAC', flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#15803D', marginBottom: '1vh' }}>WHAT IT FIGURED OUT</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.8vw', fontWeight: 800, color: '#14532D', marginBottom: '1.2vh', lineHeight: 1.3 }}>Guess what the answer might look like before searching</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.45vw', color: '#166534', lineHeight: 1.5, margin: 0 }}>
              "My stomach hurts" is patient language. "GERD" is database language. HyKGE bridges this by generating a hypothesis first: "This sounds like it could be acid reflux, GERD, peptic ulcer..." Then it searches using those technical terms. This alone cuts hallucination by 57%.
            </p>
          </div>

          <div style={{ background: '#FFF0F0', borderRadius: '0.8vw', padding: '2vh 2vw', border: '2px solid #FCA5A5', flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#DC2626', marginBottom: '1vh' }}>WHAT'S STILL MISSING</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.8vw', fontWeight: 800, color: '#7F1D1D', marginBottom: '1.2vh', lineHeight: 1.3 }}>The hypothesis must still match the database word-for-word</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.45vw', color: '#991B1B', lineHeight: 1.5, margin: 0 }}>
              After generating the hypothesis, HyKGE still needs to align its words exactly to the knowledge graph entries. If it guesses "acid reflux" but the graph says "GERD", the match fails. It bridges half the vocabulary gap — but not with geometry.
            </p>
          </div>
        </div>

        <div style={{ flex: '0 0 34%', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#F0FDFA', borderRadius: '0.8vw', padding: '2vh 2vw', border: '1px solid #99F6E4', flex: 1 }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#14B8A6', marginBottom: '1vh' }}>IMPORTANT CORRECTION</div>
            <div style={{ background: '#FFF7ED', borderRadius: '0.6vw', padding: '1.2vh 1.2vw', border: '1px solid #FED7AA', marginBottom: '1.5vh' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#C2410C' }}>"Hy" = Hypothesis</span>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.2vw', color: '#44403C', marginTop: '0.3vh' }}>NOT "hyperbolic". HyKGE has zero hyperbolic geometry. This is a common misreading in the literature.</div>
            </div>
            <div style={{ padding: '1.2vh 1.2vw', background: '#CCFBF1', borderRadius: '0.6vw' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#0F766E' }}>Real result</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.25vw', color: '#0D9488' }}>MMCU-Medical +14.3% EM, hallucination -57%, context relevance +84%</div>
            </div>
          </div>

          <div style={{ background: '#1E1B4B', borderRadius: '0.8vw', padding: '1.5vh 1.5vw' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC', marginBottom: '0.5vh' }}>THE GAP IN ONE LINE</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.4 }}>Brilliant vocabulary bridge — but landing zone still requires exact words.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
