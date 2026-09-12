"use client";

import { useRef, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProfileImage from "@/components/ProfileImage";

const GRID_SIZE = 24;
const REACT_RADIUS = 120;
const SPRING_STIFFNESS = 0.04;
const DAMPING = 0.92;

interface Dot {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function InteractiveHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const dotsRef = useRef<Dot[]>([]);
  const animRef = useRef<number>(0);
  const { theme } = useTheme();

  const initDots = useCallback(
    (width: number, height: number) => {
      // Grid lives in CSS-pixel space (the drawing context is DPR-scaled).
      const cols = Math.ceil(width / GRID_SIZE);
      const rows = Math.ceil(height / GRID_SIZE);
      const offsetX = (width - cols * GRID_SIZE) / 2;
      const offsetY = (height - rows * GRID_SIZE) / 2;

      dotsRef.current = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const baseX = offsetX + c * GRID_SIZE + GRID_SIZE / 2;
          const baseY = offsetY + r * GRID_SIZE + GRID_SIZE / 2;
          dotsRef.current.push({
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            vx: 0,
            vy: 0,
          });
        }
      }
    },
    []
  );

  // Keep a ref to the theme so the animation loop reads it without restarting
  const themeRef = useRef(theme);
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      // setTransform (not scale) so repeated resizes don't compound the DPR scale
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initDots(rect.width, rect.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      const isDark = themeRef.current === "dark";
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const dot of dotsRef.current) {
        const dx = mx - dot.x;
        const dy = my - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REACT_RADIUS) {
          const force = (1 - dist / REACT_RADIUS) * 8;
          dot.vx += (dx / dist) * force * SPRING_STIFFNESS;
          dot.vy += (dy / dist) * force * SPRING_STIFFNESS;
        }

        // Spring back to base
        dot.vx += (dot.baseX - dot.x) * SPRING_STIFFNESS;
        dot.vy += (dot.baseY - dot.y) * SPRING_STIFFNESS;
        dot.vx *= DAMPING;
        dot.vy *= DAMPING;
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Distance from mouse for color/size
        const dMouse = Math.sqrt(
          (dot.baseX - mx) ** 2 + (dot.baseY - my) ** 2
        );
        const proximity = Math.max(0, 1 - dMouse / REACT_RADIUS);
        const radius = 1.5 + proximity * 2;

        // Rainbow color based on proximity
        const alpha = 0.15 + proximity * 0.5;
        let color: string;

        if (proximity > 0.1) {
          const hue = ((dot.baseX + dot.baseY) / 4 + proximity * 60) % 360;
          color = `hsla(${hue}, 80%, 60%, ${alpha})`;
        } else {
          color = isDark
            ? `rgba(148, 163, 184, ${alpha})`
            : `rgba(100, 116, 139, ${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Draw subtle connections to nearby dots
        if (proximity > 0.3) {
          for (const other of dotsRef.current) {
            if (other === dot) continue;
            const d = Math.sqrt(
              (dot.x - other.x) ** 2 + (dot.y - other.y) ** 2
            );
            if (d < GRID_SIZE * 1.5) {
              ctx.beginPath();
              ctx.moveTo(dot.x, dot.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = isDark
                ? `rgba(96, 165, 250, ${proximity * 0.1})`
                : `rgba(37, 99, 235, ${proximity * 0.08})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [initDots]);

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="pointer-events-auto absolute inset-0 h-full w-full"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm font-medium uppercase tracking-widest text-primary"
        >
          Hello, I&apos;m
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl"
        >
          Carlson Kingoina
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-5 max-w-xl text-base leading-relaxed text-text-muted sm:mt-6 sm:text-lg"
        >
          A developer and creator building things for the web. I love working
          with modern tools, open source, and turning ideas into products.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:gap-4"
        >
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
          >
            View Projects <ArrowRight size={16} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium transition-all hover:bg-surface-alt hover:border-primary/30 active:scale-[0.98]"
          >
            Get in Touch
          </Link>
        </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="order-first mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-surface bg-surface-alt shadow-xl shadow-primary/25 ring-2 ring-primary/30 sm:h-44 sm:w-44 lg:order-last lg:mx-0 lg:h-64 lg:w-64"
          >
            <ProfileImage />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
