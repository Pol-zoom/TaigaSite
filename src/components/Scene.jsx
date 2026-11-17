import { useEffect, useRef } from "react";
import { createScene } from "./portal";
import { sceneState } from "./sceneState";

export default function Scene() {
  const ref = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = createScene(ref.current, sceneState, { reduce });
    return () => scene.destroy();
  }, []);

  return <canvas ref={ref} className="scene-canvas" aria-hidden="true" />;
}
