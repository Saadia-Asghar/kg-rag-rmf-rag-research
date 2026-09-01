export default function P04CogGRAG() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#0E1420' }}>
      <div className="absolute top-0 right-0" style={{ width: '30vw', height: '30vw', background: 'radial-gradient(circle at 100% 0%, rgba(245,158,11,0.05) 0%, transparent 65%)' }} />

      <div className="relative z-10 flex flex-col px-[7vw] pt-[4.5vh] pb-[4vh]" style={{ height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2vw', marginBottom: '3.5vh' }}>
          <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '0.6vw', padding: '0.6vh 1.2vw', flexShrink: 0 }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.9vw', color: '#F59E0B', letterSpacing: '0.1em' }}>PAPER 02</div>
          </div>
          <h2 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '3.2vw', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.1 }}>
            CogGRAG: Reasoning That Checks Its Own Work
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh', marginBottom: '3vh', flex: 1 }}>
          <div style={{ background: '#141C2E', border: '1px solid rgba(248,250,252,0.07)', borderRadius: '0.7vw', padding: '2vh 2.2vw', display: 'flex', gap: '2vw', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#F59E0B', flexShrink: 0, paddingTop: '0.2vh', width: '10vw' }}>Core idea</div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.8vw', color: '#F8FAFC', lineHeight: 1.45 }}>
              Cognition-inspired chain of thought with self-verification at each reasoning step — stop, check, then proceed
            </div>
          </div>
          <div style={{ background: '#141C2E', border: '1px solid rgba(248,250,252,0.07)', borderRadius: '0.7vw', padding: '2vh 2.2vw', display: 'flex', gap: '2vw', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#F59E0B', flexShrink: 0, paddingTop: '0.2vh', width: '10vw' }}>Methodology</div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.8vw', color: '#F8FAFC', lineHeight: 1.45 }}>
              Generate sub-questions, retrieve evidence, verify plausibility before advancing to the next hop
            </div>
          </div>
          <div style={{ background: '#141C2E', border: '1px solid rgba(248,250,252,0.07)', borderRadius: '0.7vw', padding: '2vh 2.2vw', display: 'flex', gap: '2vw', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#F59E0B', flexShrink: 0, paddingTop: '0.2vh', width: '10vw' }}>Key result</div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.8vw', color: '#F8FAFC', lineHeight: 1.45 }}>
              Reduced hallucination on multi-hop paths by catching errors early before they compound downstream
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', borderLeft: '3px solid #EF4444', borderRadius: '0.7vw', padding: '1.8vh 2.2vw', display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#EF4444', flexShrink: 0, letterSpacing: '0.08em' }}>THE GAP IT LEAVES</div>
          <div style={{ width: '1px', height: '3vh', background: 'rgba(239,68,68,0.3)', flexShrink: 0 }} />
          <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.8vw', color: '#FCA5A5', lineHeight: 1.4 }}>
            The verification step still queries a flat embedding index — no awareness of concept hierarchy or relational distance
          </div>
        </div>
      </div>
    </div>
  );
}
