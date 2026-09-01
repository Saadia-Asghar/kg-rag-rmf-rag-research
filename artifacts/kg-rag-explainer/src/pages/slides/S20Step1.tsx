export default function S20Step1() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>
      <div style={{ background: '#1E1B4B', padding: '2vh 4vw 1.8vh', display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
        <div style={{ background: '#2563EB', color: '#FFFFFF', borderRadius: '50%', width: '3.5vw', height: '3.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.6vw', fontWeight: 800, flexShrink: 0 }}>1</div>
        <div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9vw', color: '#A5B4FC' }}>STEP 1 OF 5</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2.4vw', fontWeight: 800, color: '#FFFFFF' }}>Place everything in hyperbolic space</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '3vw', padding: '2.5vh 4vw', alignItems: 'stretch' }}>

        {/* Left — explanation */}
        <div style={{ flex: '0 0 48%', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#EFF6FF', borderRadius: '0.8vw', padding: '2vh 2vw', border: '1px solid #BFDBFE' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#1D4ED8', marginBottom: '0.8vh' }}>What happens in this step</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.5vw', color: '#1E40AF', lineHeight: 1.5, margin: 0 }}>
              Before answering anything, RMF-RAG takes every entity in the knowledge graph and gives it a position inside the Poincaré ball — a curved "dome" of space.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh', flex: 1 }}>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start', background: '#F0FDF4', borderRadius: '0.7vw', padding: '1.2vh 1.2vw', border: '1px solid #86EFAC' }}>
              <div style={{ width: '0.8vw', height: '0.8vw', borderRadius: '50%', background: '#2563EB', marginTop: '0.3vh', flexShrink: 0 }} />
              <div>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#14532D' }}>General concepts → near center: </span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.4vw', color: '#166534' }}>"Drug", "Disease", "Gene" — broad categories that many things belong to</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start', background: '#FFF7ED', borderRadius: '0.7vw', padding: '1.2vh 1.2vw', border: '1px solid #FED7AA' }}>
              <div style={{ width: '0.8vw', height: '0.8vw', borderRadius: '50%', background: '#EA580C', marginTop: '0.3vh', flexShrink: 0 }} />
              <div>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#7C2D12' }}>Specific things → near edge: </span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.4vw', color: '#C2410C' }}>"TCF7L2 gene", "Metformin 500mg", "Type 2 Diabetes" — specific, leaf-level facts</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'flex-start', background: '#F5F3FF', borderRadius: '0.7vw', padding: '1.2vh 1.2vw', border: '1px solid #DDD6FE' }}>
              <div style={{ width: '0.8vw', height: '0.8vw', borderRadius: '50%', background: '#7C3AED', marginTop: '0.3vh', flexShrink: 0 }} />
              <div>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#4C1D95' }}>The rule: </span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.4vw', color: '#5B21B6' }}>the more hops away from a root concept, the further from center — depth is now geometry</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#FFFBEB', borderRadius: '0.8vw', padding: '1.2vh 1.5vw', border: '1px solid #FDE68A' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3vw', fontWeight: 700, color: '#92400E' }}>Our question's starting point:</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.4vw', color: '#78350F', marginTop: '0.3vh' }}>"TCF7L2 gene" is highly specific → it sits close to the outer boundary of the Poincaré ball</div>
          </div>
        </div>

        {/* Right — Poincaré ball diagram */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#78716C', marginBottom: '1vh' }}>THE POINCARÉ BALL — STEP 1</div>
          <svg viewBox="0 0 320 320" style={{ width: '100%', maxHeight: '60vh' }}>
            {/* Outer boundary */}
            <circle cx="160" cy="160" r="145" fill="rgba(37,99,235,0.03)" stroke="#CBD5E1" strokeWidth="2" />
            {/* Inner rings */}
            <circle cx="160" cy="160" r="100" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4,3" />
            <circle cx="160" cy="160" r="55" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4,3" />

            {/* Center — general concepts */}
            <circle cx="160" cy="160" r="22" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.5" />
            <text x="160" y="156" textAnchor="middle" fill="#1D4ED8" fontSize="10" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">Drug</text>
            <text x="160" y="168" textAnchor="middle" fill="#1D4ED8" fontSize="9" fontFamily="DM Sans, sans-serif">Disease  Gene</text>

            {/* Mid ring nodes */}
            <circle cx="110" cy="110" r="16" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2" />
            <text x="110" y="107" textAnchor="middle" fill="#15803D" fontSize="9" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">Diabetes</text>
            <text x="110" y="118" textAnchor="middle" fill="#15803D" fontSize="8" fontFamily="DM Sans, sans-serif">drug</text>
            <line x1="138" y1="146" x2="126" y2="126" stroke="#16A34A" strokeWidth="1.5" />

            <circle cx="210" cy="110" r="16" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2" />
            <text x="210" y="107" textAnchor="middle" fill="#15803D" fontSize="9" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">Blood</text>
            <text x="210" y="118" textAnchor="middle" fill="#15803D" fontSize="8" fontFamily="DM Sans, sans-serif">pressure drug</text>
            <line x1="182" y1="146" x2="194" y2="126" stroke="#16A34A" strokeWidth="1.5" />

            {/* Outer ring — specific, highlighted TCF7L2 */}
            <circle cx="65" cy="68" r="14" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2.5" />
            <text x="65" y="65" textAnchor="middle" fill="#B45309" fontSize="9" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">TCF7L2</text>
            <text x="65" y="76" textAnchor="middle" fill="#B45309" fontSize="8" fontFamily="DM Sans, sans-serif">gene</text>
            <line x1="94" y1="97" x2="79" y2="82" stroke="#F59E0B" strokeWidth="1.5" />

            <circle cx="155" cy="35" r="13" fill="#FFF0F0" stroke="#DC2626" strokeWidth="2" />
            <text x="155" y="32" textAnchor="middle" fill="#DC2626" fontSize="9" fontFamily="Plus Jakarta Sans, sans-serif">Metformin</text>
            <text x="155" y="43" textAnchor="middle" fill="#DC2626" fontSize="8" fontFamily="DM Sans, sans-serif">500mg</text>
            <line x1="110" y1="94" x2="140" y2="48" stroke="#DC2626" strokeWidth="1.2" />

            <circle cx="245" cy="68" r="13" fill="#FFF0F0" stroke="#DC2626" strokeWidth="2" />
            <text x="245" y="65" textAnchor="middle" fill="#DC2626" fontSize="9" fontFamily="Plus Jakarta Sans, sans-serif">Insulin</text>
            <text x="245" y="75" textAnchor="middle" fill="#DC2626" fontSize="8" fontFamily="DM Sans, sans-serif">glargine</text>
            <line x1="210" y1="94" x2="236" y2="81" stroke="#DC2626" strokeWidth="1.2" />

            {/* Star marker on TCF7L2 */}
            <circle cx="65" cy="68" r="18" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4,2" />
            <text x="65" y="102" textAnchor="middle" fill="#B45309" fontSize="9" fontFamily="DM Mono, monospace">← START HERE</text>

            {/* Labels */}
            <text x="160" y="298" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="DM Mono, monospace">center = general</text>
            <text x="160" y="311" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="DM Mono, monospace">boundary = specific</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
