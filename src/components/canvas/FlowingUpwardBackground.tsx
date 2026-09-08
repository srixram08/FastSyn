"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  vy: number;
  vx: number;
  alpha: number;
  baseAlpha: number;
  color: string;
  wobbleSpeed: number;
  wobbleOffset: number;
}

const PURPLE_PALETTE = [
  "rgba(192, 132, 252, ", // Purple-400
  "rgba(217, 70, 239, ",  // Fuchsia-500
  "rgba(168, 85, 247, ",  // Purple-500
  "rgba(147, 51, 234, ",  // Purple-600
  "rgba(56, 189, 248, ",  // Sky-400 (Cyan chromatic touch)
  "rgba(244, 114, 182, ", // Pink-400
];

export const FlowingUpwardBackground: React.FC<{ className?: string }> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Generate upward-flowing particles
    const particleCount = Math.min(Math.floor((width * height) / 14000), 110);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.6 + 0.8,
        vy: -(Math.random() * 0.75 + 0.35), // Upward drift
        vx: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.2,
        color: PURPLE_PALETTE[Math.floor(Math.random() * PURPLE_PALETTE.length)],
        wobbleSpeed: Math.random() * 0.02 + 0.008,
        wobbleOffset: Math.random() * Math.PI * 2,
      });
    }

    // Vertical light streams (aurora pillars rising upwards)
    const streamCount = 5;
    const streams = Array.from({ length: streamCount }, (_, idx) => ({
      xRatio: 0.15 + (idx / streamCount) * 0.75 + (Math.random() - 0.5) * 0.08,
      width: Math.random() * 120 + 70,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.004,
      maxAlpha: Math.random() * 0.12 + 0.05,
    }));

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // 1. Render subtle upward-glowing vertical light streams
      for (const s of streams) {
        const sx = s.xRatio * width;
        const currentAlpha = s.maxAlpha * (0.6 + 0.4 * Math.sin(time * 1.5 + s.phase));

        const grad = ctx.createLinearGradient(sx, height, sx, 0);
        grad.addColorStop(0, "rgba(147, 51, 234, 0)");
        grad.addColorStop(0.3, `rgba(168, 85, 247, ${currentAlpha * 0.5})`);
        grad.addColorStop(0.7, `rgba(192, 132, 252, ${currentAlpha})`);
        grad.addColorStop(1, "rgba(217, 70, 239, 0)");

        ctx.fillStyle = grad;
        ctx.fillRect(sx - s.width / 2, 0, s.width, height);
      }

      // 2. Render upward-drifting glowing synaptic particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move upward
        p.y += p.vy;
        p.x += Math.sin(time * 2 + p.wobbleOffset) * 0.4 + p.vx;

        // Fade in when entering from bottom, fade out near top
        const progressFromBottom = (height - p.y) / height;
        let fade = 1.0;
        if (progressFromBottom < 0.1) {
          fade = progressFromBottom / 0.1;
        } else if (p.y < 120) {
          fade = Math.max(0, p.y / 120);
        }
        const currentAlpha = p.baseAlpha * fade;

        // Wrap around when particle floats above screen
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        // Draw particle with luminous glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.shadowColor = p.color.includes("56, 189, 248") ? "#38bdf8" : "#c084fc";
        ctx.shadowBlur = p.size * 3.5;
        ctx.fill();
      }

      // Reset shadow for performance
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.85 }}
    />
  );
};
