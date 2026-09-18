export default function S07Results() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#F4F6FA' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(29,78,216,0.045) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute" style={{ top: '3vh', left: '7vw' }}><span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.3vw', fontWeight: 700, color: '#1D4ED8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Step 6 · Read the result</span></div>
      <div className="absolute" style={{ top: '3vh', right: '5vw' }}><span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#94A3B8' }}>07 / 09</span></div>
      <div className="absolute" style={{ top: '10vh', left: '7vw', right: '6vw' }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '3.45vw', fontWeight: 800, color: '#0D1B2A', lineHeight: 1.1, marginBottom: '1vh' }}>Offline benchmark result: mean MRR</h2>
        <div style={{ width: '5vw', height: '0.3vh', background: '#1D4ED8', marginBottom: '1.5vh' }} />
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.65vw', color: '#64748B' }}>These values are mean MRR from <span style={{ fontFamily: 'monospace' }}>run_main_rmf_rag_benchmark.py</span> → <span style={{ fontFamily: 'monospace' }}>aggregate_metrics.csv</span>. Not one live-tester query.</p>
      </div>
      <div className="absolute" style={{ top: '25vh', left: '7vw', right: '7vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2vw' }}>
        <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '0.8vw', padding: '2.2vh 1.7vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.45vw', fontWeight: 800, color: '#0D1B2A', marginBottom: '1.5vh' }}>2-hop test: Poincaré did not win</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '0.7vw', alignItems: 'end', height: '22vh' }}>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#475569' }}>Euclidean<br /><strong style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.5vw', color: '#1D4ED8' }}>0.0131</strong><br />95% CI 0.0108–0.0153</div>
            <div style={{ height: '12vh', background: '#1D4ED8', borderRadius: '0.4vw 0.4vw 0 0' }} />
            <div style={{ height: '11.2vh', background: '#059669', borderRadius: '0.4vw 0.4vw 0 0' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '0.7vw', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.3vw', color: '#64748B' }}><div></div><div style={{ textAlign: 'center' }}>Euclidean</div><div style={{ textAlign: 'center' }}>Poincaré</div></div>
          <div style={{ marginTop: '1.5vh', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#9A3412' }}>Euclidean: 0.0131 · Poincaré: 0.0122</div>
        </div>
        <div style={{ background: '#0D1B2A', borderRadius: '0.8vw', padding: '2.2vh 1.7vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.45vw', fontWeight: 800, color: '#F8FAFC', marginBottom: '1.5vh' }}>3-hop test: Poincaré was slightly better</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '0.7vw', alignItems: 'end', height: '22vh' }}>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#CBD5E1' }}>Euclidean<br /><strong style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.5vw', color: '#93C5FD' }}>0.0111</strong><br />95% CI 0.0020–0.0203</div>
            <div style={{ height: '9.3vh', background: '#2563EB', borderRadius: '0.4vw 0.4vw 0 0' }} />
            <div style={{ height: '12.6vh', background: '#6EE7B7', borderRadius: '0.4vw 0.4vw 0 0' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '0.7vw', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.3vw', color: '#94A3B8' }}><div></div><div style={{ textAlign: 'center' }}>Euclidean</div><div style={{ textAlign: 'center' }}>Poincaré</div></div>
          <div style={{ marginTop: '1.5vh', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#6EE7B7' }}>Euclidean: 0.0111 · Poincaré: 0.0151 · intervals overlap</div>
        </div>
      </div>
      <div className="absolute" style={{ left: '7vw', right: '7vw', bottom: '8vh', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2vw' }}>
        <div style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: '0.7vw', padding: '1.4vh 1.5vw', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#166534', lineHeight: 1.35 }}><strong style={{ fontFamily: "'Sora', sans-serif" }}>Code result:</strong> the script repeats the benchmark for five seeds, then writes mean MRR and confidence intervals to the CSV.</div>
        <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '0.7vw', padding: '1.4vh 1.5vw', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#7C2D12', lineHeight: 1.35 }}><strong style={{ fontFamily: "'Sora', sans-serif" }}>Live tester:</strong> shows one saved query at a time. It helps inspect a result; it does not produce this average.</div>
      </div>
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: '#1D4ED8' }} />
    </div>
  );
}