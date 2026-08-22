import React, { useEffect, useRef } from 'react';

interface Drift {
  x: number;
  y: number;
  r: number;
  vy: number;
  phase: number;
  glyph: string;
  size: number;
  alpha: number;
}

const BLUSH = ['#e8c9a8', '#f0d9c4', '#e8b4a0', '#d9c3a8', '#f2d8c8', '#e3b78f'];

export const MixtapeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const notes: Drift[] = [];
    const glyphs = ['♪', '♫', '♥', '♪', '♩', '♫'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const seed = () => {
      notes.length = 0;
      for (let i = 0; i < 16; i++) {
        notes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: 60 + Math.random() * 130,
          vy: 0.08 + Math.random() * 0.18,
          phase: Math.random() * Math.PI * 2,
          glyph: glyphs[i % glyphs.length],
          size: 16 + Math.random() * 26,
          alpha: 0.05 + Math.random() * 0.05
        });
      }
    };
    seed();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = 'blur(26px)';

      // warm drifting blobs
      for (let i = 0; i < 10; i++) {
        const b = notes[i];
        b.phase += 0.003;
        const bx = b.x + Math.sin(b.phase) * 14;
        const by = b.y + Math.cos(b.phase * 0.8) * 12;
        ctx.beginPath();
        ctx.fillStyle = BLUSH[i % BLUSH.length];
        ctx.globalAlpha = 0.22;
        ctx.ellipse(bx, by, b.r, b.r * (0.7 + 0.3 * Math.sin(b.phase * 2)), b.phase * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // drifting music notes
      ctx.filter = 'none';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 10; i < notes.length; i++) {
        const n = notes[i];
        n.y -= n.vy;
        n.phase += 0.01;
        if (n.y < -40) n.y = canvas.height + 40;
        ctx.globalAlpha = n.alpha;
        ctx.fillStyle = '#c96f4a';
        ctx.font = `${n.size}px serif`;
        ctx.fillText(n.glyph, n.x + Math.sin(n.phase) * 20, n.y);
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