const ACCENT = '#F59E0B';

export default function Slide08M3KGA() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#06091A' }}>
      <div className="absolute top-0 right-0 w-[40vw] h-[40vh] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }} />
      <div className="flex items-center gap-[1.5vw] px-[4vw] pt-[3.5vh] pb-[2vh]" style={{ borderBottom: 'rgba(245,158,11,0.2) solid 1px' }}>
        <div className="flex items-center justify-center w-[4.5vw] h-[4.5vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}18`, border: `2px solid ${ACCENT}`, color: ACCENT, fontSize: '1.8vw', fontFamily: 'Space Grotesk, sans-serif' }}>04</div>
        <div>
          <div className="font-display font-bold" style={{ fontSize: '2.2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>M³KG-RAG — Multi-hop Multimodal KG-RAG</div>
          <div className="font-body" style={{ fontSize: '1.4vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>Park et al. · CVPR 2026</div>
        </div>
        <div className="ml-auto px-[1vw] py-[0.5vh] rounded font-body font-semibold" style={{ background: `${ACCENT}20`, color: ACCENT, fontSize: '1.3vw', border: `1px solid ${ACCENT}40`, fontFamily: 'DM Sans, sans-serif' }}>QUERY &amp; METHOD</div>
      </div>
      <div className="flex flex-1 gap-0 px-[4vw] py-[2.5vh]">
        <div className="flex flex-col gap-[2.5vh] pr-[3vw]" style={{ flex: '0 0 52%', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: ACCENT, fontFamily: 'DM Mono, monospace' }}>The Research Question</div>
            <p className="font-display font-semibold leading-snug" style={{ fontSize: '2vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif', textWrap: 'balance' }}>
              How can an AI answer "What sound does this animal make?" by combining what it sees in the video with facts from a knowledge graph?
            </p>
          </div>
          <div>
            <div className="font-mono uppercase tracking-widest mb-[1.2vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>The Core Problem</div>
            <div className="flex flex-col gap-[1.2vh]">
              {[
                'Audio, video, and text live in different embedding sub-spaces — existing systems confuse the modalities',
                'Retrieving a "sound fact" using a visual embedding is meaningless — wrong retrieval space',
                'Multi-hop reasoning across modalities (see video → find species → find sound) has no existing framework',
              ].map((t, i) => (
                <div key={i} className="flex gap-[1vw] items-start">
                  <div className="mt-[0.5vh] w-[0.5vw] h-[0.5vw] rounded-full shrink-0" style={{ background: ACCENT }} />
                  <span className="font-body" style={{ fontSize: '1.6vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg p-[1.5vw]" style={{ background: `${ACCENT}0D`, border: `1px solid ${ACCENT}25` }}>
            <div className="font-mono uppercase tracking-widest mb-[0.8vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Tested On</div>
            <p className="font-body" style={{ fontSize: '1.5vw', color: '#CBD5E1', fontFamily: 'DM Sans, sans-serif' }}>AudioCaps-QA · VideoChatGPT (ActivityNet) · VALOR audio-visual benchmark</p>
          </div>
        </div>
        <div className="flex flex-col gap-[2vh] pl-[3vw]" style={{ flex: 1 }}>
          <div className="font-mono uppercase tracking-widest mb-[0.5vh]" style={{ fontSize: '1.1vw', color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>The Methodology — Two Phases</div>
          <div className="font-mono uppercase" style={{ fontSize: '1vw', color: ACCENT, fontFamily: 'DM Mono, monospace' }}>Phase 1: Build the M³KG</div>
          {[
            { n: '1', title: 'Captioning + Entity Extraction', desc: 'Generate rich captions for video/audio; extract entity-relation triplets and normalize to Wikipedia' },
            { n: '2', title: 'Inspector Self-Reflection', desc: 'An LLM inspector re-runs uncertain steps until confidence threshold is met' },
          ].map((s) => (
            <div key={s.n} className="flex gap-[1vw] items-start">
              <div className="shrink-0 flex items-center justify-center w-[2.5vw] h-[2.5vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}15`, border: `1.5px solid ${ACCENT}50`, color: ACCENT, fontSize: '1.2vw', fontFamily: 'Space Grotesk, sans-serif' }}>{s.n}</div>
              <div>
                <div className="font-display font-semibold" style={{ fontSize: '1.4vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>{s.title}</div>
                <div className="font-body" style={{ fontSize: '1.25vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>{s.desc}</div>
              </div>
            </div>
          ))}
          <div className="font-mono uppercase mt-[1vh]" style={{ fontSize: '1vw', color: ACCENT, fontFamily: 'DM Mono, monospace' }}>Phase 2: Retrieve &amp; Generate</div>
          {[
            { n: '3', title: 'Modality-Wise FAISS Retrieval', desc: 'Query audio/visual indexes separately using InternVL2 (visual) and CLAP (audio) models; top-5 per modality' },
            { n: '4', title: 'GRASP — Grounded Selective Pruning', desc: 'GroundingDINO verifies visual facts; TAG model verifies audio facts — hallucinated items are dropped' },
            { n: '5', title: 'MLLM Generation', desc: 'Verified multimodal triplets + original query → Qwen2.5-Omni generates the answer' },
          ].map((s) => (
            <div key={s.n} className="flex gap-[1vw] items-start">
              <div className="shrink-0 flex items-center justify-center w-[2.5vw] h-[2.5vw] rounded-full font-display font-bold" style={{ background: `${ACCENT}15`, border: `1.5px solid ${ACCENT}50`, color: ACCENT, fontSize: '1.2vw', fontFamily: 'Space Grotesk, sans-serif' }}>{s.n}</div>
              <div>
                <div className="font-display font-semibold" style={{ fontSize: '1.4vw', color: '#F1F5F9', fontFamily: 'Space Grotesk, sans-serif' }}>{s.title}</div>
                <div className="font-body" style={{ fontSize: '1.25vw', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[0.35vh]" style={{ background: ACCENT }} />
    </div>
  );
}
