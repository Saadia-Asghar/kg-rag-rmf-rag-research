export default function S03Gaps() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#F4F6FA' }}>
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(220,38,38,0.04) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="absolute" style={{ top: '4vh', left: '7vw' }}>
        <span style={{
          background: 'rgba(220,38,38,0.09)', border: '1px solid rgba(220,38,38,0.25)',
          borderRadius: '2vw', padding: '0.4vh 1.2vw',
          fontFamily: "'Sora', sans-serif", fontSize: '1.3vw', fontWeight: 600,
          color: '#DC2626', letterSpacing: '0.07em', textTransform: 'uppercase',
        }}>Discovery</span>
      </div>

      <div className="absolute" style={{ top: '4vh', right: '5vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#94A3B8' }}>03 / 12</span>
      </div>

      <div className="absolute" style={{ top: '11vh', left: '7vw', right: '5vw' }}>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontSize: '3.4vw', fontWeight: 800,
          color: '#0D1B2A', lineHeight: 1.15, marginBottom: '0.6vh',
        }}>
          The Gaps I Found — Across All 10 Papers
        </h2>
        <div style={{ width: '5vw', height: '0.35vh', background: '#DC2626', marginBottom: '2.5vh' }} />
      </div>

      {/* 3x2 card grid */}
      <div className="absolute" style={{
        top: '26vh', left: '7vw', right: '5vw',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.8vh 2vw',
      }}>

        <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '0.8vw', padding: '1.8vh 1.5vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.9vw', fontWeight: 700, color: '#DC2626', marginBottom: '0.6vh' }}>
            Flat Geometry
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#374151', lineHeight: 1.4 }}>
            All 10 systems embed nodes in Euclidean space — treating every relationship as equally distant
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#94A3B8', marginTop: '0.8vh' }}>All 10 papers</div>
        </div>

        <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '0.8vw', padding: '1.8vh 1.5vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.9vw', fontWeight: 700, color: '#DC2626', marginBottom: '0.6vh' }}>
            Hop Degradation
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#374151', lineHeight: 1.4 }}>
            Accuracy drops sharply after 2 hops — SG-RAG falls from 90% to 58% on 3-hop queries
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#94A3B8', marginTop: '0.8vh' }}>SG-RAG, KRAGEN</div>
        </div>

        <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '0.8vw', padding: '1.8vh 1.5vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.9vw', fontWeight: 700, color: '#DC2626', marginBottom: '0.6vh' }}>
            Exact String Match
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#374151', lineHeight: 1.4 }}>
            Fails when entity names differ slightly — a synonym or abbreviation breaks the path
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#94A3B8', marginTop: '0.8vh' }}>HyKGE, Goal-KG</div>
        </div>

        <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '0.8vw', padding: '1.8vh 1.5vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.9vw', fontWeight: 700, color: '#C2410C', marginBottom: '0.6vh' }}>
            Equal Hop Weighting
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#374151', lineHeight: 1.4 }}>
            Hop-1 scored the same as hop-3, ignoring how semantic distance changes with depth
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#94A3B8', marginTop: '0.8vh' }}>KG-RAG (Wang)</div>
        </div>

        <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '0.8vw', padding: '1.8vh 1.5vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.9vw', fontWeight: 700, color: '#C2410C', marginBottom: '0.6vh' }}>
            Context Reset
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#374151', lineHeight: 1.4 }}>
            Embedding context discarded between hops — system forgets where it came from at each step
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#94A3B8', marginTop: '0.8vh' }}>KRAGEN, D-RAG</div>
        </div>

        <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '0.8vw', padding: '1.8vh 1.5vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.9vw', fontWeight: 700, color: '#C2410C', marginBottom: '0.6vh' }}>
            Sparse Path Failure
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#374151', lineHeight: 1.4 }}>
            Cannot verify answers when graph paths are missing or incomplete — hallucinates instead
          </div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#94A3B8', marginTop: '0.8vh' }}>KG²RAG</div>
        </div>
      </div>

      {/* Bottom insight */}
      <div className="absolute" style={{ bottom: '3.5vh', left: '7vw', right: '5vw' }}>
        <div style={{
          background: 'rgba(220,38,38,0.07)', border: '1.5px solid rgba(220,38,38,0.2)',
          borderRadius: '0.6vw', padding: '1.2vh 1.8vw', display: 'inline-block',
        }}>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.8vw', fontWeight: 700, color: '#DC2626' }}>
            These are not 6 different problems — they are all symptoms of the same root cause.
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: 'linear-gradient(90deg, #DC2626 0%, rgba(220,38,38,0.2) 100%)' }} />
    </div>
  );
}
