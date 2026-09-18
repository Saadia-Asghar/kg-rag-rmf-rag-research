export default function S04Architecture() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#F4F6FA' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(5,150,105,0.045) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute" style={{ top: '3vh', left: '7vw' }}><span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.3vw', fontWeight: 700, color: '#059669', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Where the pieces live</span></div>
      <div className="absolute" style={{ top: '3vh', right: '5vw' }}><span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#94A3B8' }}>04 / 09</span></div>
      <div className="absolute" style={{ top: '10vh', left: '7vw', right: '6vw' }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '3.5vw', fontWeight: 800, color: '#0D1B2A', lineHeight: 1.1, marginBottom: '1vh' }}>The scripts build; the app lets you inspect</h2>
        <div style={{ width: '5vw', height: '0.3vh', background: '#059669', marginBottom: '1.5vh' }} />
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.65vw', color: '#64748B' }}>Run the research pipeline first. Then use the API and Model Tester to look at one exact result.</p>
      </div>
      <div className="absolute" style={{ top: '24vh', left: '7vw', right: '7vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2vw' }}>
        <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '0.8vw', padding: '2vh 1.5vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.45vw', fontWeight: 800, color: '#1D4ED8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5vh' }}>Offline: build the experiment</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.22fr 1fr 0.22fr 1fr', alignItems: 'center', gap: '0.4vw' }}>
            <div style={{ background: '#EFF2F7', border: '1px solid #CBD5E1', borderRadius: '0.5vw', padding: '1.4vh 0.6vw', textAlign: 'center', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.35vw', color: '#334155' }}>Hetionet<br />public data map</div>
            <div style={{ color: '#1D4ED8', fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', textAlign: 'center' }}>→</div>
            <div style={{ background: '#EFF2F7', border: '1px solid #CBD5E1', borderRadius: '0.5vw', padding: '1.4vh 0.6vw', textAlign: 'center', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.35vw', color: '#334155' }}>questions<br />with hidden answers</div>
            <div style={{ color: '#1D4ED8', fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', textAlign: 'center' }}>→</div>
            <div style={{ background: '#0D1B2A', borderRadius: '0.5vw', padding: '1.4vh 0.6vw', textAlign: 'center', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.35vw', color: '#F8FAFC' }}>train the<br />two models</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', color: '#1D4ED8', fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', padding: '1vh' }}>↓</div>
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '0.5vw', padding: '1.4vh 0.8vw', textAlign: 'center', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#166534' }}>save rankings, metrics, query files, and report</div>
        </div>
        <div style={{ background: '#0D1B2A', borderRadius: '0.8vw', padding: '2vh 1.5vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.45vw', fontWeight: 800, color: '#6EE7B7', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5vh' }}>Online: inspect one result</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.22fr 1fr 0.22fr 1fr', alignItems: 'center', gap: '0.4vw' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(110,231,183,0.35)', borderRadius: '0.5vw', padding: '1.4vh 0.6vw', textAlign: 'center', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.35vw', color: '#F8FAFC' }}>Model Tester<br />controls</div>
            <div style={{ color: '#6EE7B7', fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', textAlign: 'center' }}>→</div>
            <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(110,231,183,0.35)', borderRadius: '0.5vw', padding: '1.4vh 0.6vw', textAlign: 'center', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.35vw', color: '#F8FAFC' }}>GET<br />/api/model/query</div>
            <div style={{ color: '#6EE7B7', fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', textAlign: 'center' }}>→</div>
            <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(110,231,183,0.35)', borderRadius: '0.5vw', padding: '1.4vh 0.6vw', textAlign: 'center', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.35vw', color: '#F8FAFC' }}>saved model<br />and query set</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', color: '#6EE7B7', fontFamily: "'Sora', sans-serif", fontSize: '1.5vw', padding: '1vh' }}>↓</div>
          <div style={{ background: 'rgba(5,150,105,0.18)', border: '1px solid rgba(110,231,183,0.45)', borderRadius: '0.5vw', padding: '1.4vh 0.8vw', textAlign: 'center', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#D1FAE5' }}>show rank, path check, evidence status, title, URL, and snippet</div>
        </div>
      </div>
      <div className="absolute" style={{ left: '7vw', right: '7vw', bottom: '9vh', background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '0.7vw', padding: '1.5vh 1.5vw' }}>
        <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.35vw', fontWeight: 700, color: '#9A3412' }}>Important: </span>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#7C2D12' }}>This is a knowledge graph, not a K-map algorithm. In Recall@K, K only means the first K ranked candidates: usually 1, 5, or 10.</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: '#059669' }} />
    </div>
  );
}