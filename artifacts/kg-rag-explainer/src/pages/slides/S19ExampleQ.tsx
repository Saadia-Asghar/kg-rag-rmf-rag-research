export default function S19ExampleQ() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#1E1B4B' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(37,99,235,0.15) 0%, transparent 60%)' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3vh 6vw', gap: '3vh', position: 'relative', zIndex: 1 }}>

        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.2vw', color: '#A5B4FC', textAlign: 'center' }}>STEP-BY-STEP WALKTHROUGH — SLIDES 19 TO 24</div>

        <div style={{ background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(96,165,250,0.5)', borderRadius: '1.2vw', padding: '3vh 4vw', width: '80%', textAlign: 'center' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#A5B4FC', marginBottom: '1.5vh' }}>THE QUESTION WE WILL ANSWER TOGETHER:</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '3vw', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.3, textWrap: 'balance' }}>
            "What drug should I give a patient with the disease caused by the TCF7L2 gene mutation?"
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2vw', width: '80%' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '0.8vw', padding: '2vh 1.5vw', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#60A5FA' }}>WHY THIS QUESTION IS HARD</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.5vw', color: '#E2E8F0', marginTop: '0.8vh', lineHeight: 1.5 }}>No single fact connects gene to drug directly. You need 3 jumps through the knowledge graph.</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '0.8vw', padding: '2vh 1.5vw', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#34D399' }}>THE 3-HOP CHAIN</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.5vw', color: '#E2E8F0', marginTop: '0.8vh', lineHeight: 1.5 }}>TCF7L2 gene → causes → Type 2 Diabetes → treated by → Metformin</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '0.8vw', padding: '2vh 1.5vw', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#F472B6' }}>WHAT RMF-RAG DOES</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.5vw', color: '#E2E8F0', marginTop: '0.8vh', lineHeight: 1.5 }}>Follows geodesic paths in hyperbolic space — each hop follows the curve of the dome</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1vw', alignItems: 'center' }}>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.5vw', color: '#94A3B8' }}>Coming up next:</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 700, color: '#60A5FA' }}>Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → The Answer</div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[0.4vh]" style={{ background: 'linear-gradient(90deg, #2563EB, #7C3AED, #DC2626)' }} />
    </div>
  );
}
