export default function S11SGRAGGap() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>
      <div style={{ background: '#1E1B4B', padding: '2vh 4vw 1.8vh', display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
        <div style={{ background: '#EAB308', color: '#1C1917', borderRadius: '50%', width: '3.5vw', height: '3.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 800, flexShrink: 0 }}>07</div>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC' }}>PAPER 7 OF 10 — ICNLSP 2024</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2.4vw', fontWeight: 800, color: '#FFFFFF' }}>SG-RAG — SubGraph Retrieval-Augmented Generation</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '2.5vw', padding: '2.5vh 4vw' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#F0FDF4', borderRadius: '0.8vw', padding: '2vh 2vw', border: '2px solid #86EFAC', flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#15803D', marginBottom: '1vh' }}>WHAT IT FIGURED OUT</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.8vw', fontWeight: 800, color: '#14532D', marginBottom: '1.2vh', lineHeight: 1.3 }}>Retrieve full connected paths — not just isolated facts</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.45vw', color: '#166534', lineHeight: 1.5, margin: 0 }}>
              SG-RAG automatically writes a Cypher database query that retrieves entire connected chains from the graph at once. Instead of finding "fact A" and "fact B" separately, it finds "A → connected to → B → connected to → C" in one go. This is significantly smarter than keyword or vector search.
            </p>
          </div>

          <div style={{ background: '#FFF0F0', borderRadius: '0.8vw', padding: '2vh 2vw', border: '2px solid #FCA5A5', flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#DC2626', marginBottom: '1vh' }}>WHAT'S STILL MISSING</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.8vw', fontWeight: 800, color: '#7F1D1D', marginBottom: '1.2vh', lineHeight: 1.3 }}>The deeper you go, the more it falls apart</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.45vw', color: '#991B1B', lineHeight: 1.5, margin: 0 }}>
              Accuracy drops from 90% to 58% going from 1-hop to 3-hop questions — a 32-point cliff. At 3 hops, the Cypher query becomes too complex and the LLM generating it starts making mistakes. This exact degradation is what RMF-RAG is designed to fix.
            </p>
          </div>
        </div>

        <div style={{ flex: '0 0 34%', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#FEFCE8', borderRadius: '0.8vw', padding: '2vh 2vw', border: '1px solid #FEF08A', flex: 1 }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#CA8A04', marginBottom: '1vh' }}>THE 3-HOP CLIFF</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.2vw', color: '#16A34A', width: '5vw' }}>1-hop</div>
                <div style={{ flex: 1, height: '2vh', borderRadius: '0.3vw', background: '#16A34A', position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '0.5vw', top: '50%', transform: 'translateY(-50%)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.1vw', color: '#FFF', fontWeight: 700 }}>90%</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.2vw', color: '#F59E0B', width: '5vw' }}>2-hop</div>
                <div style={{ flex: 0.81, height: '2vh', borderRadius: '0.3vw', background: '#F59E0B', position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '0.5vw', top: '50%', transform: 'translateY(-50%)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.1vw', color: '#FFF', fontWeight: 700 }}>73%</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.2vw', color: '#DC2626', width: '5vw' }}>3-hop</div>
                <div style={{ flex: 0.64, height: '2vh', borderRadius: '0.3vw', background: '#DC2626', position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '0.5vw', top: '50%', transform: 'translateY(-50%)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.1vw', color: '#FFF', fontWeight: 700 }}>58%</span>
                </div>
              </div>
            </div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.2vw', color: '#78716C', marginTop: '1.2vh', lineHeight: 1.5 }}>This is the exact pattern RMF-RAG targets. In hyperbolic space, deep hierarchy is encoded geometrically so 3-hop paths don't degrade.</p>
          </div>

          <div style={{ background: '#1E1B4B', borderRadius: '0.8vw', padding: '1.5vh 1.5vw' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC', marginBottom: '0.5vh' }}>THE GAP IN ONE LINE</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.4 }}>90% at 1 hop. 58% at 3 hops. The deeper you go, the more it breaks.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
