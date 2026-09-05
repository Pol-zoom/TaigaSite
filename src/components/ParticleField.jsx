import "./ParticleField.css";

export default function ParticleField() {
  const particles = Array.from(
    { length: 45 },
    (_, i) => i
  );

  return (
    <div className="particles">

      {particles.map((particle) => (
        <span
          key={particle}
          style={{
            "--x": `${Math.random() * 100}%`,
            "--y": `${Math.random() * 100}%`,
            "--delay": `${Math.random() * 5}s`,
            "--size": `${Math.random() * 3 + 1}px`,
          }}
        />
      ))}

    </div>
  );
}