export default function Slide25PathForward() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.1) 0%, transparent 50%)' }} />

      <div className="flex items-center justify-between px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: '1px solid rgba(0,212,255,0.15)' }}>
        <div>
          <div className="font-mono uppercase tracking-widest mb-[0.5vh]" style={{ fontSize: '1.1vw', color: '#00D4FF', fontFamily: 'DM Mono, monospace' }}>Minimum Viable Experiment</div>
          <div className="font-display font-bold" style={{ fontSize: '2.8vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>The Path Forward: HyperKG-RAG</div>
        </div>
        <div className="px-[1.5vw] py-[0.8vh] rounded-lg font-display font-semibold" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#10B981', fontSize: '1.4vw', fontFamily: 'Space Grotesk, sans-serif' }}>10-WEEK PLAN</div>
      </div>

      <div className="flex flex-1 gap-0 px-[4vw] py-[2vh]">
        {/* Left — timeline */}
        <div className="flex flex-col gap-[1.5vh] pr-[3vw]" style={{ flex: '0 0 42%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="font-mono uppercase tracking-widest mb-[0.3vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>10-Week Undergraduate Timeline</div>
          {[
            { weeks: 'Weeks 1–2', task: 'Reproduce D-RAG baseline on WebQSP', color: '#00D4FF' },
            { weeks: 'Weeks 3–4', task: 'Swap in Poincaré embeddings via geoopt; verify training converges', color: '#7C3AED' },
            { weeks: 'Weeks 5–6', task: 'Run experiments on WebQSP and CWQ', color: '#10B981' },
            { weeks: 'Week 7', task: 'Ablations: Euclidean vs. Poincaré, dimension 32/64/128, curvature c', color: '#F59E0B' },
            { weeks: 'Week 8', task: 'MetaQA-3hop + hallucination subset evaluation', color: '#F43F5E' },
            { weeks: 'Weeks 9–10', task: 'Write paper — target ACL/EMNLP Findings or ACL 2027 workshop', color: '#818CF8' },
          ].map((r) => (
            <div key={r.weeks} className="flex items-center gap-[1vw]">
              <div className="shrink-0 font-mono" style={{ fontSize: '1.1vw', color: r.color, fontFamily: 'DM Mono, monospace', width: '8vw' }}>{r.weeks}</div>
              <div className="flex-1 h-[0.15vh]" style={{ background: `${r.color}30` }} />
              <div className="font-body" style={{ fontSize: '1.3vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif', flex: 2 }}>{r.task}</div>
            </div>
          ))}
        </div>

        {/* Right — datasets, baselines, tools */}
        <div className="flex flex-col gap-[2vh] pl-[3vw]" style={{ flex: 1 }}>
          <div className="grid grid-cols-2 gap-[1.5vh]">
            <div className="rounded-lg p-[1.3vw]" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <div className="font-mono uppercase tracking-widest mb-[0.8vh]" style={{ fontSize: '1vw', color: '#00D4FF', fontFamily: 'DM Mono, monospace' }}>Datasets</div>
              {['WebQSP (1-2 hop)', 'CWQ (up to 4-hop)', 'MetaQA-3hop'].map((d) => (
                <div key={d} className="flex gap-[0.5vw] items-center">
                  <div className="w-[0.4vw] h-[0.4vw] rounded-full" style={{ background: '#00D4FF' }} />
                  <span className="font-body" style={{ fontSize: '1.3vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>{d}</span>
                </div>
              ))}
            </div>
            <div className="rounded-lg p-[1.3vw]" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <div className="font-mono uppercase tracking-widest mb-[0.8vh]" style={{ fontSize: '1vw', color: '#7C3AED', fontFamily: 'DM Mono, monospace' }}>Key Tool</div>
              <div className="font-mono font-semibold" style={{ fontSize: '1.5vw', color: '#7C3AED', fontFamily: 'DM Mono, monospace' }}>pip install geoopt</div>
              <div className="font-body mt-[0.5vh]" style={{ fontSize: '1.2vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>PyTorch Riemannian geometry — PoincareBall, RiemannianSGD</div>
            </div>
          </div>

          <div className="rounded-lg p-[1.3vw]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="font-mono uppercase tracking-widest mb-[0.8vh]" style={{ fontSize: '1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Baselines to Beat</div>
            <div className="grid grid-cols-2 gap-[0.5vh]">
              {[
                { sys: 'Vanilla RAG', why: 'Floor comparison' },
                { sys: 'D-RAG (Euclidean)', why: 'Direct ablation — same arch, different geometry' },
                { sys: 'CogGRAG', why: 'Best non-geometric multi-hop' },
                { sys: 'SG-RAG', why: 'Best symbolic system' },
              ].map((b) => (
                <div key={b.sys} className="flex gap-[0.5vw] items-start">
                  <div className="mt-[0.4vh] w-[0.4vw] h-[0.4vw] rounded-full shrink-0" style={{ background: '#10B981' }} />
                  <div>
                    <span className="font-body font-semibold" style={{ fontSize: '1.3vw', color: '#F1F5F9', fontFamily: 'DM Sans, sans-serif' }}>{b.sys}</span>
                    <span className="font-body" style={{ fontSize: '1.2vw', color: '#64748B', fontFamily: 'DM Sans, sans-serif' }}> — {b.why}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-[1.5vw]" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.08))', border: '1px solid rgba(0,212,255,0.3)' }}>
            <div className="font-display font-bold mb-[0.8vh]" style={{ fontSize: '1.6vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>Final Verdict</div>
            <p className="font-body" style={{ fontSize: '1.4vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>
              RMF-RAG is <span style={{ color: '#10B981', fontWeight: 600 }}>genuinely novel</span>. No paper combines Poincaré KG embedding + geodesic retrieval + LLM generation. Scope it to one clean component — replace Euclidean distance with Poincaré distance in D-RAG — and you have a publishable undergraduate research project.
            </p>
          </div>

          <div className="flex gap-[1.5vw]">
            {[
              { label: 'Publication Target', value: 'ACL/EMNLP Findings', color: '#00D4FF' },
              { label: 'Implementation', value: 'Hard but feasible', color: '#10B981' },
              { label: 'Timeline', value: '8–10 weeks', color: '#F59E0B' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col rounded-lg px-[1.2vw] py-[0.8vh]" style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="font-mono" style={{ fontSize: '1vw', color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{s.label}</div>
                <div className="font-display font-semibold" style={{ fontSize: '1.4vw', color: s.color, fontFamily: 'Space Grotesk, sans-serif' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: 'linear-gradient(90deg, #00D4FF, #10B981, #7C3AED, #00D4FF)' }} />
    </div>
  );
}
