export default function S01Completion() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#F4F6FA' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(29,78,216,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute" style={{ top: '4vh', left: '7vw' }}>
        <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.35vw', fontWeight: 700, color: '#1D4ED8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Research implementation review</span>
      </div>
      <div className="absolute" style={{ top: '4vh', right: '5vw' }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#94A3B8' }}>01 / 09</span>
      </div>
      <div className="absolute" style={{ top: '16vh', left: '7vw', width: '58vw' }}>
        <div style={{ width: '5vw', height: '0.35vh', background: '#1D4ED8', marginBottom: '3vh' }} />
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '4.6vw', fontWeight: 800, color: '#0D1B2A', lineHeight: 1.08, marginBottom: '2vh', textWrap: 'balance' }}>
           RMF-RAG: How to start it and understand the test
        </h1>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '2.15vw', fontWeight: 600, color: '#1D4ED8', lineHeight: 1.35, marginBottom: '1.4vh' }}>
           A simple step-by-step guide to the whole project
        </p>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.75vw', color: '#64748B', lineHeight: 1.4, maxWidth: '56vw' }}>
           Data → scripts → model → fair test → live Model Tester.
        </p>
      </div>
      <div className="absolute" style={{ top: '74vh', left: '7vw', right: '7vw', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5vw' }}>
        <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '0.8vw', padding: '2vh 1.5vw' }}>
           <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '3vw', fontWeight: 800, color: '#1D4ED8' }}>4</div>
           <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.45vw', color: '#475569' }}>core research scripts</div>
        </div>
        <div style={{ background: '#0D1B2A', borderRadius: '0.8vw', padding: '2vh 1.5vw' }}>
           <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '3vw', fontWeight: 800, color: '#6EE7B7' }}>2</div>
           <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.45vw', color: '#F4F6FA' }}>typed path tasks</div>
        </div>
        <div style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: '0.8vw', padding: '2vh 1.5vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '3vw', fontWeight: 800, color: '#059669' }}>1</div>
          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.45vw', color: '#475569' }}>live model tester</div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: 'linear-gradient(90deg, #1D4ED8 0%, #059669 100%)' }} />
    </div>
  );
}