import React, { useEffect, useRef } from 'react';

interface Blob {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  hue: string;
  opacity: number;
  drift: number;
  phase: number;
}

const COLORS = [
  '#f3c6d4', // soft rose
  '#cfe3f5', // baby sky
  '#d9cbec', // lavender
  '#cde6dd', // mint
  '#f8e4b7', // honey
  '#fadbd4'  // peach
];

export const WatercolorBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const blobsRef = useRef<Blob[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const seed = () => {
      blobsRef.current = [];
      for (let i = 0; i < 14; i++) {
        blobsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 70 + Math.random() * 140,
          speedX: (Math.random() - 0.5) * 0.25,
          speedY: (Math.random() - 0.5) * 0.2,
          hue: COLORS[Math.floor(Math.random() * COLORS.length)],
          opacity: 0.16 + Math.random() * 0.16,
          drift: 0.4 + Math.random() * 0.8,
          phase: Math.random() * Math.PI * 2
        });
      }
    };
    seed();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = 'blur(28px)';

      blobsRef.current.forEach((b, i) => {
        b.phase += 0.003;
        b.x += Math.sin(b.phase * 2) * b.drift * 0.4 + b.speedX;
        b.y += Math.cos(b.phase) * b.drift * 0.4 + b.speedY;

        if (b.x < -b.radius) b.x = canvas.width + b.radius;
        if (b.x > canvas.width + b.radius) b.x = -b.radius;
        if (b.y < -b.radius) b.y = canvas.height + b.radius;
        if (b.y > canvas.height + b.radius) b.y = -b.radius;

        ctx.beginPath();
        ctx.fillStyle = b.hue;
        ctx.globalAlpha = b.opacity;
        ctx.ellipse(
          b.x,
          b.y,
          b.radius,
          b.radius * (0.7 + 0.3 * Math.sin(b.phase * 3 + i)),
          b.phase,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      ctx.filter = 'none';
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
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