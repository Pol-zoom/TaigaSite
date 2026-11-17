
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export const diveFit = (r) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const [x, y, w, h] = r;

  const s = Math.min(
    (vw * 0.86) / w,
    (vh * 0.72) / h,
    3.2
  );

  return {
    s,
    x: vw / 2 - (x + w / 2) * s,
    y: vh / 2 - (y + h / 2) * s,
  };
};

const center = (el) => {
  if (!el) return null;

  const r = el.getBoundingClientRect();

  return {
    x: r.left + r.width / 2,
    y: r.top + r.height / 2,
  };
};

export const queryGuide = (root) => ({
  robot: root?.querySelector(".robot"),
  arm: root?.querySelector(".robot-arm"),
  shoulder: root?.querySelector(".robot-shoulder"),
  head: root?.querySelector(".robot-head-marker"),
  tip: root?.querySelector(".arm-tip"),
  line: root?.querySelector(".beam-line"),
  dot: root?.querySelector(".beam-dot"),
});

export const updateGuide = (els, target) => {
  if (
    !els?.robot ||
    !els.arm ||
    !els.shoulder ||
    !els.head ||
    !els.tip ||
    !els.line ||
    !els.dot
  ) return;

  const s = center(els.shoulder);
  const angle = clamp(
    (Math.atan2(target.y - s.y, target.x - s.x) * 180) / Math.PI,
    -84,
    24
  );

  els.arm.style.transform = `rotate(${angle.toFixed(2)}deg)`;

  const h = center(els.head);
  const dx = target.x - h.x;
  const dy = target.y - h.y;
  const d = Math.hypot(dx, dy) || 1;

  els.robot.style.setProperty(
    "--lx",
    `${((dx / d) * 4).toFixed(2)}px`
  );

  els.robot.style.setProperty(
    "--ly",
    `${((dy / d) * 3).toFixed(2)}px`
  );

  const t = center(els.tip);

  els.line.setAttribute("x1", t.x.toFixed(1));
  els.line.setAttribute("y1", t.y.toFixed(1));
  els.line.setAttribute("x2", target.x.toFixed(1));
  els.line.setAttribute("y2", target.y.toFixed(1));

  els.dot.setAttribute("cx", target.x.toFixed(1));
  els.dot.setAttribute("cy", target.y.toFixed(1));
};
