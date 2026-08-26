import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  r: number;
  vy: number;
  phase: number;
  glyph: string;
  size: number;
  alpha: number;
}

const WARM_GLOWS = ['#c96f4a', '#e0a458', '#b45f6f', '#7a4e32', '#d4af37'];

export const MixtapeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const particles: Particle[] = [];
    const glyphs = ['♪', '♫', '♥', '♪', '♩', '✦', '♫'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const seed = () => {
      particles.length = 0;
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: 50 + Math.random() * 120,
          vy: 0.1 + Math.random() * 0.22,
          phase: Math.random() * Math.PI * 2,
          glyph: glyphs[i % glyphs.length],
          size: 14 + Math.random() * 22,
          alpha: 0.04 + Math.random() * 0.06
        });
      }
    };
    seed();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Soft Warm Ambient Bokeh
      ctx.filter = 'blur(35px)';
      for (let i = 0; i < 8; i++) {
        const p = particles[i];
        p.phase += 0.002;
        const bx = p.x + Math.sin(p.phase) * 20;
        const by = p.y + Math.cos(p.phase * 0.7) * 16;
        ctx.beginPath();
        ctx.fillStyle = WARM_GLOWS[i % WARM_GLOWS.length];
        ctx.globalAlpha = 0.18;
        ctx.arc(bx, by, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Drifting Musical Glyphs & Vinyl Dust
      ctx.filter = 'none';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 8; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.vy;
        p.phase += 0.008;
        if (p.y < -30) p.y = canvas.height + 30;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#e0a458';
        ctx.font = `${p.size}px serif`;
        ctx.fillText(p.glyph, p.x + Math.sin(p.phase) * 15, p.y);
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};