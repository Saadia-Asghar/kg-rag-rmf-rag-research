export default function S04ThreeHops() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>

      {/* Header */}
      <div style={{ background: '#1E1B4B', padding: '2.5vh 4vw 2vh' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#A5B4FC', marginBottom: '0.5vh' }}>THE HARD PROBLEM</div>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '3vw', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
          Why is multi-hop reasoning so hard?
        </h2>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '3vh 5vw', gap: '2.5vh' }}>

        {/* The question */}
        <div style={{ background: '#1E1B4B', borderRadius: '1vw', padding: '2vh 2.5vw', border: '2px solid #4F46E5' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#A5B4FC', marginBottom: '0.8vh' }}>REAL QUESTION AN AI NEEDS TO ANSWER:</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2.2vw', fontWeight: 700, color: '#FFFFFF', fontStyle: 'italic' }}>
            "What drug should I give a patient with the disease caused by the TCF7L2 gene mutation?"
          </div>
        </div>

        {/* The chain */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
          {/* Step 1 */}
          <div style={{ flex: 1, background: '#EFF6FF', borderRadius: '0.8vw', padding: '2vh 1.5vw', border: '2px solid #2563EB', textAlign: 'center' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#2563EB', marginBottom: '0.8vh' }}>HOP 1</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 800, color: '#1E3A8A' }}>TCF7L2 gene</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.2vw', color: '#1D4ED8', marginTop: '0.5vh' }}>This gene exists in the knowledge graph</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3vh' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '2.5vw', color: '#2563EB' }}>→</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1vw', color: '#78716C', textAlign: 'center' }}>causes</div>
          </div>

          {/* Step 2 */}
          <div style={{ flex: 1, background: '#F0FDF4', borderRadius: '0.8vw', padding: '2vh 1.5vw', border: '2px solid #16A34A', textAlign: 'center' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#16A34A', marginBottom: '0.8vh' }}>HOP 2</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 800, color: '#14532D' }}>Type 2 Diabetes</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.2vw', color: '#15803D', marginTop: '0.5vh' }}>AI must first find THIS, then keep going</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3vh' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '2.5vw', color: '#16A34A' }}>→</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1vw', color: '#78716C', textAlign: 'center' }}>treated by</div>
          </div>

          {/* Step 3 */}
          <div style={{ flex: 1, background: '#FFF7ED', borderRadius: '0.8vw', padding: '2vh 1.5vw', border: '2px solid #EA580C', textAlign: 'center' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#EA580C', marginBottom: '0.8vh' }}>HOP 3</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 800, color: '#7C2D12' }}>Metformin</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.2vw', color: '#C2410C', marginTop: '0.5vh' }}>The final answer — only reachable after 3 jumps</div>
          </div>
        </div>

        {/* Why it's hard */}
        <div style={{ display: 'flex', gap: '2vw' }}>
          <div style={{ flex: 1, background: '#FFF0F0', borderRadius: '0.8vw', padding: '1.8vh 1.8vw', border: '1px solid #FECACA' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 700, color: '#DC2626', marginBottom: '0.5vh' }}>Why search fails here</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.35vw', color: '#44403C', margin: 0, lineHeight: 1.5 }}>
              If you just search for "TCF7L2 + drug", you find nothing — because <strong>no single fact</strong> directly connects gene to drug. You must follow the chain.
            </p>
          </div>
          <div style={{ flex: 1, background: '#FFFBEB', borderRadius: '0.8vw', padding: '1.8vh 1.8vw', border: '1px solid #FDE68A' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 700, color: '#B45309', marginBottom: '0.5vh' }}>Why depth matters</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.35vw', color: '#44403C', margin: 0, lineHeight: 1.5 }}>
              The 10 methods we are about to look at all attempt to follow this chain. Each one gets part of it right. <strong>None gets all of it right.</strong>
            </p>
          </div>
          <div style={{ flex: 1, background: '#EFF6FF', borderRadius: '0.8vw', padding: '1.8vh 1.8vw', border: '1px solid #BFDBFE' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 700, color: '#1D4ED8', marginBottom: '0.5vh' }}>What RMF-RAG does differently</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.35vw', color: '#44403C', margin: 0, lineHeight: 1.5 }}>
              It maps the knowledge graph into a <strong>curved space</strong> where depth is encoded geometrically — so 3-hop paths are naturally easier to follow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
