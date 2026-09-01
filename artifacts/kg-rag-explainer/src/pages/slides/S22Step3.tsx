export default function S22Step3() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>
      <div style={{ background: '#1E1B4B', padding: '2vh 4vw 1.8vh', display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
        <div style={{ background: '#EA580C', color: '#FFFFFF', borderRadius: '50%', width: '3.5vw', height: '3.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.6vw', fontWeight: 800, flexShrink: 0 }}>3</div>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC' }}>STEP 3 OF 5 — SECOND HOP</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2.4vw', fontWeight: 800, color: '#FFFFFF' }}>Follow the geodesic from Diabetes → find Insulin Resistance mechanism</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '3vw', padding: '2.5vh 4vw', alignItems: 'stretch' }}>

        <div style={{ flex: '0 0 48%', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#FFF7ED', borderRadius: '0.8vw', padding: '2vh 2vw', border: '1px solid #FED7AA' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#C2410C', marginBottom: '0.8vh' }}>What happens</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.5vw', color: '#9A3412', lineHeight: 1.5, margin: 0 }}>
              Now standing at "Type 2 Diabetes," RMF-RAG computes geodesic distances to all neighboring nodes. It's looking for the mechanism — the bridge concept that connects a disease to its treatments. The closest node is "Insulin Resistance."
            </p>
          </div>

          <div style={{ background: '#F8FAFC', borderRadius: '0.8vw', padding: '1.8vh 2vw', border: '1px solid #E2E8F0' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#44403C', marginBottom: '0.8vh' }}>Why this step matters</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.4vw', color: '#57534E', lineHeight: 1.5, margin: 0 }}>
              Insulin Resistance is not in the original question. Neither is GLUT4. But they are essential bridge concepts that connect the disease to the right drug. This is what "multi-hop" means — the AI must reason through concepts the user never mentioned.
            </p>
            <div style={{ marginTop: '1.2vh', display: 'flex', gap: '0.8vw', flexWrap: 'wrap' }}>
              <div style={{ background: '#FFF7ED', borderRadius: '0.5vw', padding: '0.5vh 0.8vw', border: '1px solid #FED7AA', fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#C2410C' }}>Insulin Resistance</div>
              <div style={{ background: '#FFF7ED', borderRadius: '0.5vw', padding: '0.5vh 0.8vw', border: '1px solid #FED7AA', fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#C2410C' }}>GLUT4 transporter</div>
              <div style={{ background: '#FFF7ED', borderRadius: '0.5vw', padding: '0.5vh 0.8vw', border: '1px solid #FED7AA', fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#C2410C' }}>Pancreatic beta cells</div>
            </div>
          </div>

          <div style={{ background: '#1E1B4B', borderRadius: '0.8vw', padding: '1.5vh 1.8vw' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#A5B4FC', marginBottom: '0.5vh' }}>RUNNING CHAIN SO FAR</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6vw', flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.2vw', color: '#F59E0B', background: 'rgba(245,158,11,0.15)', padding: '0.4vh 0.6vw', borderRadius: '0.3vw' }}>TCF7L2</div>
              <span style={{ color: '#64748B', fontFamily: 'DM Mono, monospace', fontSize: '1.2vw' }}>→</span>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.2vw', color: '#34D399', background: 'rgba(52,211,153,0.15)', padding: '0.4vh 0.6vw', borderRadius: '0.3vw' }}>Type 2 Diabetes</div>
              <span style={{ color: '#64748B', fontFamily: 'DM Mono, monospace', fontSize: '1.2vw' }}>→</span>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.2vw', color: '#FB923C', background: 'rgba(251,146,60,0.15)', padding: '0.4vh 0.6vw', borderRadius: '0.3vw' }}>Insulin Resistance</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#78716C', marginBottom: '1vh' }}>POINCARÉ BALL — HOP 2</div>
          <svg viewBox="0 0 320 320" style={{ width: '100%', maxHeight: '62vh' }}>
            <circle cx="160" cy="160" r="145" fill="rgba(37,99,235,0.03)" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="160" cy="160" r="100" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4,3" />
            <circle cx="160" cy="160" r="55" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4,3" />

            {/* Center */}
            <circle cx="160" cy="160" r="22" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2" />
            <text x="160" y="157" textAnchor="middle" fill="#1D4ED8" fontSize="10" fontFamily="Plus Jakarta Sans, sans-serif">Drug</text>
            <text x="160" y="168" textAnchor="middle" fill="#1D4ED8" fontSize="9" fontFamily="DM Sans, sans-serif">Disease  Gene</text>

            {/* Type 2 Diabetes — current position */}
            <circle cx="110" cy="110" r="20" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2.5" />
            <text x="110" y="107" textAnchor="middle" fill="#15803D" fontSize="10" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">Type 2</text>
            <text x="110" y="119" textAnchor="middle" fill="#15803D" fontSize="9" fontFamily="DM Sans, sans-serif">Diabetes</text>
            <line x1="138" y1="148" x2="130" y2="130" stroke="#16A34A" strokeWidth="2" />

            {/* TCF7L2 — faded (already visited) */}
            <circle cx="65" cy="68" r="12" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="65" y="71" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="DM Sans, sans-serif">TCF7L2</text>
            <line x1="94" y1="96" x2="79" y2="82" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="3,2" />

            {/* Hop 1 path (faded) */}
            <path d="M 65 68 Q 80 90 110 110" fill="none" stroke="#D1FAE5" strokeWidth="2" />

            {/* Insulin Resistance — new target highlighted */}
            <circle cx="65" cy="170" r="20" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
            <text x="65" y="167" textAnchor="middle" fill="#B45309" fontSize="9" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">Insulin</text>
            <text x="65" y="178" textAnchor="middle" fill="#B45309" fontSize="8" fontFamily="DM Sans, sans-serif">Resistance</text>
            <line x1="90" y1="160" x2="92" y2="165" stroke="#F59E0B" strokeWidth="1.5" />

            {/* Hop 2 geodesic */}
            <path d="M 110 130 Q 85 150 65 170" fill="none" stroke="#EA580C" strokeWidth="3" strokeDasharray="6,3" />
            <polygon points="65,170 58,158 76,160" fill="#EA580C" />

            <text x="55" y="145" fill="#C2410C" fontSize="10" fontFamily="DM Mono, monospace" textAnchor="middle">geodesic</text>
            <text x="55" y="157" fill="#C2410C" fontSize="10" fontFamily="DM Mono, monospace" textAnchor="middle">hop 2</text>

            {/* Other nodes faded */}
            <circle cx="155" cy="35" r="11" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="155" y="38" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="DM Sans, sans-serif">Metformin</text>
            <circle cx="245" cy="68" r="11" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="245" y="71" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="DM Sans, sans-serif">Insulin</text>
            <circle cx="210" cy="110" r="12" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="210" y="113" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="DM Sans, sans-serif">Hypert.</text>

            <text x="160" y="298" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="DM Mono, monospace">Hop 2 complete: found Insulin Resistance</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
