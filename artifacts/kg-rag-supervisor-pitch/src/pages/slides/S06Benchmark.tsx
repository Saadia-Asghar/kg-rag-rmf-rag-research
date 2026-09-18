export default function S06Benchmark() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#F4F6FA' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(5,150,105,0.045) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute" style={{ top: '3vh', left: '7vw' }}><span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.3vw', fontWeight: 700, color: '#059669', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Step 5 · Make it fair</span></div>
      <div className="absolute" style={{ top: '3vh', right: '5vw' }}><span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#94A3B8' }}>06 / 09</span></div>
      <div className="absolute" style={{ top: '10vh', left: '7vw', right: '6vw' }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '3.5vw', fontWeight: 800, color: '#0D1B2A', lineHeight: 1.1, marginBottom: '1vh' }}>How Recall@5 and MRR work</h2>
        <div style={{ width: '5vw', height: '0.3vh', background: '#059669', marginBottom: '1.5vh' }} />
      </div>
      <div className="absolute" style={{ top: '24vh', left: '7vw', right: '7vw', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '2vw' }}>
        <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '0.8vw', padding: '2.2vh 1.7vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', fontWeight: 800, color: '#059669', marginBottom: '1.2vh', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recall@5 = a top-five check</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.55vw', color: '#334155', lineHeight: 1.55 }}>
            <div>1. rank every candidate compound</div>
            <div>2. look for the hidden correct compound</div>
            <div>3. rank 4 → it is inside the first 5</div>
            <div>4. rank 566 → it is not inside the first 5</div>
            <div>5. 20 successes out of 100 = 20%</div>
          </div>
        </div>
        <div style={{ background: '#0D1B2A', borderRadius: '0.8vw', padding: '2.2vh 1.7vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', fontWeight: 800, color: '#6EE7B7', marginBottom: '1.2vh', textTransform: 'uppercase', letterSpacing: '0.06em' }}>MRR = rewards high ranks</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.55vw', color: '#F8FAFC', lineHeight: 1.55 }}>
            <div>rank 1 → score 1.00</div>
            <div>rank 4 → score 0.25</div>
            <div>rank 566 → score about 0.002</div>
            <div>average these scores across queries</div>
            <div>repeat the full test for five seeds</div>
          </div>
        </div>
      </div>
      <div className="absolute" style={{ left: '7vw', right: '7vw', bottom: '8vh', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5vw' }}>
        <div style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: '0.7vw', padding: '1.5vh 1.5vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.4vw', fontWeight: 700, color: '#166534', marginBottom: '0.5vh' }}>What is K?</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.45vw', color: '#166534', lineHeight: 1.35 }}>K is the cutoff: Recall@1 checks the first 1, Recall@5 checks the first 5, and Recall@10 checks the first 10.</div>
        </div>
        <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '0.7vw', padding: '1.5vh 1.5vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.4vw', fontWeight: 700, color: '#9A3412', marginBottom: '0.5vh' }}>First, answers stay hidden</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.45vw', color: '#7C2D12', lineHeight: 1.35 }}>The test answer edge is removed before training. The target is shown only afterward so Recall and MRR can be calculated honestly.</div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: '#059669' }} />
    </div>
  );
}