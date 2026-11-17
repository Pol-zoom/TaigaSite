import { useEffect, useRef } from "react";

export default function Starfield({ count = 180 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let stars = [];
    let raf = 0;

    const make = () => ({
      x: Math.random() * w - w / 2,
      y: Math.random() * h - h / 2,
      z: Math.random() * w,
      tw: Math.random() * Math.PI * 2,
    });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const k = w / s.z;
        const x = s.x * k + w / 2;
        const y = s.y * k + h / 2;
        const depth = 1 - s.z / w;
        s.tw += 0.03;
        ctx.globalAlpha = Math.min(0.9, (0.15 + depth * 0.7) * (0.7 + 0.3 * Math.sin(s.tw)));
        ctx.fillStyle = "#ecebe4";
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.3, depth * 1.8), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const frame = () => {
      for (const s of stars) {
        s.z -= 1.1;
        if (s.z <= 1) Object.assign(s, make(), { z: w });
      }
      draw();
      if (!reduce) raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: count }, make);
      draw();
    };

    resize();
    frame();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={ref} className="starfield-canvas" aria-hidden="true" />;
}
