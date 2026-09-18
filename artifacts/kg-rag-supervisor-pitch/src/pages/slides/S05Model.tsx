export default function S05Model() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#F4F6FA' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(29,78,216,0.045) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute" style={{ top: '3vh', left: '7vw' }}><span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.3vw', fontWeight: 700, color: '#1D4ED8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Step 4 · Make a ranking</span></div>
      <div className="absolute" style={{ top: '3vh', right: '5vw' }}><span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#94A3B8' }}>05 / 09</span></div>
      <div className="absolute" style={{ top: '10vh', left: '7vw', right: '6vw' }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '3.5vw', fontWeight: 800, color: '#0D1B2A', lineHeight: 1.1, marginBottom: '1vh' }}>Where Poincaré is used</h2>
        <div style={{ width: '5vw', height: '0.3vh', background: '#1D4ED8', marginBottom: '1.5vh' }} />
      </div>
      <div className="absolute" style={{ top: '25vh', left: '7vw', right: '7vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2vw' }}>
        <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '0.8vw', padding: '2.2vh 1.7vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', fontWeight: 800, color: '#1D4ED8', marginBottom: '1.2vh', textTransform: 'uppercase', letterSpacing: '0.06em' }}>What is trained?</div>
          <div style={{ background: '#EFF2F7', borderRadius: '0.5vw', padding: '1.8vh 1.2vw', fontFamily: "'Sora', sans-serif", fontSize: '1.65vw', color: '#0D1B2A', marginBottom: '1.5vh' }}>A position for every Gene, Disease, and Compound</div>
          <div style={{ background: '#ECFDF5', borderRadius: '0.5vw', padding: '1.8vh 1.2vw', fontFamily: "'Sora', sans-serif", fontSize: '1.65vw', color: '#166534', marginBottom: '1.5vh' }}>Related nodes learn positions closer together</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#475569', lineHeight: 1.4 }}>Euclidean uses flat space. Poincaré uses curved hyperbolic space, which can represent branching graph structure.</div>
        </div>
        <div style={{ background: '#0D1B2A', borderRadius: '0.8vw', padding: '2.2vh 1.7vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', fontWeight: 800, color: '#6EE7B7', marginBottom: '1.2vh', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Poincaré is used here</div>
          <div style={{ display: 'grid', gap: '1vh' }}>
             <div style={{ border: '1px solid rgba(110,231,183,0.4)', borderRadius: '0.5vw', padding: '1.3vh 1vw', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#F8FAFC' }}>1. <strong>train_poincare()</strong> learns the node positions</div>
             <div style={{ border: '1px solid rgba(110,231,183,0.4)', borderRadius: '0.5vw', padding: '1.3vh 1vw', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#F8FAFC' }}>2. <strong>rank_query()</strong> scores every compound</div>
             <div style={{ border: '1px solid rgba(110,231,183,0.4)', borderRadius: '0.5vw', padding: '1.3vh 1vw', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#F8FAFC' }}>3. <strong>evaluate_method()</strong> finds the target rank</div>
             <div style={{ border: '1px solid rgba(110,231,183,0.4)', borderRadius: '0.5vw', padding: '1.3vh 1vw', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.5vw', color: '#F8FAFC' }}>4. path verification is a separate check</div>
          </div>
        </div>
      </div>
      <div className="absolute" style={{ left: '7vw', right: '7vw', bottom: '9vh', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2vw' }}>
        <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '0.7vw', padding: '1.5vh 1.5vw', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#7C2D12', lineHeight: 1.35 }}>
          <strong style={{ fontFamily: "'Sora', sans-serif", color: '#9A3412' }}>Not Poincaré:</strong> downloading data, splitting answers, hiding test edges, or checking typed paths.
        </div>
        <div style={{ background: '#EFF2F7', border: '1.5px solid #CBD5E1', borderRadius: '0.7vw', padding: '1.5vh 1.5vw', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#475569', lineHeight: 1.35 }}>
          <strong style={{ fontFamily: "'Sora', sans-serif", color: '#0D1B2A' }}>Not implemented as a claim:</strong> an interactive LLM answerer, clinical decision support tool, or validated treatment recommender.
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: '#1D4ED8' }} />
    </div>
  );
}