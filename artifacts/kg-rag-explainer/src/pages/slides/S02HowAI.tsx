export default function S02HowAI() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>
      <div className="absolute top-0 right-0 w-[30vw] h-[30vw] rounded-full" style={{ background: 'rgba(37,99,235,0.05)' }} />

      {/* Header */}
      <div style={{ background: '#1E1B4B', padding: '2.5vh 4vw 2vh' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#A5B4FC', marginBottom: '0.5vh' }}>FOUNDATION — BEFORE WE START</div>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '3vw', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
          How does AI answer questions?
        </h2>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', gap: '3vw', padding: '3vh 4vw', alignItems: 'center' }}>

        {/* Left — the steps */}
        <div style={{ flex: '0 0 52%', display: 'flex', flexDirection: 'column', gap: '1.8vh' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.8vw', color: '#44403C', lineHeight: 1.5, margin: 0 }}>
            Think of it like a student taking an open-book exam:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
            <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'flex-start', background: '#EFF6FF', borderRadius: '0.8vw', padding: '1.5vh 1.5vw', border: '1px solid #BFDBFE' }}>
              <div style={{ background: '#2563EB', color: '#FFFFFF', borderRadius: '50%', width: '2.8vw', height: '2.8vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 800, flexShrink: 0 }}>1</div>
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.6vw', fontWeight: 700, color: '#1C1917' }}>Someone asks a question</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.35vw', color: '#57534E' }}>"What drug treats Type 2 Diabetes?"</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'flex-start', background: '#F0FDF4', borderRadius: '0.8vw', padding: '1.5vh 1.5vw', border: '1px solid #BBF7D0' }}>
              <div style={{ background: '#16A34A', color: '#FFFFFF', borderRadius: '50%', width: '2.8vw', height: '2.8vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 800, flexShrink: 0 }}>2</div>
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.6vw', fontWeight: 700, color: '#1C1917' }}>AI looks up relevant facts</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.35vw', color: '#57534E' }}>Searches a database of knowledge — like opening the textbook to the right chapter</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'flex-start', background: '#FFF7ED', borderRadius: '0.8vw', padding: '1.5vh 1.5vw', border: '1px solid #FED7AA' }}>
              <div style={{ background: '#EA580C', color: '#FFFFFF', borderRadius: '50%', width: '2.8vw', height: '2.8vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 800, flexShrink: 0 }}>3</div>
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.6vw', fontWeight: 700, color: '#1C1917' }}>AI writes the answer</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.35vw', color: '#57534E' }}>Uses the facts it found to give a clear, grounded response</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#F0F4FF', borderRadius: '0.8vw', padding: '1.2vh 1.5vw', border: '1px solid #C7D2FE' }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#3730A3' }}>This whole process = RAG</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.4vw', color: '#57534E' }}> — Retrieval-Augmented Generation</span>
          </div>
        </div>

        {/* Right — simple diagram */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5vh' }}>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#78716C', marginBottom: '0.5vh' }}>The flow looks like this:</div>
          {/* Flow diagram */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8vh', width: '100%' }}>
            <div style={{ background: '#1E1B4B', color: '#FFFFFF', borderRadius: '0.8vw', padding: '1.5vh 2vw', width: '80%', textAlign: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 700 }}>
              Your Question
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '2vw', color: '#94A3B8' }}>↓</div>
            <div style={{ background: '#2563EB', color: '#FFFFFF', borderRadius: '0.8vw', padding: '1.5vh 2vw', width: '80%', textAlign: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 700 }}>
              Search the Knowledge Base
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '2vw', color: '#94A3B8' }}>↓</div>
            <div style={{ background: '#16A34A', color: '#FFFFFF', borderRadius: '0.8vw', padding: '1.5vh 2vw', width: '80%', textAlign: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 700 }}>
              Relevant Facts Retrieved
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '2vw', color: '#94A3B8' }}>↓</div>
            <div style={{ background: '#EA580C', color: '#FFFFFF', borderRadius: '0.8vw', padding: '1.5vh 2vw', width: '80%', textAlign: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 700 }}>
              Answer Generated
            </div>
          </div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.2vw', color: '#78716C', textAlign: 'center', marginTop: '1vh' }}>
            The challenge: what happens when answering requires<br/>
            <strong>following multiple facts through a chain?</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
