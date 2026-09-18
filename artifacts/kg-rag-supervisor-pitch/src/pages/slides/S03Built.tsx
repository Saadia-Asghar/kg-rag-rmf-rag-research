export default function S03Built() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#F4F6FA' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(29,78,216,0.045) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute" style={{ top: '3vh', left: '7vw' }}><span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.3vw', fontWeight: 700, color: '#1D4ED8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Start here</span></div>
      <div className="absolute" style={{ top: '3vh', right: '5vw' }}><span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#94A3B8' }}>03 / 09</span></div>
      <div className="absolute" style={{ top: '10vh', left: '7vw', right: '6vw' }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '3.5vw', fontWeight: 800, color: '#0D1B2A', lineHeight: 1.1, marginBottom: '1vh' }}>Run the project from the workspace root</h2>
        <div style={{ width: '5vw', height: '0.3vh', background: '#1D4ED8', marginBottom: '2vh' }} />
      </div>
      <div className="absolute" style={{ top: '25vh', left: '7vw', right: '7vw', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '1.5vw' }}>
        <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '0.8vw', padding: '2.3vh 1.8vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.7vw', fontWeight: 800, color: '#1D4ED8', marginBottom: '1vh' }}>01 · Build the benchmark</div>
          <div style={{ fontFamily: "monospace", fontSize: '1.5vw', color: '#334155', lineHeight: 1.4 }}>python research/scripts/run_main_rmf_rag_benchmark.py</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '0.8vw', padding: '2.3vh 1.8vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.7vw', fontWeight: 800, color: '#059669', marginBottom: '1vh' }}>02 · Inspect one query</div>
          <div style={{ fontFamily: "monospace", fontSize: '1.5vw', color: '#334155', lineHeight: 1.4 }}>python research/scripts/main_query_demo.py --hop 2 --split test --seed 101</div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '0.8vw', padding: '2.3vh 1.8vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.7vw', fontWeight: 800, color: '#D97706', marginBottom: '1vh' }}>03 · Check the evidence files</div>
          <div style={{ fontFamily: "monospace", fontSize: '1.5vw', color: '#334155', lineHeight: 1.4 }}>python research/scripts/evaluate_evidence.py --validate-only</div>
        </div>
        <div style={{ background: '#0D1B2A', borderRadius: '0.8vw', padding: '2.3vh 1.8vw' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.7vw', fontWeight: 800, color: '#6EE7B7', marginBottom: '1vh' }}>04 · Start the live tester</div>
          <div style={{ fontFamily: "monospace", fontSize: '1.5vw', color: '#F4F6FA', lineHeight: 1.5 }}>pnpm --filter @workspace/api-server run dev<br />pnpm --filter @workspace/rmf-rag-model-demo run dev</div>
        </div>
      </div>
      <div className="absolute" style={{ left: '7vw', right: '7vw', bottom: '8vh', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.45vw', color: '#64748B' }}>
        Rebuild the HTML report with <span style={{ fontFamily: 'monospace' }}>python research/scripts/build_main_benchmark_report.py</span>. The older pilot scripts are optional, not the main benchmark.
      </div>
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: '#1D4ED8' }} />
    </div>
  );
}