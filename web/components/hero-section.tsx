"use client";

import { useEffect, useRef } from "react";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217, 119, 6, ${p.alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(217, 119, 6, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#070b14]/70 via-[#070b14]/30 to-[#070b14]" />

      <div className="relative z-[2] mx-auto max-w-5xl px-4 pt-24 text-center sm:px-6">
        <div className="animate-fade-in-up mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-xs font-semibold tracking-widest text-amber-400 uppercase">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
          Multi-Agent AI System
        </div>

        <h1 className="animate-fade-in-up stagger-1 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Your{" "}
          <span className="text-gradient">Perfect Trip</span>
          <br />
          Engineered by AI
        </h1>

        <p className="animate-fade-in-up stagger-2 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          Four specialized agents work in concert — searching flights, securing
          hotels, crafting your itinerary, and delivering a complete, polished
          travel plan. All in seconds.
        </p>

        <div className="animate-fade-in-up stagger-3 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#planner"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-3.5 text-base font-bold text-white shadow-2xl shadow-amber-500/25 transition-all hover:shadow-amber-500/40"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Plan Your Adventure
          </a>
          <a
            href="#pipeline"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/30 px-8 py-3.5 text-base font-semibold text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-800/50 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            See How It Works
          </a>
        </div>

        <div className="animate-fade-in-up stagger-4 mt-16 flex items-center justify-center gap-8 sm:gap-12">
          {[
            ["🤖", "4 Agents"],
            ["⚡", "~15s Response"],
            ["🌍", "Global Coverage"],
          ].map(([emoji, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl">{emoji}</div>
              <div className="mt-1 text-xs font-medium text-zinc-500">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
