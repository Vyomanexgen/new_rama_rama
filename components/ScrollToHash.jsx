import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash({ enabled = true } = {}) {
  const location = useLocation();

  useEffect(() => {
    if (!enabled) return;

    const id = (location.hash || "").replace(/^#/, "");
    if (!id) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let start = 0;

    const tick = (t) => {
      if (!start) start = t;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
        return;
      }
      if (t - start < 1500) raf = requestAnimationFrame(tick); // wait for route render
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, location.hash]);

  return null;
}
