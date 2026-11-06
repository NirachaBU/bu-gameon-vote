"use client";

import { useEffect, useRef } from "react";

type P =
  | { k: "rocket"; x: number; y: number; ty: number; vy: number }
  | { k: "spark"; x: number; y: number; vx: number; vy: number; life: number; decay: number; c: string; r: number }
  | { k: "conf"; x: number; y: number; vx: number; vy: number; rot: number; vr: number; w: number; h: number; c: string; sway: number };

const COLORS = ["#2fe3f5", "#7ff3ff", "#ffa62b", "#ffd28a", "#ffffff", "#5b7bff", "#ff6bcb"];

/** พลุ + กระดาษสีบนทั้งจอ พร้อมปุ่มยิงซ้ำ */
export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstRef = useRef<() => void>(() => {});

  useEffect(() => {
    const c = canvasRef.current!;
    const x = c.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, devicePixelRatio || 1);
    let W = 0, H = 0, raf = 0, last = 0;
    const ps: P[] = [];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const pick = <T,>(a: T[]) => a[(Math.random() * a.length) | 0];

    const resize = () => {
      W = innerWidth; H = innerHeight;
      c.width = W * dpr; c.height = H * dpr;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    const firework = (px: number, py: number) => {
      const col = pick(COLORS), n = 70 + ((Math.random() * 40) | 0);
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n, s = rnd(2, 6.5);
        ps.push({ k: "spark", x: px, y: py, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, decay: rnd(0.012, 0.02), c: Math.random() < 0.2 ? "#fff" : col, r: rnd(1.5, 2.6) });
      }
    };
    const rocket = () => {
      const tx = rnd(W * 0.12, W * 0.88);
      ps.push({ k: "rocket", x: tx, y: H + 10, ty: rnd(H * 0.12, H * 0.42), vy: -rnd(9, 12) });
    };
    const confetti = (n: number) => {
      for (let i = 0; i < n; i++)
        ps.push({ k: "conf", x: rnd(0, W), y: rnd(-H * 0.6, -10), vx: rnd(-1, 1), vy: rnd(1.5, 3.5), rot: rnd(0, 6.3), vr: rnd(-0.2, 0.2), w: rnd(6, 11), h: rnd(10, 18), c: pick(COLORS), sway: rnd(0, 6.3) });
    };
    burstRef.current = () => {
      if (reduce) return;
      for (let i = 0; i < 5; i++) setTimeout(rocket, i * 260);
      confetti(Math.min(220, W / 5));
    };

    const loop = (t: number) => {
      x.clearRect(0, 0, W, H);
      if (!reduce && t - last > 1500) { last = t; rocket(); if (Math.random() < 0.5) setTimeout(rocket, 300); }
      if (!reduce && Math.random() < 0.25) confetti(1);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        if (p.k === "rocket") {
          p.y += p.vy;
          x.fillStyle = "#ffd28a"; x.beginPath(); x.arc(p.x, p.y, 2.4, 0, 7); x.fill();
          ps.push({ k: "spark", x: p.x, y: p.y + 4, vx: rnd(-0.4, 0.4), vy: rnd(0.5, 1.5), life: 0.6, decay: 0.04, c: "#ffa62b", r: 1.4 });
          if (p.y <= p.ty) { firework(p.x, p.y); ps.splice(i, 1); }
        } else if (p.k === "spark") {
          p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.05; p.x += p.vx; p.y += p.vy; p.life -= p.decay;
          if (p.life <= 0) { ps.splice(i, 1); continue; }
          x.globalAlpha = p.life; x.fillStyle = p.c; x.shadowBlur = 8; x.shadowColor = p.c;
          x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill(); x.shadowBlur = 0; x.globalAlpha = 1;
        } else {
          p.sway += 0.05; p.x += p.vx + Math.sin(p.sway) * 0.8; p.y += p.vy; p.rot += p.vr;
          if (p.y > H + 20) { ps.splice(i, 1); continue; }
          const f = Math.abs(Math.cos(p.sway));
          x.save(); x.translate(p.x, p.y); x.rotate(p.rot); x.fillStyle = p.c;
          x.fillRect(-p.w / 2, (-p.h / 2) * f, p.w, p.h * f); x.restore();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const first = setTimeout(() => burstRef.current(), 400);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(first);
      removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="aw-fx" aria-hidden="true" />
      <button type="button" className="aw-again" onClick={() => burstRef.current()}>
        🎆 อีกรอบ
      </button>
    </>
  );
}
