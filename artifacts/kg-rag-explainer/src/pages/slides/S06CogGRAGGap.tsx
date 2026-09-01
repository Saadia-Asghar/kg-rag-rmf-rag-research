export default function S06CogGRAGGap() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>
      <div style={{ background: '#1E1B4B', padding: '2vh 4vw 1.8vh', display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
        <div style={{ background: '#7C3AED', color: '#FFFFFF', borderRadius: '50%', width: '3.5vw', height: '3.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 800, flexShrink: 0 }}>02</div>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC' }}>PAPER 2 OF 10 — AAAI 2026</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2.4vw', fontWeight: 800, color: '#FFFFFF' }}>CogGRAG — Cognitive-Inspired Graph RAG</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '2.5vw', padding: '2.5vh 4vw' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#F0FDF4', borderRadius: '0.8vw', padding: '2vh 2vw', border: '2px solid #86EFAC', flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#15803D', marginBottom: '1vh' }}>WHAT IT FIGURED OUT</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.8vw', fontWeight: 800, color: '#14532D', marginBottom: '1.2vh', lineHeight: 1.3 }}>Break the problem into steps and check your work</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.45vw', color: '#166534', lineHeight: 1.5, margin: 0 }}>
              Inspired by how humans think: System 1 (fast, automatic) and System 2 (slow, careful). CogGRAG breaks a hard question into smaller sub-questions, verifies each answer before moving on, and admits "I don't know" rather than guessing — cutting hallucination in half.
            </p>
          </div>

          <div style={{ background: '#FFF0F0', borderRadius: '0.8vw', padding: '2vh 2vw', border: '2px solid #FCA5A5', flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#DC2626', marginBottom: '1vh' }}>WHAT'S STILL MISSING</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.8vw', fontWeight: 800, color: '#7F1D1D', marginBottom: '1.2vh', lineHeight: 1.3 }}>Each verification step still searches in flat space</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.45vw', color: '#991B1B', lineHeight: 1.5, margin: 0 }}>
              CogGRAG is brilliant at deciding what to search for at each step — but when it actually searches the knowledge graph, it still uses ordinary flat vector similarity. Getting the reasoning steps right doesn't fix the geometry problem underneath.
            </p>
          </div>
        </div>

        <div style={{ flex: '0 0 34%', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#F5F3FF', borderRadius: '0.8vw', padding: '2vh 2vw', border: '1px solid #DDD6FE', flex: 1 }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#7C3AED', marginBottom: '1.2vh' }}>SIMPLE ANALOGY</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.4vw', color: '#44403C', lineHeight: 1.6, margin: 0 }}>
              Imagine a detective who is great at deciding which clue to investigate next — but when they go to the library to find that clue, they still use the wrong index. The reasoning plan is excellent. The library search is broken.
            </p>
            <div style={{ marginTop: '1.5vh', padding: '1.2vh 1.2vw', background: '#EDE9FE', borderRadius: '0.6vw' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#5B21B6' }}>Result</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.25vw', color: '#6D28D9' }}>Hallucination reduced from 55% to 25% — still not zero because search still fails on deep hops</div>
            </div>
          </div>

          <div style={{ background: '#1E1B4B', borderRadius: '0.8vw', padding: '1.5vh 1.5vw' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC', marginBottom: '0.5vh' }}>THE GAP IN ONE LINE</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.4 }}>Brilliant reasoning plan. Same wrong map underneath.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
