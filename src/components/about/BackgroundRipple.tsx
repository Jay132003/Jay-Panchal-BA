import { useRef, useEffect } from 'react';

const CELL = 36;
const RIPPLE_DUR = 1400;
const CELL_DELAY = 54;

interface Ripple { cx: number; cy: number; t0: number }

export function BackgroundRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef(0);
  const lastCellRef = useRef({ cx: -99, cy: -99 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.classList.contains('dark');
      const cols = Math.ceil(canvas.width / CELL);
      const rows = Math.ceil(canvas.height / CELL);

      ripplesRef.current = ripplesRef.current.filter(
        r => now - r.t0 < RIPPLE_DUR + 22 * CELL_DELAY
      );

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          let glow = 0;
          for (const ripple of ripplesRef.current) {
            const dist = Math.hypot(c - ripple.cx, r - ripple.cy);
            const localAge = now - ripple.t0 - dist * CELL_DELAY;
            if (localAge < 0 || localAge > RIPPLE_DUR) continue;
            const t = localAge / RIPPLE_DUR;
            const pulse = Math.sin(t * Math.PI);
            if (pulse > glow) glow = pulse;
          }
          const opacity = 0.025 + glow * 0.17;
          ctx.fillStyle = isDark
            ? `rgba(125,170,240,${opacity.toFixed(3)})`
            : `rgba(60,100,200,${opacity.toFixed(3)})`;
          ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Ambient ripples
  useEffect(() => {
    const push = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      ripplesRef.current.push({
        cx: Math.floor(Math.random() * Math.ceil(canvas.width / CELL)),
        cy: Math.floor(Math.random() * Math.ceil(canvas.height / CELL)),
        t0: performance.now(),
      });
    };
    push();
    const id = setInterval(push, 1700);
    return () => clearInterval(id);
  }, []);

  // Global mouse tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = Math.floor(e.clientX / CELL);
      const cy = Math.floor(e.clientY / CELL);
      if (cx === lastCellRef.current.cx && cy === lastCellRef.current.cy) return;
      lastCellRef.current = { cx, cy };
      ripplesRef.current.push({ cx, cy, t0: performance.now() });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return <canvas ref={canvasRef} className="ab-ripple-canvas" aria-hidden="true" />;
}
