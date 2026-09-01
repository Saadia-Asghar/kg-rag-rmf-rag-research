export default function S07GoalKGGap() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>
      <div style={{ background: '#1E1B4B', padding: '2vh 4vw 1.8vh', display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
        <div style={{ background: '#10B981', color: '#FFFFFF', borderRadius: '50%', width: '3.5vw', height: '3.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 800, flexShrink: 0 }}>03</div>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC' }}>PAPER 3 OF 10 — Information 2026</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2.4vw', fontWeight: 800, color: '#FFFFFF' }}>Goal-Oriented KG — Structured Query Retrieval</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '2.5vw', padding: '2.5vh 4vw' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#F0FDF4', borderRadius: '0.8vw', padding: '2vh 2vw', border: '2px solid #86EFAC', flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#15803D', marginBottom: '1vh' }}>WHAT IT FIGURED OUT</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.8vw', fontWeight: 800, color: '#14532D', marginBottom: '1.2vh', lineHeight: 1.3 }}>Write an exact database query, not a vague search</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.45vw', color: '#166534', lineHeight: 1.5, margin: 0 }}>
              Instead of doing a fuzzy "find something like this" search, it automatically writes a precise SPARQL query — like the database equivalent of asking "give me exactly the node labelled 'GERD' connected to 'omeprazole' via the 'treats' edge." Then runs it. Very precise. Very fast.
            </p>
          </div>

          <div style={{ background: '#FFF0F0', borderRadius: '0.8vw', padding: '2vh 2vw', border: '2px solid #FCA5A5', flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#DC2626', marginBottom: '1vh' }}>WHAT'S STILL MISSING</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.8vw', fontWeight: 800, color: '#7F1D1D', marginBottom: '1.2vh', lineHeight: 1.3 }}>You have to know the exact words the database uses</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.45vw', color: '#991B1B', lineHeight: 1.5, margin: 0 }}>
              A patient says "my stomach hurts." The database stores "gastroesophageal reflux disease." These are not the same string — so the query finds nothing. The system has no way to bridge everyday language to technical vocabulary. Close doesn't count.
            </p>
          </div>
        </div>

        <div style={{ flex: '0 0 34%', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#ECFDF5', borderRadius: '0.8vw', padding: '2vh 2vw', border: '1px solid #A7F3D0', flex: 1 }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#10B981', marginBottom: '1.2vh' }}>SIMPLE ANALOGY</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.4vw', color: '#44403C', lineHeight: 1.6, margin: 0 }}>
              Like a library catalogue that only works if you type the exact title. "Harry Potter" works. "That wizard boy book" doesn't. The catalogue system is very fast — but useless if you don't speak its language.
            </p>
            <div style={{ marginTop: '1.5vh', padding: '1.2vh 1.2vw', background: '#D1FAE5', borderRadius: '0.6vw' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#065F46' }}>Real result</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.25vw', color: '#047857' }}>F1 score 0.83 vs ChatGPT's 0.15 — when it works. When vocabulary doesn't match: 0.</div>
            </div>
          </div>

          <div style={{ background: '#1E1B4B', borderRadius: '0.8vw', padding: '1.5vh 1.5vw' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC', marginBottom: '0.5vh' }}>THE GAP IN ONE LINE</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.4 }}>Extremely precise — but only if you already speak the database's language.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
