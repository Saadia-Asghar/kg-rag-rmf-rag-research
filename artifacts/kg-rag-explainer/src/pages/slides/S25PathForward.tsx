export default function S25PathForward() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#1E1B4B' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(22,163,74,0.1) 0%, transparent 50%)' }} />

      <div style={{ flex: 1, display: 'flex', gap: '3vw', padding: '3vh 4vw', position: 'relative', zIndex: 1, alignItems: 'stretch' }}>

        {/* Left — summary */}
        <div style={{ flex: '0 0 52%', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#A5B4FC', marginBottom: '0.8vh' }}>WHAT YOU JUST LEARNED</div>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '3.2vw', fontWeight: 800, color: '#FFFFFF', margin: 0, lineHeight: 1.2 }}>
              The Path Forward:<br/><span style={{ color: '#60A5FA' }}>HyperKG-RAG</span>
            </h2>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.8vw', padding: '1.8vh 1.8vw' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#A5B4FC', marginBottom: '0.8vh' }}>THE 3-SENTENCE PITCH</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.55vw', color: '#E2E8F0', lineHeight: 1.6, margin: 0 }}>
              Every one of 10 recent KG-RAG papers uses flat Euclidean space to search hierarchical knowledge graphs — causing accuracy to collapse on 3-hop questions.
              RMF-RAG proposes replacing that flat space with a Poincaré ball and replacing cosine similarity with geodesic distance, so hierarchy is encoded geometrically rather than counted hop-by-hop.
              No prior paper has combined these two changes — this is genuinely novel, and achievable in 10 weeks on top of D-RAG's open-source code.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5vw', flex: 1 }}>
            <div style={{ flex: 1, background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '0.8vw', padding: '1.8vh 1.5vw' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#60A5FA', marginBottom: '0.8vh' }}>DATASETS</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#E2E8F0', lineHeight: 1.5 }}>WebQSP (1-2 hop)</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#E2E8F0', lineHeight: 1.5 }}>CWQ (up to 4-hop)</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#E2E8F0', lineHeight: 1.5 }}>MetaQA-3hop</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '0.8vw', padding: '1.8vh 1.5vw' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#34D399', marginBottom: '0.8vh' }}>BASELINES</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#E2E8F0', lineHeight: 1.5 }}>D-RAG (same arch)</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#E2E8F0', lineHeight: 1.5 }}>CogGRAG (best non-geometric)</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#E2E8F0', lineHeight: 1.5 }}>SG-RAG (best symbolic)</div>
            </div>
          </div>
        </div>

        {/* Right — timeline + verdict */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#A5B4FC' }}>10-WEEK PLAN</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vh', flex: 1 }}>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '0.6vw', padding: '0.8vh 1.2vw' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#60A5FA', width: '7vw', flexShrink: 0 }}>Weeks 1-2</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#CBD5E1' }}>Reproduce D-RAG baseline on WebQSP</div>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '0.6vw', padding: '0.8vh 1.2vw' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#A78BFA', width: '7vw', flexShrink: 0 }}>Weeks 3-4</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#CBD5E1' }}>Swap in Poincaré embeddings via geoopt, verify training converges</div>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '0.6vw', padding: '0.8vh 1.2vw' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#34D399', width: '7vw', flexShrink: 0 }}>Weeks 5-6</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#CBD5E1' }}>Run experiments on WebQSP and CWQ</div>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '0.6vw', padding: '0.8vh 1.2vw' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#FCD34D', width: '7vw', flexShrink: 0 }}>Week 7</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#CBD5E1' }}>Ablations: Euclidean vs. Poincaré, different dimensions, curvature c</div>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '0.6vw', padding: '0.8vh 1.2vw' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#FB7185', width: '7vw', flexShrink: 0 }}>Week 8</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#CBD5E1' }}>MetaQA-3hop + hallucination subset evaluation</div>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '0.6vw', padding: '0.8vh 1.2vw' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#C7D2FE', width: '7vw', flexShrink: 0 }}>Weeks 9-10</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#CBD5E1' }}>Write paper — target ACL/EMNLP Findings</div>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(22,163,74,0.12))', border: '2px solid rgba(96,165,250,0.4)', borderRadius: '0.8vw', padding: '1.8vh 1.8vw' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.8vh' }}>The verdict</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.4vw', color: '#CBD5E1', lineHeight: 1.5, margin: 0 }}>
              RMF-RAG is <span style={{ color: '#34D399', fontWeight: 700 }}>genuinely novel</span>. Scope it to one clean component — replace Euclidean distance with Poincaré distance in D-RAG — and you have a publishable undergraduate research contribution.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[0.4vh]" style={{ background: 'linear-gradient(90deg, #2563EB, #16A34A, #7C3AED, #2563EB)' }} />
    </div>
  );
}
