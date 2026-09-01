export default function S03KGraph() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col" style={{ background: '#FAFAF7' }}>

      {/* Header */}
      <div style={{ background: '#1E1B4B', padding: '2.5vh 4vw 2vh' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1vw', color: '#A5B4FC', marginBottom: '0.5vh' }}>FOUNDATION</div>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '3vw', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
          What is a Knowledge Graph?
        </h2>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '3vw', padding: '2.5vh 4vw', alignItems: 'center' }}>

        {/* Left — definition */}
        <div style={{ flex: '0 0 44%', display: 'flex', flexDirection: 'column', gap: '2vh' }}>
          <div style={{ background: '#EFF6FF', borderRadius: '0.8vw', padding: '2vh 2vw', border: '1px solid #BFDBFE' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.8vw', fontWeight: 800, color: '#1E3A8A', marginBottom: '0.8vh' }}>Think of it as a map of facts</div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.5vw', color: '#1E40AF', margin: 0, lineHeight: 1.5 }}>
              Every <strong>thing</strong> (person, drug, gene, disease) is a dot. Every <strong>relationship</strong> between them is a line connecting the dots.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'center' }}>
              <div style={{ width: '0.7vw', height: '0.7vw', borderRadius: '50%', background: '#2563EB', flexShrink: 0 }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.5vw', color: '#44403C' }}><strong>Dot (node):</strong> "Metformin", "Type 2 Diabetes", "TCF7L2 gene"</span>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'center' }}>
              <div style={{ width: '0.7vw', height: '0.7vw', borderRadius: '50%', background: '#16A34A', flexShrink: 0 }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.5vw', color: '#44403C' }}><strong>Line (edge):</strong> "treats", "caused by", "mutated in"</span>
            </div>
            <div style={{ display: 'flex', gap: '1vw', alignItems: 'center' }}>
              <div style={{ width: '0.7vw', height: '0.7vw', borderRadius: '50%', background: '#EA580C', flexShrink: 0 }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.5vw', color: '#44403C' }}><strong>Path:</strong> a chain of connected dots — following the lines</span>
            </div>
          </div>

          <div style={{ background: '#FFFBEB', borderRadius: '0.8vw', padding: '1.5vh 1.5vw', border: '1px solid #FDE68A' }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4vw', fontWeight: 700, color: '#92400E' }}>Real example: Wikidata has 100 million facts</span>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#78350F', marginTop: '0.5vh' }}>connected in exactly this dot-and-line structure</div>
          </div>
        </div>

        {/* Right — visual graph */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1vw', color: '#78716C' }}>A TINY PIECE OF A MEDICAL KNOWLEDGE GRAPH</div>
          <svg viewBox="0 0 500 380" style={{ width: '100%', maxHeight: '58vh' }}>
            {/* Edges */}
            <line x1="250" y1="80" x2="130" y2="200" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="250" y1="80" x2="370" y2="200" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="130" y1="200" x2="80" y2="320" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="130" y1="200" x2="200" y2="320" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="370" y1="200" x2="300" y2="320" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="370" y1="200" x2="420" y2="320" stroke="#CBD5E1" strokeWidth="2" />

            {/* Edge labels */}
            <text x="172" y="148" fill="#94A3B8" fontSize="10" textAnchor="middle" fontFamily="DM Sans, sans-serif">causes</text>
            <text x="328" y="148" fill="#94A3B8" fontSize="10" textAnchor="middle" fontFamily="DM Sans, sans-serif">linked to</text>
            <text x="85" y="270" fill="#94A3B8" fontSize="10" textAnchor="middle" fontFamily="DM Sans, sans-serif">treated by</text>
            <text x="185" y="270" fill="#94A3B8" fontSize="10" textAnchor="middle" fontFamily="DM Sans, sans-serif">treated by</text>
            <text x="320" y="270" fill="#94A3B8" fontSize="10" textAnchor="middle" fontFamily="DM Sans, sans-serif">affects</text>
            <text x="415" y="270" fill="#94A3B8" fontSize="10" textAnchor="middle" fontFamily="DM Sans, sans-serif">variant of</text>

            {/* Top node — gene */}
            <circle cx="250" cy="80" r="38" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.5" />
            <text x="250" y="74" textAnchor="middle" fill="#1D4ED8" fontSize="11" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">TCF7L2</text>
            <text x="250" y="91" textAnchor="middle" fill="#1D4ED8" fontSize="10" fontFamily="DM Sans, sans-serif">gene</text>

            {/* Mid nodes */}
            <circle cx="130" cy="200" r="40" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2.5" />
            <text x="130" y="194" textAnchor="middle" fill="#15803D" fontSize="11" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">Type 2</text>
            <text x="130" y="208" textAnchor="middle" fill="#15803D" fontSize="10" fontFamily="DM Sans, sans-serif">Diabetes</text>

            <circle cx="370" cy="200" r="40" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2.5" />
            <text x="370" y="194" textAnchor="middle" fill="#C2410C" fontSize="11" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">Insulin</text>
            <text x="370" y="208" textAnchor="middle" fill="#C2410C" fontSize="10" fontFamily="DM Sans, sans-serif">Resistance</text>

            {/* Bottom nodes */}
            <circle cx="80" cy="320" r="33" fill="#F5F3FF" stroke="#7C3AED" strokeWidth="2" />
            <text x="80" y="316" textAnchor="middle" fill="#6D28D9" fontSize="10" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">Metformin</text>
            <text x="80" y="330" textAnchor="middle" fill="#6D28D9" fontSize="9" fontFamily="DM Sans, sans-serif">drug</text>

            <circle cx="200" cy="320" r="33" fill="#F5F3FF" stroke="#7C3AED" strokeWidth="2" />
            <text x="200" y="316" textAnchor="middle" fill="#6D28D9" fontSize="10" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">Insulin</text>
            <text x="200" y="330" textAnchor="middle" fill="#6D28D9" fontSize="9" fontFamily="DM Sans, sans-serif">therapy</text>

            <circle cx="305" cy="320" r="33" fill="#FFF0F0" stroke="#DC2626" strokeWidth="2" />
            <text x="305" y="316" textAnchor="middle" fill="#B91C1C" fontSize="10" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">Pancreatic</text>
            <text x="305" y="330" textAnchor="middle" fill="#B91C1C" fontSize="9" fontFamily="DM Sans, sans-serif">beta cells</text>

            <circle cx="420" cy="320" r="33" fill="#FFF0F0" stroke="#DC2626" strokeWidth="2" />
            <text x="420" y="316" textAnchor="middle" fill="#B91C1C" fontSize="10" fontWeight="bold" fontFamily="Plus Jakarta Sans, sans-serif">GLUT4</text>
            <text x="420" y="330" textAnchor="middle" fill="#B91C1C" fontSize="9" fontFamily="DM Sans, sans-serif">transporter</text>
          </svg>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3vw', color: '#78716C', textAlign: 'center', margin: 0 }}>
            Following the dots from <strong>TCF7L2</strong> down to <strong>Metformin</strong> = answering a 3-hop question
          </p>
        </div>
      </div>
    </div>
  );
}
