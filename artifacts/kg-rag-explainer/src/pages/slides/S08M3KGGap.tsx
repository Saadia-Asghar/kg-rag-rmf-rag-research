export default function S08M3KGGap() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>
      <div style={{ background: '#1E1B4B', padding: '2vh 4vw 1.8vh', display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
        <div style={{ background: '#F59E0B', color: '#1C1917', borderRadius: '50%', width: '3.5vw', height: '3.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 800, flexShrink: 0 }}>04</div>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC' }}>PAPER 4 OF 10 — CVPR 2026</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2.4vw', fontWeight: 800, color: '#FFFFFF' }}>M³KG-RAG — Multimodal Multi-hop KG RAG</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '2.5vw', padding: '2.5vh 4vw' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#F0FDF4', borderRadius: '0.8vw', padding: '2vh 2vw', border: '2px solid #86EFAC', flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#15803D', marginBottom: '1vh' }}>WHAT IT FIGURED OUT</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.8vw', fontWeight: 800, color: '#14532D', marginBottom: '1.2vh', lineHeight: 1.3 }}>Handle images, audio, AND text all at once</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.45vw', color: '#166534', lineHeight: 1.5, margin: 0 }}>
              Real questions often involve multiple types of information: "What is this sound from the video clip, and what disease does it indicate?" M³KG-RAG builds a knowledge graph that includes all three types. It also adds a verification step that checks whether the retrieved image actually matches what the text says.
            </p>
          </div>

          <div style={{ background: '#FFF0F0', borderRadius: '0.8vw', padding: '2vh 2vw', border: '2px solid #FCA5A5', flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#DC2626', marginBottom: '1vh' }}>WHAT'S STILL MISSING</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.8vw', fontWeight: 800, color: '#7F1D1D', marginBottom: '1.2vh', lineHeight: 1.3 }}>Each type of information lives in its own flat world</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.45vw', color: '#991B1B', lineHeight: 1.5, margin: 0 }}>
              Images, audio, and text are embedded into separate flat Euclidean spaces that can't naturally talk to each other. Bridging them requires an extra alignment step that introduces errors. A unified curved space could represent all three types in one place.
            </p>
          </div>
        </div>

        <div style={{ flex: '0 0 34%', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#FFFBEB', borderRadius: '0.8vw', padding: '2vh 2vw', border: '1px solid #FDE68A', flex: 1 }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#B45309', marginBottom: '1.2vh' }}>SIMPLE ANALOGY</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.4vw', color: '#44403C', lineHeight: 1.6, margin: 0 }}>
              Three translators — one for images, one for audio, one for text — but they each speak a completely different language and must write notes to pass between them. M³KG-RAG is brilliant at getting all three to cooperate. But the "passing notes" step is still imprecise.
            </p>
            <div style={{ marginTop: '1.5vh', padding: '1.2vh 1.2vw', background: '#FEF3C7', borderRadius: '0.6vw' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#92400E' }}>Real result</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.25vw', color: '#B45309' }}>VALOR benchmark: 44.67 vs 35.44 for best prior method — a 26% improvement</div>
            </div>
          </div>

          <div style={{ background: '#1E1B4B', borderRadius: '0.8vw', padding: '1.5vh 1.5vw' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC', marginBottom: '0.5vh' }}>THE GAP IN ONE LINE</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.4 }}>Three separate flat worlds that need a common curved home.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
