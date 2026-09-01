export default function S23Step4() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>
      <div style={{ background: '#1E1B4B', padding: '2vh 4vw 1.8vh', display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
        <div style={{ background: '#7C3AED', color: '#FFFFFF', borderRadius: '50%', width: '3.5vw', height: '3.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.6vw', fontWeight: 800, flexShrink: 0 }}>4</div>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC' }}>STEP 4 OF 5 — THIRD HOP</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2.4vw', fontWeight: 800, color: '#FFFFFF' }}>Follow the geodesic from mechanism → reach Metformin</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '3vw', padding: '2.5vh 4vw', alignItems: 'stretch' }}>

        <div style={{ flex: '0 0 48%', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#F5F3FF', borderRadius: '0.8vw', padding: '2vh 2vw', border: '1px solid #DDD6FE' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#6D28D9', marginBottom: '0.8vh' }}>What happens</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.5vw', color: '#4C1D95', lineHeight: 1.5, margin: 0 }}>
              From "Insulin Resistance," one more geodesic hop leads to the drug class that addresses this mechanism. The closest node in geodesic distance is "Metformin" — the first-line treatment for Type 2 Diabetes, which works precisely by reducing insulin resistance.
            </p>
          </div>

          <div style={{ background: '#F0FDF4', borderRadius: '0.8vw', padding: '1.8vh 2vw', border: '1px solid #86EFAC' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#14532D', marginBottom: '0.8vh' }}>Why RMF-RAG finds Metformin and not a wrong drug</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.4vw', color: '#166534', lineHeight: 1.5, margin: 0 }}>
              In hyperbolic space, "Metformin" is geometrically close to "Insulin Resistance" because they are connected through the hierarchy: Insulin Resistance → reduced by → Metformin. Flat cosine similarity might find "Lipitor" (also a common drug) — but in curved space, Lipitor is far away because it belongs to a completely different disease branch.
            </p>
          </div>

          <div style={{ background: '#1E1B4B', borderRadius: '0.8vw', padding: '1.5vh 1.8vw' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#A5B4FC', marginBottom: '0.5vh' }}>COMPLETE 3-HOP CHAIN</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5vw', flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#F59E0B', background: 'rgba(245,158,11,0.15)', padding: '0.4vh 0.6vw', borderRadius: '0.3vw' }}>TCF7L2</div>
              <span style={{ color: '#64748B', fontFamily: 'DM Mono, monospace', fontSize: '1.1vw' }}>→</span>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#34D399', background: 'rgba(52,211,153,0.15)', padding: '0.4vh 0.6vw', borderRadius: '0.3vw' }}>T2 Diabetes</div>
              <span style={{ color: '#64748B', fontFamily: 'DM Mono, monospace', fontSize: '1.1vw' }}>→</span>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#FB923C', background: 'rgba(251,146,60,0.15)', padding: '0.4vh 0.6vw', borderRadius: '0.3vw' }}>Insulin Resistance</div>
              <span style={{ color: '#64748B', fontFamily: 'DM Mono, monospace', fontSize: '1.1vw' }}>→</span>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#A78BFA', background: 'rgba(167,139,250,0.15)', padding: '0.4vh 0.6vw', borderRadius: '0.3vw' }}>Metformin</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#78716C', marginBottom: '1vh' }}>POINCARÉ BALL — HOP 3 (COMPLETE)</div>
          <svg viewBox="0 0 320 320" style={{ width: '100%', maxHeight: '62vh' }}>
            <circle cx="160" cy="160" r="145" fill="rgba(37,99,235,0.03)" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="160" cy="160" r="100" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4,3" />
            <circle cx="160" cy="160" r="55" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4,3" />

            {/* Center */}
            <circle cx="160" cy="160" r="22" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2" />
            <text x="160" y="157" textAnchor="middle" fill="#1D4ED8" fontSize="10" fontFamily="Plus Jakarta Sans, sans-serif">Drug</text>
            <text x="160" y="168" textAnchor="middle" fill="#1D4ED8" fontSize="9" fontFamily="DM Sans, sans-serif">class</text>

            {/* Type 2 Diabetes — visited */}
            <circle cx="110" cy="110" r="16" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="110" y="107" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="DM Sans, sans-serif">Type 2</text>
            <text x="110" y="118" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="DM Sans, sans-serif">Diabetes</text>
            <line x1="140" y1="148" x2="126" y2="126" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3,2" />

            {/* TCF7L2 — visited */}
            <circle cx="65" cy="68" r="12" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="65" y="71" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="DM Sans, sans-serif">TCF7L2</text>
            <line x1="94" y1="96" x2="79" y2="82" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="3,2" />

            {/* Insulin Resistance — current */}
            <circle cx="65" cy="170" r="18" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
            <text x="65" y="167" textAnchor="middle" fill="#B45309" fontSize="9" fontFamily="Plus Jakarta Sans, sans-serif">Insulin</text>
            <text x="65" y="178" textAnchor="middle" fill="#B45309" fontSize="8" fontFamily="DM Sans, sans-serif">Resistance</text>
            <line x1="90" y1="160" x2="92" y2="165" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3,2" />

            {/* Metformin — FOUND! */}
            <circle cx="120" cy="235" r="22" fill="#F5F3FF" stroke="#7C3AED" strokeWidth="3.5" />
            <text x="120" y="232" textAnchor="middle" fill="#5B21B6" fontSize="11" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">Metformin</text>
            <text x="120" y="244" textAnchor="middle" fill="#5B21B6" fontSize="9" fontFamily="DM Sans, sans-serif">ANSWER</text>

            {/* All 3 geodesic paths */}
            <path d="M 65 68 Q 80 90 110 110" fill="none" stroke="#D1FAE5" strokeWidth="1.5" />
            <path d="M 110 130 Q 85 150 65 170" fill="none" stroke="#D1FAE5" strokeWidth="1.5" />
            <path d="M 65 188 Q 85 210 120 235" fill="none" stroke="#7C3AED" strokeWidth="3" strokeDasharray="6,3" />
            <polygon points="120,235 108,224 130,220" fill="#7C3AED" />

            <text x="55" y="215" fill="#6D28D9" fontSize="10" fontFamily="DM Mono, monospace" textAnchor="middle">geodesic</text>
            <text x="55" y="227" fill="#6D28D9" fontSize="10" fontFamily="DM Mono, monospace" textAnchor="middle">hop 3</text>

            {/* Star around Metformin */}
            <circle cx="120" cy="235" r="28" fill="none" stroke="#A78BFA" strokeWidth="2" strokeDasharray="4,2" />

            <text x="160" y="298" textAnchor="middle" fill="#6D28D9" fontSize="11" fontFamily="DM Mono, monospace" fontWeight="bold">Hop 3 complete: Metformin found!</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
