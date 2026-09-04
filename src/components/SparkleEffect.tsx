"use client";

import { useState, useCallback } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
}

const COLORS = ["#2563eb", "#60a5fa", "#f59e0b", "#10b981", "#f43f5e", "#a855f7"];

export default function SparkleEffect({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const triggerSparkle = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newSparkles: Sparkle[] = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x,
        y,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 4,
        angle: (Math.PI * 2 * i) / 8,
        distance: Math.random() * 40 + 20,
      }));

      setSparkles((prev) => [...prev, ...newSparkles]);

      setTimeout(() => {
        setSparkles((prev) =>
          prev.filter((s) => !newSparkles.find((ns) => ns.id === s.id))
        );
      }, 600);
    },
    []
  );

  return (
    <div
      className={`relative inline-block ${className}`}
      onClick={triggerSparkle}
      style={{ cursor: "default" }}
    >
      {children}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle pointer-events-none absolute"
          style={{
            left: s.x + Math.cos(s.angle) * s.distance - s.size / 2,
            top: s.y + Math.sin(s.angle) * s.distance - s.size / 2,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            backgroundColor: s.color,
          }}
        />
      ))}
    </div>
  );
}
