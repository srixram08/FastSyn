"use client";

import React, { useEffect, useRef } from "react";

export const LiquidBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Subtle drifting neural floating particles
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      baseAlpha: Math.random() * 0.35 + 0.1,
      color: Math.random() > 0.6 ? "#06b6d4" : Math.random() > 0.3 ? "#8b5cf6" : "#10b981",
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let t = 0;
    const render = () => {
      t += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Render connected synaptic links when close
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / 130) * 0.12;
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Render & update particles
      particles.forEach((p) => {
        // Slight organic wave
        p.x += p.vx + Math.sin(t + p.y * 0.01) * 0.15;
        p.y += p.vy + Math.cos(t + p.x * 0.01) * 0.15;

        // Mouse subtle repulsion/attraction
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) {
          p.x -= (dx / d) * 0.4;
          p.y -= (dy / d) * 0.4;
        }

        // Screen wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.baseAlpha + Math.sin(t * 2 + p.x) * 0.1;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Liquid Organic Gradient Orbs */}
      <div 
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-500/20 via-sky-600/10 to-transparent blur-[120px] animate-orb-1" 
      />
      <div 
        className="absolute top-1/3 -right-48 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-violet-600/20 via-purple-700/10 to-transparent blur-[140px] animate-orb-2" 
      />
      <div 
        className="absolute -bottom-48 left-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-700/10 to-transparent blur-[130px] animate-orb-3" 
      />
      <div 
        className="absolute top-2/3 right-1/4 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-transparent blur-[100px] animate-orb-1" 
      />

      {/* Cybernetic High-Tech Grid with Fade */}
      <div className="absolute inset-0 bg-lab-grid opacity-70" />

      {/* Interactive Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Radial Vignette Mask for crystal contrast and focus */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, transparent 20%, rgba(4, 6, 10, 0.65) 75%, rgba(4, 6, 10, 0.95) 100%)"
        }}
      />
    </div>
  );
};
