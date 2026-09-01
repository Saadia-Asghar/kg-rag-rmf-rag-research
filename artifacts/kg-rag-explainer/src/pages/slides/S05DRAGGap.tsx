export default function S05DRAGGap() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>
      <div style={{ background: '#1E1B4B', padding: '2vh 4vw 1.8vh', display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
        <div style={{ background: '#00D4FF', color: '#1E1B4B', borderRadius: '50%', width: '3.5vw', height: '3.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 800, flexShrink: 0 }}>01</div>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC' }}>PAPER 1 OF 10 — EMNLP 2025</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2.4vw', fontWeight: 800, color: '#FFFFFF' }}>D-RAG — Differentiable Retrieval-Augmented Generation</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '2.5vw', padding: '2.5vh 4vw' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#F0FDF4', borderRadius: '0.8vw', padding: '2vh 2vw', border: '2px solid #86EFAC', flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#15803D', marginBottom: '1vh' }}>WHAT IT FIGURED OUT</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.8vw', fontWeight: 800, color: '#14532D', marginBottom: '1.2vh', lineHeight: 1.3 }}>Teach the searcher and the answerer at the same time</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.45vw', color: '#166534', lineHeight: 1.5, margin: 0 }}>
              Before D-RAG, search and answer were trained separately — like training a librarian and a writer to never talk to each other. D-RAG makes them teach each other. When the writer gets a bad answer, it tells the librarian what to look for differently.
            </p>
          </div>

          <div style={{ background: '#FFF0F0', borderRadius: '0.8vw', padding: '2vh 2vw', border: '2px solid #FCA5A5', flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#DC2626', marginBottom: '1vh' }}>WHAT'S STILL MISSING</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.8vw', fontWeight: 800, color: '#7F1D1D', marginBottom: '1.2vh', lineHeight: 1.3 }}>It measures distance with a flat ruler on a curved road</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.45vw', color: '#991B1B', lineHeight: 1.5, margin: 0 }}>
              When deciding which facts are "close" to the question, D-RAG uses a straight-line ruler (Euclidean distance). But a knowledge graph is like a mountain — some facts are near the peak (general) and some are far down the slopes (specific). A flat ruler gives the wrong distances.
            </p>
          </div>
        </div>

        <div style={{ flex: '0 0 34%', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#EFF6FF', borderRadius: '0.8vw', padding: '2vh 2vw', border: '1px solid #BFDBFE', flex: 1 }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#2563EB', marginBottom: '1.2vh' }}>SIMPLE ANALOGY</div>
            <svg viewBox="0 0 240 160" style={{ width: '100%', marginBottom: '1.5vh' }}>
              {/* Flat ruler */}
              <line x1="30" y1="60" x2="210" y2="60" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
              <circle cx="30" cy="60" r="6" fill="#2563EB" />
              <circle cx="210" cy="60" r="6" fill="#DC2626" />
              <text x="120" y="50" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="DM Sans, sans-serif">D-RAG: flat ruler</text>
              <text x="30" y="78" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="DM Sans, sans-serif">gene</text>
              <text x="210" y="78" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="DM Sans, sans-serif">drug</text>

              {/* Curved road */}
              <path d="M 30 130 Q 120 70 210 130" fill="none" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
              <circle cx="30" cy="130" r="6" fill="#2563EB" />
              <circle cx="210" cy="130" r="6" fill="#DC2626" />
              <text x="120" y="110" textAnchor="middle" fill="#EA580C" fontSize="11" fontFamily="DM Sans, sans-serif">Reality: curved path</text>
              <text x="30" y="148" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="DM Sans, sans-serif">gene</text>
              <text x="210" y="148" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="DM Sans, sans-serif">drug</text>
            </svg>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.2vw', color: '#57534E', margin: 0, lineHeight: 1.5 }}>The flat ruler says gene and drug are "far apart." The curved path shows they are actually reachable — but you have to follow the curve.</p>
          </div>

          <div style={{ background: '#1E1B4B', borderRadius: '0.8vw', padding: '1.5vh 1.5vw' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC', marginBottom: '0.5vh' }}>THE GAP IN ONE LINE</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.4 }}>Great training strategy, wrong shape of space to search in.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
