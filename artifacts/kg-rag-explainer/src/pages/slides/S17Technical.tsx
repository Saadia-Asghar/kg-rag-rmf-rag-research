export default function S17Technical() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>
      <div style={{ background: '#1E1B4B', padding: '2.5vh 4vw 2vh' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#A5B4FC', marginBottom: '0.5vh' }}>RMF-RAG — IN TECHNICAL TERMS</div>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '3vw', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
          What is RMF-RAG? <span style={{ color: '#F472B6' }}>(The technical version)</span>
        </h2>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '2.5vw', padding: '2.5vh 4vw' }}>

        {/* Left — 3 innovations */}
        <div style={{ flex: '0 0 52%', display: 'flex', flexDirection: 'column', gap: '1.8vh' }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#44403C' }}>Three technical innovations — one per component:</div>

          <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start', background: '#EFF6FF', borderRadius: '0.8vw', padding: '1.5vh 1.5vw', border: '1px solid #BFDBFE' }}>
            <div style={{ background: '#2563EB', color: '#FFFFFF', borderRadius: '50%', width: '2.5vw', height: '2.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 800, flexShrink: 0 }}>1</div>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 700, color: '#1E3A8A' }}>Poincaré Ball Embeddings</div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#1D4ED8', margin: 0, lineHeight: 1.5 }}>
                Each KG entity gets a vector inside a Poincaré ball (a unit disk with hyperbolic geometry). General entities (gene) cluster near center; specific entities (TCF7L2-variant-p.Pro12Ala) appear near the boundary. Hierarchy is geometric.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start', background: '#F5F3FF', borderRadius: '0.8vw', padding: '1.5vh 1.5vw', border: '1px solid #DDD6FE' }}>
            <div style={{ background: '#7C3AED', color: '#FFFFFF', borderRadius: '50%', width: '2.5vw', height: '2.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 800, flexShrink: 0 }}>2</div>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 700, color: '#4C1D95' }}>Geodesic Distance Retrieval</div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#5B21B6', margin: 0, lineHeight: 1.5 }}>
                Replace cosine similarity with the Poincaré geodesic distance formula. Retrieved entities are those geometrically closest in hyperbolic space — naturally weighting deep, specific paths higher than shallow ones.
              </p>
              <div style={{ marginTop: '0.8vh', background: '#EDE9FE', borderRadius: '0.5vw', padding: '0.8vh 1vw', fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#6D28D9' }}>
                d(u,v) = cosh⁻¹( 1 + 2‖u−v‖² / ((1−‖u‖²)(1−‖v‖²)) )
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start', background: '#F0FDF4', borderRadius: '0.8vw', padding: '1.5vh 1.5vw', border: '1px solid #86EFAC' }}>
            <div style={{ background: '#16A34A', color: '#FFFFFF', borderRadius: '50%', width: '2.5vw', height: '2.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 800, flexShrink: 0 }}>3</div>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 700, color: '#14532D' }}>D-RAG Training Loop (Preserved)</div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#15803D', margin: 0, lineHeight: 1.5 }}>
                Keep D-RAG's Gumbel-Softmax differentiable training — only swap the Euclidean GNN for a geoopt Poincaré ball layer and the L2 distance for the geodesic formula. Everything else: unchanged.
              </p>
            </div>
          </div>
        </div>

        {/* Right — implementation + novelty */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.8vh' }}>
          <div style={{ background: '#F8FAFC', borderRadius: '0.8vw', padding: '1.8vh 1.8vw', border: '1px solid #E2E8F0' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#64748B', marginBottom: '0.8vh' }}>HOW TO BUILD IT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7vh' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.2vw', color: '#1E1B4B', background: '#F1F5F9', padding: '0.5vh 0.8vw', borderRadius: '0.4vw' }}>pip install geoopt</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.2vw', color: '#1E1B4B', background: '#F1F5F9', padding: '0.5vh 0.8vw', borderRadius: '0.4vw' }}>manifold = geoopt.PoincareBall(c=1.0)</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.2vw', color: '#1E1B4B', background: '#F1F5F9', padding: '0.5vh 0.8vw', borderRadius: '0.4vw' }}>dist = manifold.dist(u, v)</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.2vw', color: '#1E1B4B', background: '#F1F5F9', padding: '0.5vh 0.8vw', borderRadius: '0.4vw' }}>optim = geoopt.RiemannianSGD(params)</div>
            </div>
          </div>

          <div style={{ background: '#F0FDF4', borderRadius: '0.8vw', padding: '1.8vh 1.8vw', border: '1px solid #86EFAC' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#15803D', marginBottom: '0.8vh' }}>NOVELTY CHECKLIST</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7vh' }}>
              <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#16A34A', fontWeight: 700 }}>NOVEL</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#44403C' }}>Poincaré KG embeddings for RAG retrieval</span>
              </div>
              <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#16A34A', fontWeight: 700 }}>NOVEL</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#44403C' }}>Geodesic distance as the retrieval score</span>
              </div>
              <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#16A34A', fontWeight: 700 }}>NOVEL</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#44403C' }}>Addressing multi-hop failure via curvature</span>
              </div>
              <div style={{ display: 'flex', gap: '0.8vw', alignItems: 'center' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#F59E0B', fontWeight: 700 }}>PARTIAL</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#44403C' }}>Hyperbolic cross-attention in decoder (future work)</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#1E1B4B', borderRadius: '0.8vw', padding: '1.5vh 1.5vw' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC', marginBottom: '0.5vh' }}>TARGET JOURNAL</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5vw', fontWeight: 700, color: '#FFFFFF' }}>ACL / EMNLP Findings — undergraduate research</div>
          </div>
        </div>
      </div>
    </div>
  );
}
