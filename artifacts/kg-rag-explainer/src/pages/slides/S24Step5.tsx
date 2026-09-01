export default function S24Step5() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>
      <div style={{ background: '#1E1B4B', padding: '2vh 4vw 1.8vh', display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
        <div style={{ background: '#DC2626', color: '#FFFFFF', borderRadius: '50%', width: '3.5vw', height: '3.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.6vw', fontWeight: 800, flexShrink: 0 }}>5</div>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC' }}>STEP 5 OF 5 — ANSWER GENERATION</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2.4vw', fontWeight: 800, color: '#FFFFFF' }}>The LLM generates the answer using the retrieved chain</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '3vw', padding: '2.5vh 4vw', alignItems: 'stretch' }}>

        {/* Left — the chain passed to LLM */}
        <div style={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#44403C' }}>What gets handed to the language model:</div>

          <div style={{ background: '#F8FAFC', borderRadius: '0.8vw', padding: '2vh 2vw', border: '1px solid #E2E8F0' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#64748B', marginBottom: '1vh' }}>CONTEXT PASSED TO LLM:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh' }}>
              <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center', background: '#FEF9C3', borderRadius: '0.5vw', padding: '0.8vh 1vw', border: '1px solid #FDE68A' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#92400E', flexShrink: 0 }}>Fact 1:</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.35vw', color: '#78350F' }}>TCF7L2 gene mutation causes increased risk of Type 2 Diabetes</span>
              </div>
              <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center', background: '#DCFCE7', borderRadius: '0.5vw', padding: '0.8vh 1vw', border: '1px solid #86EFAC' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#14532D', flexShrink: 0 }}>Fact 2:</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.35vw', color: '#166534' }}>Type 2 Diabetes is characterized by insulin resistance in peripheral tissues</span>
              </div>
              <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center', background: '#FFF7ED', borderRadius: '0.5vw', padding: '0.8vh 1vw', border: '1px solid #FED7AA' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#9A3412', flexShrink: 0 }}>Fact 3:</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.35vw', color: '#7C2D12' }}>Insulin resistance leads to reduced GLUT4 transporter activity and elevated blood glucose</span>
              </div>
              <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center', background: '#EDE9FE', borderRadius: '0.5vw', padding: '0.8vh 1vw', border: '1px solid #DDD6FE' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#4C1D95', flexShrink: 0 }}>Fact 4:</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.35vw', color: '#5B21B6' }}>Metformin reduces hepatic glucose production and improves insulin sensitivity — first-line treatment for T2D</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#F0FDF4', borderRadius: '0.8vw', padding: '2vh 2vw', border: '2px solid #86EFAC' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#15803D', marginBottom: '1vh' }}>THE ANSWER THE LLM GENERATES:</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.55vw', color: '#14532D', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
              "The TCF7L2 gene mutation increases the risk of Type 2 Diabetes by impairing insulin signalling. The primary mechanism is insulin resistance, which reduces glucose uptake in tissues. The first-line drug treatment is <strong>Metformin</strong>, which works by reducing hepatic glucose production and improving insulin sensitivity."
            </p>
          </div>
        </div>

        {/* Right — what changed vs old methods */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#FFFBEB', borderRadius: '0.8vw', padding: '1.8vh 1.8vw', border: '1px solid #FDE68A' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#92400E', marginBottom: '0.8vh' }}>Why this answer is better</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh' }}>
              <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#16A34A', fontWeight: 700, flexShrink: 0 }}>GROUNDED</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#44403C' }}>Every claim traces back to a retrieved fact — no hallucination</span>
              </div>
              <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#16A34A', fontWeight: 700, flexShrink: 0 }}>COMPLETE</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#44403C' }}>Includes the mechanism (Insulin Resistance) even though it wasn't in the question</span>
              </div>
              <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#16A34A', fontWeight: 700, flexShrink: 0 }}>SPECIFIC</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#44403C' }}>Found Metformin, not just "a diabetes drug" — hyperbolic space preserves specificity</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#EFF6FF', borderRadius: '0.8vw', padding: '1.8vh 1.8vw', border: '1px solid #BFDBFE', flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#1D4ED8', marginBottom: '0.8vh' }}>The full picture: what RMF-RAG did differently</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
              <div style={{ background: '#FFFFFF', borderRadius: '0.5vw', padding: '0.8vh 1vw', border: '1px solid #E0E7FF' }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.2vw', fontWeight: 700, color: '#3730A3' }}>Step 1 </span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.25vw', color: '#44403C' }}>Placed all entities in curved (hyperbolic) Poincaré space — depth is geometry</span>
              </div>
              <div style={{ background: '#FFFFFF', borderRadius: '0.5vw', padding: '0.8vh 1vw', border: '1px solid #E0E7FF' }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.2vw', fontWeight: 700, color: '#3730A3' }}>Step 2 </span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.25vw', color: '#44403C' }}>Geodesic hop 1: TCF7L2 → Type 2 Diabetes (follows the curve, not straight line)</span>
              </div>
              <div style={{ background: '#FFFFFF', borderRadius: '0.5vw', padding: '0.8vh 1vw', border: '1px solid #E0E7FF' }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.2vw', fontWeight: 700, color: '#3730A3' }}>Step 3 </span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.25vw', color: '#44403C' }}>Geodesic hop 2: Diabetes → Insulin Resistance (bridge mechanism)</span>
              </div>
              <div style={{ background: '#FFFFFF', borderRadius: '0.5vw', padding: '0.8vh 1vw', border: '1px solid #E0E7FF' }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.2vw', fontWeight: 700, color: '#3730A3' }}>Step 4 </span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.25vw', color: '#44403C' }}>Geodesic hop 3: Resistance → Metformin (the answer)</span>
              </div>
              <div style={{ background: '#FFFFFF', borderRadius: '0.5vw', padding: '0.8vh 1vw', border: '1px solid #E0E7FF' }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.2vw', fontWeight: 700, color: '#3730A3' }}>Step 5 </span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.25vw', color: '#44403C' }}>LLM wrote a grounded, complete, specific answer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
