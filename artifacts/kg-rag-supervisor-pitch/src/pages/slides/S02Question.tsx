export default function S02Question() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#F4F6FA' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(5,150,105,0.045) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute" style={{ top: '3vh', left: '7vw' }}><span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.3vw', fontWeight: 700, color: '#059669', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Research question</span></div>
      <div className="absolute" style={{ top: '3vh', right: '5vw' }}><span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#94A3B8' }}>02 / 09</span></div>
      <div className="absolute" style={{ top: '10vh', left: '7vw', right: '6vw' }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '3.5vw', fontWeight: 800, color: '#0D1B2A', lineHeight: 1.1, marginBottom: '1vh' }}>What data does the project use?</h2>
        <div style={{ width: '5vw', height: '0.3vh', background: '#059669', marginBottom: '2vh' }} />
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.8vw', color: '#64748B', maxWidth: '75vw', lineHeight: 1.35 }}>
           We combine a knowledge graph, licensed text evidence, and a separate pilot dataset.
        </p>
      </div>
      <div className="absolute" style={{ top: '37vh', left: '7vw', right: '7vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2vw' }}>
        <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '0.8vw', padding: '2.5vh 2vw' }}>
           <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.55vw', fontWeight: 800, color: '#1D4ED8', marginBottom: '1.3vh', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Main benchmark: Hetionet v1.0</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.7vw', color: '#334155', lineHeight: 1.5 }}>
              <div>47,031 nodes and 2.25M relationships in the source graph</div>
              <div>Filtered licensed edges: Gene–Disease, Disease–Compound, Gene–Compound</div>
              <div>Used to make 2-hop and 3-hop questions, train models, and test rankings</div>
          </div>
        </div>
        <div style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: '0.8vw', padding: '2.5vh 2vw' }}>
           <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.55vw', fontWeight: 800, color: '#059669', marginBottom: '1.3vh', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Evidence and comparison data</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.7vw', color: '#334155', lineHeight: 1.5 }}>
              <div>Europe PMC CC BY subset: citations and short evidence excerpts</div>
              <div>Evidence gold standard: 8 independent calibration labels</div>
              <div>Kaggle disease–drug data: original pilot only, not the main benchmark</div>
              <div>Derived JSONL query sets: exact train, validation, and test questions</div>
          </div>
        </div>
      </div>
      <div className="absolute" style={{ left: '7vw', right: '7vw', bottom: '9vh', background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '0.7vw', padding: '1.8vh 2vw' }}>
         <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.45vw', fontWeight: 700, color: '#9A3412' }}>Simple idea: </span>
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#7C2D12' }}>Hetionet is the knowledge graph; the text layer checks provenance after ranking. This is retrieval research, not treatment advice.</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: '#059669' }} />
    </div>
  );
}