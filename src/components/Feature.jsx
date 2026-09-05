import "./Feature.css";

export default function Feature({
  number,
  title,
  description,
  type,
}) {
  return (
    <section
      className="feature"
      id="features"
    >

      <div className={`feature-visual ${type}`}>

        {type === "speed" && (
          <div className="visual-speed">
             <div className="warp-tunnel">
                {Array.from({ length: 12 }).map((_, i) => (
                   <div key={i} className="warp-line" style={{ '--i': i }} />
                ))}
             </div>
             <div className="speed-core" />
          </div>
        )}

        {type === "privacy" && (
          <div className="visual-privacy">
            <div className="privacy-beam" />
            <div className="privacy-rings">
              <div className="privacy-ring-outer" />
              <div className="privacy-ring-inner" />
              <div className="privacy-core" />
            </div>
          </div>
        )}

        {type === "design" && (
          <div className="visual-design">
            <div className="design-layer layer-3">
               <div className="layer-circle" />
               <div className="layer-line" />
               <div className="layer-line short" />
            </div>
            <div className="design-layer layer-2">
               <div className="layer-box" />
               <div className="layer-box" />
               <div className="layer-box" />
            </div>
            <div className="design-layer layer-1">
               <div className="layer-header" />
               <div className="layer-content" />
            </div>
          </div>
        )}

        <div className="feature-lines" />

        <span>
          TAIGA / {number}
        </span>

      </div>

      <div className="feature-content">

        <span className="feature-number">
          {number}
        </span>

        <h2>
          {title}
        </h2>

        <p>
          {description}
        </p>

        <div className="feature-arrow">
          ↓
        </div>

      </div>

    </section>
  );
}