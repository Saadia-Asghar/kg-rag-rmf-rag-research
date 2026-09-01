export default function P02Foundation() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#0E1420' }}>
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(248,250,252,0.03) 1px, transparent 0)',
        backgroundSize: '48px 48px'
      }} />

      <div className="relative z-10 flex flex-col px-[7vw] pt-[5vh] pb-[4vh]" style={{ height: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '4vh' }}>
          <div className="inline-flex items-center gap-[0.6vw] mb-[1.5vh] px-[1vw] py-[0.4vh] rounded-full"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#F59E0B' }}>FOUNDATION</span>
          </div>
          <h2 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '3.6vw', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.1 }}>
            How RAG + Knowledge Graphs Work Together
          </h2>
        </div>

        {/* Three concept cards */}
        <div style={{ display: 'flex', gap: '2vw', marginBottom: '3vh', flex: '0 0 auto' }}>
          {/* Card 1: RAG */}
          <div style={{
            flex: 1, background: '#141C2E', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '0.8vw', padding: '2.5vh 2vw', borderTop: '3px solid #F59E0B'
          }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.9vw', color: '#F59E0B', marginBottom: '1.2vh', letterSpacing: '0.08em' }}>
              STEP 01
            </div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '2vw', fontWeight: 700, color: '#F8FAFC', marginBottom: '1.2vh' }}>
              RAG
            </div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.5vw', color: '#94A3B8', lineHeight: 1.5 }}>
              Retrieve relevant text, then generate an answer — like a student with an open-book exam
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center" style={{ flex: '0 0 auto' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '2vw', color: 'rgba(245,158,11,0.4)' }}>+</div>
          </div>

          {/* Card 2: Knowledge Graph */}
          <div style={{
            flex: 1, background: '#141C2E', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '0.8vw', padding: '2.5vh 2vw', borderTop: '3px solid #F59E0B'
          }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.9vw', color: '#F59E0B', marginBottom: '1.2vh', letterSpacing: '0.08em' }}>
              STEP 02
            </div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '2vw', fontWeight: 700, color: '#F8FAFC', marginBottom: '1.2vh' }}>
              Knowledge Graph
            </div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.5vw', color: '#94A3B8', lineHeight: 1.5 }}>
              Structured facts as nodes and edges — Gene causes Disease, Disease treated by Drug
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center" style={{ flex: '0 0 auto' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '2vw', color: 'rgba(245,158,11,0.4)' }}>=</div>
          </div>

          {/* Card 3: KG-RAG */}
          <div style={{
            flex: 1, background: '#141C2E', border: '1px solid rgba(245,158,11,0.35)',
            borderRadius: '0.8vw', padding: '2.5vh 2vw', borderTop: '3px solid #F59E0B'
          }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.9vw', color: '#F59E0B', marginBottom: '1.2vh', letterSpacing: '0.08em' }}>
              COMBINED
            </div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '2vw', fontWeight: 700, color: '#F8FAFC', marginBottom: '1.2vh' }}>
              KG-RAG
            </div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.5vw', color: '#94A3B8', lineHeight: 1.5 }}>
              Navigate the graph, collect evidence across hops, answer multi-step questions
            </div>
          </div>
        </div>

        {/* Challenge box */}
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '0.8vw', padding: '2.5vh 2.5vw', display: 'flex', alignItems: 'center', gap: '2vw'
        }}>
          <div style={{
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '0.5vw', padding: '0.8vh 1.2vw', flexShrink: 0
          }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1vw', color: '#EF4444', letterSpacing: '0.08em' }}>THE CHALLENGE</span>
          </div>
          <div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '2vw', fontWeight: 600, color: '#F8FAFC', marginBottom: '0.5vh' }}>
              3-hop reasoning: traversing 3 edges without losing accuracy
            </div>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.5vw', color: '#94A3B8' }}>
              Gene  ── causes ──  Disease  ── treated by ──  Drug  ── metabolized by ──  Enzyme
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.3vh', background: 'linear-gradient(90deg, transparent 0%, #F59E0B 50%, transparent 100%)' }} />
    </div>
  );
}
