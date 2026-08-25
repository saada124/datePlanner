import React, { useEffect, useRef } from 'react';
import { watercolorAudio } from '../utils/watercolorAudio';

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  swayPhase: number;
  swaySpeed: number;
  color: string;
  alpha: number;
  type: 'sakura' | 'leaf' | 'sparkle';
}

interface SplashDroplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  decay: number;
  growSpeed: number;
}

interface BrushParticle {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

interface AmbientWash {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  color: string;
  alpha: number;
  phase: number;
  speed: number;
}

const DEFAULT_PALETTE = [
  '#e85d75', // Blush Rose
  '#3a86ff', // Cerulean Blue
  '#fb8500', // Sunset Amber
  '#2a9d8f', // Emerald Meadow
  '#8338ec', // Lavender Dream
];

const PETAL_COLORS = [
  '#f8adbb', // Soft Sakura Pink
  '#f4978e', // Peach Blossom
  '#fbcfe8', // Pale Rose
  '#fda4af', // Coral Pink
  '#c4b5fd', // Soft Lavender
  '#86efac', // Spring Sage Leaf
  '#fde047', // Golden Dust
];

interface WatercolorCanvasOverlayProps {
  ambientPalette?: string[];
}

export const WatercolorCanvasOverlay: React.FC<WatercolorCanvasOverlayProps> = ({
  ambientPalette = DEFAULT_PALETTE
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const splashesRef = useRef<SplashDroplet[]>([]);
  const brushTrailRef = useRef<BrushParticle[]>([]);
  const washesRef = useRef<AmbientWash[]>([]);
  const mouseWindRef = useRef<{ x: number; y: number; vx: number; vy: number; lastTime: number }>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    lastTime: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initAmbientWashes();
      initPetals();
    };

    // 1. Initialize Living Ambient Watercolor Washes
    const initAmbientWashes = () => {
      washesRef.current = [];
      const palette = ambientPalette.length > 0 ? ambientPalette : DEFAULT_PALETTE;
      for (let i = 0; i < 5; i++) {
        const x = (canvas.width / 5) * i + Math.random() * (canvas.width / 6);
        const y = Math.random() * canvas.height;
        washesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          radius: 180 + Math.random() * 220,
          color: palette[i % palette.length],
          alpha: 0.07 + Math.random() * 0.05,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0012 + Math.random() * 0.001
        });
      }
    };

    // 2. Initialize Drifting Petals & Golden Starlight Dust
    const initPetals = () => {
      petalsRef.current = [];
      const count = Math.min(32, Math.floor(window.innerWidth / 45));

      for (let i = 0; i < count; i++) {
        const randType = Math.random();
        const type: Petal['type'] = randType < 0.65 ? 'sakura' : randType < 0.85 ? 'sparkle' : 'leaf';
        const color =
          type === 'sparkle'
            ? '#ffb703'
            : type === 'leaf'
            ? '#80b9ad'
            : PETAL_COLORS[Math.floor(Math.random() * (PETAL_COLORS.length - 2))];

        petalsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: 0.4 + Math.random() * 0.8,
          size: type === 'sparkle' ? 2 + Math.random() * 3.5 : 8 + Math.random() * 10,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          flip: Math.random() * Math.PI * 2,
          flipSpeed: 0.02 + Math.random() * 0.03,
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.015 + Math.random() * 0.015,
          color,
          alpha: type === 'sparkle' ? 0.35 + Math.random() * 0.45 : 0.45 + Math.random() * 0.35,
          type
        });
      }
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Interactive Paint Splash
    const createSplash = (x: number, y: number, customColor?: string) => {
      const palette = ambientPalette.length > 0 ? ambientPalette : DEFAULT_PALETTE;
      const count = 14 + Math.floor(Math.random() * 8);
      const splashColor = customColor || palette[Math.floor(Math.random() * palette.length)];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.4 + Math.random() * 4.2;

        splashesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 2 + Math.random() * 6,
          maxRadius: 8 + Math.random() * 16,
          color: splashColor,
          alpha: 0.6 + Math.random() * 0.25,
          decay: 0.012 + Math.random() * 0.01,
          growSpeed: 0.25 + Math.random() * 0.4
        });
      }

      if (splashesRef.current.length > 50) {
        splashesRef.current = splashesRef.current.slice(-50);
      }
    };

    const handleCustomSplash = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number; color?: string }>;
      if (customEvent.detail) {
        createSplash(customEvent.detail.x, customEvent.detail.y, customEvent.detail.color);
      }
    };
    window.addEventListener('trigger-watercolor-splash', handleCustomSplash);

    // Mouse movement: Brush trails and wind physics
    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const x = e.clientX;
      const y = e.clientY;

      if (mouseWindRef.current.lastTime > 0) {
        const dt = Math.max(1, now - mouseWindRef.current.lastTime);
        const dx = x - mouseWindRef.current.x;
        const dy = y - mouseWindRef.current.y;
        mouseWindRef.current.vx = (dx / dt) * 0.8;
        mouseWindRef.current.vy = (dy / dt) * 0.8;

        const dist = Math.hypot(dx, dy);
        if (dt > 30 && dist > 12) {
          const palette = ambientPalette.length > 0 ? ambientPalette : DEFAULT_PALETTE;
          brushTrailRef.current.push({
            x,
            y,
            radius: 8 + Math.random() * 10,
            color: palette[Math.floor(Math.random() * palette.length)],
            alpha: 0.22,
            decay: 0.015
          });

          if (brushTrailRef.current.length > 25) {
            brushTrailRef.current.shift();
          }
        }
      }

      mouseWindRef.current.x = x;
      mouseWindRef.current.y = y;
      mouseWindRef.current.lastTime = now;
    };

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      createSplash(e.clientX, e.clientY);
      watercolorAudio.playSplatterPop();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // Draw single organic sakura petal
    const drawSakuraPetal = (ctx: CanvasRenderingContext2D, size: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.8, -size * 0.5, size * 0.9, size * 0.5, 0, size);
      ctx.bezierCurveTo(-size * 0.9, size * 0.5, -size * 0.8, -size * 0.5, 0, -size);
      ctx.fill();

      // Soft center vein
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.7);
      ctx.lineTo(0, size * 0.6);
      ctx.stroke();
    };

    // Draw single botanical leaf
    const drawLeaf = (ctx: CanvasRenderingContext2D, size: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * 0.7, 0, 0, size);
      ctx.quadraticCurveTo(-size * 0.7, 0, 0, -size);
      ctx.fill();
    };

    // Draw twinkling starlight sparkle
    const drawSparkle = (ctx: CanvasRenderingContext2D, size: number, color: string, phase: number) => {
      const pulse = 0.7 + 0.3 * Math.sin(phase * 3);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(0, 0, size * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    // 60FPS Fluid Render Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dampen mouse wind over time
      mouseWindRef.current.vx *= 0.92;
      mouseWindRef.current.vy *= 0.92;

      // 1. Draw Living Ambient Watercolor Blooms
      washesRef.current.forEach((w) => {
        w.phase += w.speed;
        w.x = w.baseX + Math.sin(w.phase) * 45;
        w.y = w.baseY + Math.cos(w.phase * 0.8) * 35;

        const radGrad = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.radius);
        radGrad.addColorStop(0, w.color);
        radGrad.addColorStop(0.55, w.color);
        radGrad.addColorStop(1, 'transparent');

        ctx.save();
        ctx.globalAlpha = w.alpha;
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 2. Draw Floating Petals & Starry Dust
      petalsRef.current.forEach((p) => {
        p.swayPhase += p.swaySpeed;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        // Interaction with mouse wind
        const dx = p.x - mouseWindRef.current.x;
        const dy = p.y - mouseWindRef.current.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 3 + mouseWindRef.current.vx * 0.4;
          p.y += (dy / dist) * force * 3 + mouseWindRef.current.vy * 0.4;
        }

        // Natural drifting fall physics
        p.x += Math.sin(p.swayPhase) * 0.7 + p.vx;
        p.y += p.vy;

        // Wrap around screen edges smoothly
        if (p.y > canvas.height + 25) {
          p.y = -25;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -30) p.x = canvas.width + 25;
        if (p.x > canvas.width + 30) p.x = -25;

        // Render Petal with 3D Flip Scale
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        const flipScale = Math.cos(p.flip);
        ctx.scale(1, Math.abs(flipScale) * 0.75 + 0.25);
        ctx.globalAlpha = p.alpha;

        if (p.type === 'sakura') {
          drawSakuraPetal(ctx, p.size, p.color);
        } else if (p.type === 'leaf') {
          drawLeaf(ctx, p.size, p.color);
        } else {
          drawSparkle(ctx, p.size, p.color, p.swayPhase);
        }

        ctx.restore();
      });

      // 3. Draw Brush Trails
      for (let i = brushTrailRef.current.length - 1; i >= 0; i--) {
        const b = brushTrailRef.current[i];
        b.alpha -= b.decay;
        b.radius += 0.2;

        if (b.alpha <= 0) {
          brushTrailRef.current.splice(i, 1);
          continue;
        }

        const radGrad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        radGrad.addColorStop(0, b.color);
        radGrad.addColorStop(0.7, b.color);
        radGrad.addColorStop(1, 'transparent');

        ctx.save();
        ctx.globalAlpha = b.alpha;
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4. Draw Interactive Splashes
      for (let i = splashesRef.current.length - 1; i >= 0; i--) {
        const s = splashesRef.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.92;
        s.vy *= 0.92;
        if (s.radius < s.maxRadius) {
          s.radius += s.growSpeed;
        }
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          splashesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = s.color;
        ctx.lineWidth = 0.75;
        ctx.stroke();
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('trigger-watercolor-splash', handleCustomSplash);
    };
  }, [ambientPalette]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ touchAction: 'none' }}
    />
  );
};
