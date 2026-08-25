import React, { useEffect, useRef } from 'react';
import { watercolorAudio } from '../utils/watercolorAudio';

interface Droplet {
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

interface AmbientBlob {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  baseX: number;
  baseY: number;
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

interface WatercolorCanvasOverlayProps {
  ambientPalette?: string[];
}

export const WatercolorCanvasOverlay: React.FC<WatercolorCanvasOverlayProps> = ({
  ambientPalette = DEFAULT_PALETTE
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dropletsRef = useRef<Droplet[]>([]);
  const brushTrailRef = useRef<BrushParticle[]>([]);
  const blobsRef = useRef<AmbientBlob[]>([]);
  const lastPointerRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initBlobs();
    };

    const initBlobs = () => {
      blobsRef.current = [];
      const palette = ambientPalette.length > 0 ? ambientPalette : DEFAULT_PALETTE;
      for (let i = 0; i < 6; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        blobsRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          radius: 120 + Math.random() * 160,
          color: palette[i % palette.length],
          alpha: 0.08 + Math.random() * 0.06,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0015 + Math.random() * 0.0015
        });
      }
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const ensureAnimating = () => {
      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        render();
      }
    };

    // Fast GPU-friendly Paint Splash Generator
    const createSplash = (x: number, y: number, customColor?: string) => {
      const palette = ambientPalette.length > 0 ? ambientPalette : DEFAULT_PALETTE;
      const count = 12 + Math.floor(Math.random() * 8);
      const splashColor = customColor || palette[Math.floor(Math.random() * palette.length)];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 4.5;

        dropletsRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 2 + Math.random() * 6,
          maxRadius: 8 + Math.random() * 16,
          color: splashColor,
          alpha: 0.55 + Math.random() * 0.25,
          decay: 0.012 + Math.random() * 0.012,
          growSpeed: 0.25 + Math.random() * 0.4
        });
      }

      // Limit particle array size
      if (dropletsRef.current.length > 45) {
        dropletsRef.current = dropletsRef.current.slice(-45);
      }

      ensureAnimating();
    };

    const handleCustomSplash = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number; color?: string }>;
      if (customEvent.detail) {
        createSplash(customEvent.detail.x, customEvent.detail.y, customEvent.detail.color);
      }
    };
    window.addEventListener('trigger-watercolor-splash', handleCustomSplash);

    // Throttled pointer move for brush trails
    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const x = e.clientX;
      const y = e.clientY;

      if (lastPointerRef.current) {
        const dt = now - lastPointerRef.current.time;
        const dist = Math.hypot(x - lastPointerRef.current.x, y - lastPointerRef.current.y);

        if (dt > 35 && dist > 14) {
          const palette = ambientPalette.length > 0 ? ambientPalette : DEFAULT_PALETTE;
          brushTrailRef.current.push({
            x,
            y,
            radius: 8 + Math.random() * 10,
            color: palette[Math.floor(Math.random() * palette.length)],
            alpha: 0.22,
            decay: 0.016
          });

          if (brushTrailRef.current.length > 25) {
            brushTrailRef.current.shift();
          }

          lastPointerRef.current = { x, y, time: now };
          ensureAnimating();
        }
      } else {
        lastPointerRef.current = { x, y, time: now };
      }
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

    // High-performance 60fps render loop with zero ctx.filter overhead
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw ambient floating watercolor blooms using fast radial gradients
      blobsRef.current.forEach((b) => {
        b.phase += b.speed;
        b.x = b.baseX + Math.sin(b.phase) * 35;
        b.y = b.baseY + Math.cos(b.phase * 0.8) * 30;

        const radGrad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        radGrad.addColorStop(0, b.color);
        radGrad.addColorStop(0.6, b.color);
        radGrad.addColorStop(1, 'transparent');

        ctx.save();
        ctx.globalAlpha = b.alpha;
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 2. Draw brush trails with fast soft gradients
      for (let i = brushTrailRef.current.length - 1; i >= 0; i--) {
        const p = brushTrailRef.current[i];
        p.alpha -= p.decay;
        p.radius += 0.2;

        if (p.alpha <= 0) {
          brushTrailRef.current.splice(i, 1);
          continue;
        }

        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        radGrad.addColorStop(0, p.color);
        radGrad.addColorStop(0.7, p.color);
        radGrad.addColorStop(1, 'transparent');

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Draw paint splashes with crisp & soft wet diffusion
      for (let i = dropletsRef.current.length - 1; i >= 0; i--) {
        const d = dropletsRef.current[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.93;
        d.vy *= 0.93;
        if (d.radius < d.maxRadius) {
          d.radius += d.growSpeed;
        }
        d.alpha -= d.decay;

        if (d.alpha <= 0) {
          dropletsRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = d.alpha;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fill();

        // Delicate ring outline
        ctx.strokeStyle = d.color;
        ctx.lineWidth = 0.75;
        ctx.stroke();
        ctx.restore();
      }

      // Keep animating if active particles exist or continue ambient floating
      const hasActiveParticles = dropletsRef.current.length > 0 || brushTrailRef.current.length > 0;
      if (hasActiveParticles || true) {
        animationId = requestAnimationFrame(render);
      } else {
        isAnimatingRef.current = false;
      }
    };

    isAnimatingRef.current = true;
    render();

    return () => {
      cancelAnimationFrame(animationId);
      isAnimatingRef.current = false;
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
