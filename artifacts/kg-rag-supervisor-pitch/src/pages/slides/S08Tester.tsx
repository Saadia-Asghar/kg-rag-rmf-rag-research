export default function S08Tester() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#F4F6FA' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(5,150,105,0.045) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute" style={{ top: '3vh', left: '7vw' }}><span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.3vw', fontWeight: 700, color: '#059669', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Step 7 · Inspect one run</span></div>
      <div className="absolute" style={{ top: '3vh', right: '5vw' }}><span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#94A3B8' }}>08 / 09</span></div>
      <div className="absolute" style={{ top: '10vh', left: '7vw', right: '6vw' }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '3.45vw', fontWeight: 800, color: '#0D1B2A', lineHeight: 1.1, marginBottom: '1vh' }}>How to use the live Model Tester</h2>
        <div style={{ width: '5vw', height: '0.3vh', background: '#059669', marginBottom: '1.5vh' }} />
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.65vw', color: '#64748B' }}>The tester reads saved predictions. It does not train again and it is not a chat interface.</p>
      </div>
      <div className="absolute" style={{ top: '25vh', left: '7vw', right: '7vw', display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: '2vw' }}>
        <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '0.8vw', padding: '1.8vh 1.4vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.35vw', fontWeight: 800, color: '#059669', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.2vh' }}>Choose the inputs</div>
          <div style={{ display: 'grid', gap: '0.8vh', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.45vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#EFF2F7', padding: '1.2vh 0.9vw', borderRadius: '0.4vw', color: '#334155' }}><span>Hop</span><strong>2-hop</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#EFF2F7', padding: '1.2vh 0.9vw', borderRadius: '0.4vw', color: '#334155' }}><span>Split</span><strong>Test</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#EFF2F7', padding: '1.2vh 0.9vw', borderRadius: '0.4vw', color: '#334155' }}><span>Seed / query index</span><strong>101 / 1</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#EFF2F7', padding: '1.2vh 0.9vw', borderRadius: '0.4vw', color: '#334155' }}><span>Method / Top K</span><strong>Euclidean / 5</strong></div>
          </div>
          <div style={{ marginTop: '1.2vh', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '0.4vw', padding: '1.2vh 0.9vw', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.35vw', color: '#166534' }}>Running retrieval… = the frontend is waiting for the API response.</div>
        </div>
        <div style={{ background: '#0D1B2A', borderRadius: '0.8vw', padding: '1.8vh 1.4vw' }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.35vw', fontWeight: 800, color: '#6EE7B7', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.2vh' }}>Read the answer</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.48vw', color: '#F8FAFC', lineHeight: 1.5 }}>
            <div>• top candidate compounds and their ranks</div>
            <div>• hidden target and its final rank</div>
            <div>• path verification: whether the required path exists</div>
            <div>• paper evidence status and source details</div>
            <div>• exact query ID, seed, hop, and method</div>
          </div>
        </div>
      </div>
      <div className="absolute" style={{ left: '7vw', right: '7vw', bottom: '8vh', background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '0.7vw', padding: '1.6vh 1.5vw' }}>
        <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.35vw', fontWeight: 700, color: '#9A3412' }}>Why it exists: </span>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#7C2D12' }}>Example: target DB00570 at rank 566 is a Recall@5 failure. Target DB00544 at rank 4 is a Recall@5 success. Showing both is honest.</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: '#059669' }} />
    </div>
  );
}