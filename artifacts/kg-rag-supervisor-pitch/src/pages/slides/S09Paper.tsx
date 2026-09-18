export default function S09Paper() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0D1B2A' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(29,78,216,0.12) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute" style={{ top: '3vh', left: '7vw' }}><span style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.3vw', fontWeight: 700, color: '#6EE7B7', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Step 8 · Explain it clearly</span></div>
      <div className="absolute" style={{ top: '3vh', right: '5vw' }}><span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.4vw', color: '#475569' }}>09 / 09</span></div>
      <div className="absolute" style={{ top: '10vh', left: '7vw', right: '6vw' }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '3.35vw', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1, marginBottom: '1vh' }}>Methodology, novelty, and boundaries</h2>
        <div style={{ width: '5vw', height: '0.3vh', background: '#6EE7B7', marginBottom: '1.5vh' }} />
      </div>
      <div className="absolute" style={{ top: '23vh', left: '7vw', right: '7vw', display: 'grid', gap: '1.3vh' }}>
        <div style={{ background: 'rgba(5,150,105,0.14)', border: '1px solid rgba(110,231,183,0.42)', borderRadius: '0.6vw', padding: '1.5vh 1.4vw' }}>
           <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.25vw', fontWeight: 800, color: '#6EE7B7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6vh' }}>What is methodologically new</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.45vw', color: '#F8FAFC', lineHeight: 1.35 }}>“The contribution is a reproducible evaluation method: licensed Hetionet edges, typed 2-hop/3-hop tasks, hidden terminal answers, matched model budgets, five seeds, ablations, and saved evidence provenance.”</div>
        </div>
        <div style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(147,197,253,0.4)', borderRadius: '0.6vw', padding: '1.5vh 1.4vw' }}>
           <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.25vw', fontWeight: 800, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6vh' }}>How the method is used</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.45vw', color: '#F8FAFC', lineHeight: 1.35 }}>“Train Euclidean and Poincaré embeddings on the visible graph, rank every compound, calculate Recall/MRR against the hidden target, then attach graph-path and Europe PMC evidence separately.”</div>
        </div>
        <div style={{ background: 'rgba(217,119,6,0.14)', border: '1px solid rgba(253,186,116,0.45)', borderRadius: '0.6vw', padding: '1.5vh 1.4vw' }}>
           <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.25vw', fontWeight: 800, color: '#FDBA74', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6vh' }}>What it does not claim</div>
            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.45vw', color: '#F8FAFC', lineHeight: 1.35 }}>“This is not a K-map algorithm, an interactive LLM answerer, or clinical validation. A high-ranked compound is not a treatment recommendation.”</div>
        </div>
      </div>
      <div className="absolute" style={{ left: '7vw', right: '7vw', bottom: '6vh', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1.25vw', color: '#94A3B8' }}>
        Paper sources already prepared: research/PAPER_DRAFT_SECTIONS.md · research/results/main_benchmark/paper_table.md · Himmelstein et al., eLife 2017, DOI 10.7554/eLife.26726
      </div>
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.4vh', background: 'linear-gradient(90deg, #059669 0%, #1D4ED8 100%)' }} />
    </div>
  );
}