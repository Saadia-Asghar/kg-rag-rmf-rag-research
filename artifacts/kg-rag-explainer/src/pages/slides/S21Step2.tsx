export default function S21Step2() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>
      <div style={{ background: '#1E1B4B', padding: '2vh 4vw 1.8vh', display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
        <div style={{ background: '#16A34A', color: '#FFFFFF', borderRadius: '50%', width: '3.5vw', height: '3.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.6vw', fontWeight: 800, flexShrink: 0 }}>2</div>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC' }}>STEP 2 OF 5 — FIRST HOP</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2.4vw', fontWeight: 800, color: '#FFFFFF' }}>Follow the geodesic from TCF7L2 → find Type 2 Diabetes</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '3vw', padding: '2.5vh 4vw', alignItems: 'stretch' }}>

        <div style={{ flex: '0 0 48%', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#F0FDF4', borderRadius: '0.8vw', padding: '2vh 2vw', border: '1px solid #86EFAC' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#15803D', marginBottom: '0.8vh' }}>What happens</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.5vw', color: '#166534', lineHeight: 1.5, margin: 0 }}>
              Starting from "TCF7L2" (near the boundary), RMF-RAG computes the geodesic distance — the shortest path along the curved surface — to every nearby node. The closest node in geodesic distance is "Type 2 Diabetes."
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5vw', flex: 1 }}>
            <div style={{ flex: 1, background: '#FFF0F0', borderRadius: '0.8vw', padding: '1.5vh 1.5vw', border: '1px solid #FCA5A5' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#DC2626', marginBottom: '0.5vh' }}>Old way (flat)</div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#991B1B', lineHeight: 1.5, margin: 0 }}>
                Cosine similarity finds "TCF7L2 protein folding" because it sounds similar. Gets the wrong next hop — ignores the causal chain.
              </p>
            </div>
            <div style={{ flex: 1, background: '#EFF6FF', borderRadius: '0.8vw', padding: '1.5vh 1.5vw', border: '1px solid #BFDBFE' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#1D4ED8', marginBottom: '0.5vh' }}>RMF-RAG (curved)</div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#1E40AF', lineHeight: 1.5, margin: 0 }}>
                Geodesic distance finds "Type 2 Diabetes" because they are geometrically connected in the hierarchy — even though they're different words.
              </p>
            </div>
          </div>

          <div style={{ background: '#1E1B4B', borderRadius: '0.8vw', padding: '1.5vh 1.8vw' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#A5B4FC', marginBottom: '0.5vh' }}>RESULT OF HOP 1</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.4vw', color: '#F59E0B', background: 'rgba(245,158,11,0.15)', padding: '0.5vh 0.8vw', borderRadius: '0.4vw' }}>TCF7L2</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.6vw', color: '#94A3B8' }}>→</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#60A5FA' }}>causes</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.6vw', color: '#94A3B8' }}>→</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.4vw', color: '#34D399', background: 'rgba(52,211,153,0.15)', padding: '0.5vh 0.8vw', borderRadius: '0.4vw' }}>Type 2 Diabetes</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#78716C', marginBottom: '1vh' }}>POINCARÉ BALL — HOP 1</div>
          <svg viewBox="0 0 320 320" style={{ width: '100%', maxHeight: '62vh' }}>
            <circle cx="160" cy="160" r="145" fill="rgba(37,99,235,0.03)" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="160" cy="160" r="100" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4,3" />
            <circle cx="160" cy="160" r="55" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4,3" />

            {/* Center */}
            <circle cx="160" cy="160" r="22" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2" />
            <text x="160" y="157" textAnchor="middle" fill="#1D4ED8" fontSize="10" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">Drug</text>
            <text x="160" y="168" textAnchor="middle" fill="#1D4ED8" fontSize="9" fontFamily="DM Sans, sans-serif">Disease  Gene</text>

            {/* Mid — Diabetes highlighted */}
            <circle cx="110" cy="110" r="20" fill="#DCFCE7" stroke="#16A34A" strokeWidth="3" />
            <text x="110" y="107" textAnchor="middle" fill="#15803D" fontSize="10" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">Type 2</text>
            <text x="110" y="119" textAnchor="middle" fill="#15803D" fontSize="9" fontFamily="DM Sans, sans-serif">Diabetes</text>
            <line x1="138" y1="146" x2="130" y2="130" stroke="#16A34A" strokeWidth="2" />

            <circle cx="210" cy="110" r="14" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.5" />
            <text x="210" y="107" textAnchor="middle" fill="#15803D" fontSize="8" fontFamily="Plus Jakarta Sans, sans-serif">Hypert.</text>
            <text x="210" y="117" textAnchor="middle" fill="#15803D" fontSize="7" fontFamily="DM Sans, sans-serif">disease</text>
            <line x1="182" y1="148" x2="197" y2="124" stroke="#16A34A" strokeWidth="1.5" />

            {/* TCF7L2 — start */}
            <circle cx="65" cy="68" r="14" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2.5" />
            <text x="65" y="65" textAnchor="middle" fill="#B45309" fontSize="9" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">TCF7L2</text>
            <text x="65" y="75" textAnchor="middle" fill="#B45309" fontSize="8" fontFamily="DM Sans, sans-serif">gene</text>
            <line x1="94" y1="96" x2="79" y2="82" stroke="#F59E0B" strokeWidth="1.5" />

            {/* Geodesic path — hop 1 */}
            <path d="M 65 68 Q 80 90 110 110" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6,3" />

            {/* Arrow head */}
            <polygon points="108,110 98,100 120,100" fill="#F59E0B" />

            <text x="70" y="100" fill="#B45309" fontSize="10" fontFamily="DM Mono, monospace">geodesic</text>
            <text x="70" y="112" fill="#B45309" fontSize="10" fontFamily="DM Mono, monospace">hop 1</text>

            {/* Other outer nodes, faded */}
            <circle cx="155" cy="35" r="11" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="155" y="38" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="DM Sans, sans-serif">Metformin</text>
            <circle cx="245" cy="68" r="11" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="245" y="71" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="DM Sans, sans-serif">Insulin</text>

            {/* Labels */}
            <text x="160" y="298" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="DM Mono, monospace">Hop 1 complete: found Type 2 Diabetes</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
