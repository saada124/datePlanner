import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  type: 'heart' | 'star' | 'sparkle';
  life: number;
  maxLife: number;
}

export const PixelBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

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

    // Initial ambient floating particles
    const colors = ['#ff7597', '#ffb3c6', '#ffd166', '#c8b6ff', '#fffdf0'];
    for (let i = 0; i < 35; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.5,
        size: Math.floor(Math.random() * 3) + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: Math.random() > 0.4 ? 'heart' : 'star',
        life: 1,
        maxLife: 1
      });
    }

    // Interactive click burst
    const handleClick = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2.5;
        particlesRef.current.push({
          x: clientX,
          y: clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 3 + Math.floor(Math.random() * 3),
          color: colors[Math.floor(Math.random() * colors.length)],
          type: Math.random() > 0.3 ? 'heart' : 'sparkle',
          life: 1,
          maxLife: 0.8 + Math.random() * 0.4
        });
      }
    };

    window.addEventListener('pointerdown', handleClick);

    // Draw pixel heart
    const drawPixelHeart = (context: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number) => {
      context.save();
      context.fillStyle = color;
      context.globalAlpha = alpha;
      const s = size;
      
      // 8-bit pixel heart layout (5x5 grid)
      context.fillRect(x - 2 * s, y - s, s, s);
      context.fillRect(x - s, y - 2 * s, s, s);
      context.fillRect(x, y - s, s, s);
      context.fillRect(x + s, y - 2 * s, s, s);
      context.fillRect(x + 2 * s, y - s, s, s);

      context.fillRect(x - 2 * s, y, s * 5, s);
      context.fillRect(x - s, y + s, s * 3, s);
      context.fillRect(x, y + 2 * s, s, s);

      context.restore();
    };

    // Draw pixel star
    const drawPixelStar = (context: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number) => {
      context.save();
      context.fillStyle = color;
      context.globalAlpha = alpha;
      const s = size;
      context.fillRect(x, y - s, s, s * 3);
      context.fillRect(x - s, y, s * 3, s);
      context.restore();
    };

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render & Update particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.maxLife < 1) {
          // Burst particle decaying
          p.life -= 0.02;
          if (p.life <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }
        } else {
          // Ambient particle wrap-around
          if (p.y < -20) {
            p.y = canvas.height + 20;
            p.x = Math.random() * canvas.width;
          }
          if (p.x < -20) p.x = canvas.width + 20;
          if (p.x > canvas.width + 20) p.x = -20;
        }

        const alpha = Math.max(0, p.life);
        if (p.type === 'heart') {
          drawPixelHeart(ctx, p.x, p.y, p.size, p.color, alpha * 0.7);
        } else {
          drawPixelStar(ctx, p.x, p.y, p.size, p.color, alpha * 0.6);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', handleClick);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};
