import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
}

export const ConstellationBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);

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

    const colors = ['#ffffff', '#ffd166', '#c084fc', '#38bdf8', '#ff7597'];

    // Generate static/twinkling stars
    for (let i = 0; i < 70; i++) {
      starsRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0.8 + Math.random() * 1.8,
        alpha: 0.2 + Math.random() * 0.8,
        twinkleSpeed: 0.01 + Math.random() * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Occasional shooting stars
    const spawnShootingStar = () => {
      if (Math.random() > 0.4) {
        shootingStarsRef.current.push({
          x: Math.random() * canvas.width * 0.8,
          y: Math.random() * (canvas.height * 0.4),
          length: 60 + Math.random() * 60,
          speed: 8 + Math.random() * 6,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          opacity: 1
        });
      }
      setTimeout(spawnShootingStar, 3000 + Math.random() * 4000);
    };
    spawnShootingStar();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw faint constellation connection lines between nearby stars
      ctx.lineWidth = 0.5;
      for (let i = 0; i < starsRef.current.length; i++) {
        for (let j = i + 1; j < starsRef.current.length; j++) {
          const s1 = starsRef.current[i];
          const s2 = starsRef.current[j];
          const dist = Math.hypot(s1.x - s2.x, s1.y - s2.y);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.12 * (1 - dist / 110)})`;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }
      }

      // Draw and twinkle stars
      starsRef.current.forEach(star => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 0.95 || star.alpha < 0.2) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        ctx.save();
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, star.alpha);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw shooting stars
      for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
        const ss = shootingStarsRef.current[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= 0.015;

        if (ss.opacity <= 0 || ss.x > canvas.width || ss.y > canvas.height) {
          shootingStarsRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = `rgba(255, 209, 102, ${ss.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(
          ss.x - Math.cos(ss.angle) * ss.length,
          ss.y - Math.sin(ss.angle) * ss.length
        );
        ctx.stroke();
        ctx.restore();
      }

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
