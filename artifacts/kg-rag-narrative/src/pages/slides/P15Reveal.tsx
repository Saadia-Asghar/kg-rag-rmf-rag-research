export default function P15Reveal() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex" style={{ background: '#071410' }}>
      {/* Emerald radial glow */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(16,185,129,0.12) 0%, transparent 65%)' }} />
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(16,185,129,0.05) 1px, transparent 0)',
        backgroundSize: '44px 44px'
      }} />

      {/* Left: reveal content */}
      <div className="relative z-10 flex flex-col justify-center px-[7vw] py-[5vh]" style={{ flex: '0 0 56%' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.1vw', color: '#6EE7B7', letterSpacing: '0.12em', marginBottom: '1.5vh' }}>
          THE REVEAL
        </div>

        <h2 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '2.4vw', fontWeight: 600, color: '#94A3B8', lineHeight: 1.2, marginBottom: '1vh' }}>
          Introducing:
        </h2>
        <h1 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '5.5vw', fontWeight: 700, color: '#10B981', lineHeight: 1, marginBottom: '2.5vh', letterSpacing: '-0.01em' }}>
          RMF-RAG
        </h1>
        <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '2vw', color: '#6EE7B7', marginBottom: '4vh' }}>
          Riemannian Manifold-Filtered Retrieval-Augmented Generation
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8vh' }}>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.5vw', height: '0.5vw', borderRadius: '50%', background: '#10B981', marginTop: '0.9vh', flexShrink: 0 }} />
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.8vw', color: '#F8FAFC', lineHeight: 1.45 }}>
              Embed the entire KG in a <span style={{ color: '#10B981', fontWeight: 600 }}>Poincare ball</span> — a hyperbolic manifold
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.5vw', height: '0.5vw', borderRadius: '50%', background: '#10B981', marginTop: '0.9vh', flexShrink: 0 }} />
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.8vw', color: '#F8FAFC', lineHeight: 1.45 }}>
              Measure concept distance using <span style={{ color: '#10B981', fontWeight: 600 }}>geodesic arcs</span>, not straight lines
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.5vw', height: '0.5vw', borderRadius: '50%', background: '#10B981', marginTop: '0.9vh', flexShrink: 0 }} />
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.8vw', color: '#F8FAFC', lineHeight: 1.45 }}>
              General concepts near center; specific concepts at the boundary
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.5vw', height: '0.5vw', borderRadius: '50%', background: '#10B981', marginTop: '0.9vh', flexShrink: 0 }} />
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '1.8vw', color: '#F8FAFC', lineHeight: 1.45 }}>
              Gene -- Disease -- Drug traces a <span style={{ color: '#10B981', fontWeight: 600 }}>geodesic</span>, not a Euclidean jump
            </div>
          </div>
        </div>
      </div>

      {/* Right: Poincare ball preview */}
      <div className="relative z-10 flex items-center justify-center" style={{ flex: 1 }}>
        <svg viewBox="0 0 300 300" style={{ width: '28vw', height: '28vw' }}>
          <defs>
            <radialGradient id="emeraldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(16,185,129,0.15)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="150" cy="150" r="138" fill="url(#emeraldGlow)" />
          <circle cx="150" cy="150" r="135" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
          <circle cx="150" cy="150" r="90" fill="none" stroke="rgba(16,185,129,0.18)" strokeWidth="0.8" />
          <circle cx="150" cy="150" r="50" fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="0.8" />

          {/* Gene at center */}
          <circle cx="150" cy="150" r="14" fill="rgba(16,185,129,0.9)" />
          <text x="150" y="154" textAnchor="middle" fill="white" fontSize="9" fontFamily="IBM Plex Mono">Gene</text>

          {/* Disease mid ring */}
          <circle cx="150" cy="62" r="10" fill="rgba(16,185,129,0.65)" />
          <text x="150" y="50" textAnchor="middle" fill="#6EE7B7" fontSize="9" fontFamily="IBM Plex Mono">Disease</text>
          <line x1="150" y1="100" x2="150" y2="72" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />

          <circle cx="226" cy="195" r="10" fill="rgba(16,185,129,0.65)" />
          <text x="248" y="199" fill="#6EE7B7" fontSize="9" fontFamily="IBM Plex Mono">Symptom</text>
          <line x1="200" y1="163" x2="218" y2="188" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />

          <circle cx="74" cy="195" r="10" fill="rgba(16,185,129,0.65)" />
          <text x="4" y="199" fill="#6EE7B7" fontSize="9" fontFamily="IBM Plex Mono">Pathway</text>
          <line x1="100" y1="163" x2="82" y2="188" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />

          {/* Drug outer ring */}
          <circle cx="150" cy="18" r="7" fill="rgba(16,185,129,0.45)" />
          <text x="150" y="8" textAnchor="middle" fill="#A7F3D0" fontSize="8" fontFamily="IBM Plex Mono">Drug</text>
          <line x1="150" y1="52" x2="150" y2="25" stroke="rgba(16,185,129,0.35)" strokeWidth="1" />

          <circle cx="258" cy="220" r="7" fill="rgba(16,185,129,0.45)" />
          <line x1="236" y1="203" x2="253" y2="215" stroke="rgba(16,185,129,0.35)" strokeWidth="1" />

          <circle cx="42" cy="220" r="7" fill="rgba(16,185,129,0.45)" />
          <line x1="66" y1="203" x2="49" y2="215" stroke="rgba(16,185,129,0.35)" strokeWidth="1" />

          <text x="150" y="284" textAnchor="middle" fill="rgba(110,231,183,0.5)" fontSize="8" fontFamily="IBM Plex Mono">Poincare ball — center = general, edge = specific</text>
        </svg>
      </div>

      {/* Bottom emerald line */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '0.35vh', background: 'linear-gradient(90deg, transparent 0%, #10B981 50%, transparent 100%)' }} />
    </div>
  );
}
