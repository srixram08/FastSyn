"use client";

import React from "react";
import { ArrowUpRight, Lock, RefreshCw, Layers, Cpu, Play, BarChart3, ShieldCheck, Activity } from "lucide-react";
import { LiquidChromeSculpture } from "@/components/canvas/LiquidChromeSculpture";
import { SimulationRun } from "@/engine/types";

interface HeroSectionProps {
  onOpenWorkspace: () => void;
  onOpenForensics: () => void;
  onOpenDocs: () => void;
  simulation: SimulationRun;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenWorkspace,
  onOpenForensics,
  onOpenDocs,
  simulation,
}) => {
  const fastAcc = simulation.mechanisms.fastweight.accuracy.toFixed(1);
  const staticAcc = simulation.mechanisms.static.accuracy.toFixed(1);
  const transAcc = simulation.mechanisms.transformer.accuracy.toFixed(1);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-16 space-y-16">
      {/* ========================================================================= */}
      {/* HERO SECTION (MATCHING REFERENCE PICTURE)                                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[580px]">
        {/* Left Column: Headline, Narrative & CTAs (7 Cols) */}
        <div className="lg:col-span-7 space-y-7 text-left z-10">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full purple-glass border border-purple-500/40 text-purple-300 text-xs font-mono shadow-lg">
            <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
            <span className="font-semibold tracking-wider">Fast Synaptic Plasticity • Zero Backprop</span>
          </div>

          {/* Main Headline with Editorial Italic Serif (Matching reference image typography) */}
          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.08]">
            Adapt At Inference Time. <br />
            <span className="font-serif-luxury italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-200 to-indigo-200">
              The Weights Stay Fixed.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-300 max-w-xl font-light leading-relaxed">
            FastSyn replaces rigid inference and unbounded context memory with constant{" "}
            <span className="text-purple-300 font-mono font-medium">O(1) dynamic synaptic plasticity</span>.
            Explore real-time Hebbian weight updates that adapt predictions without modifying learned base parameters.
          </p>

          {/* Call-to-Action Buttons (Matching reference image) */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenWorkspace}
              className="btn-purple-glow px-7 py-3.5 rounded-full font-semibold text-sm text-white flex items-center gap-3 cursor-pointer"
            >
              <span>Launch Workspace</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              </div>
            </button>

            <button
              onClick={onOpenForensics}
              className="purple-glass px-6 py-3.5 rounded-full font-mono text-xs text-purple-200 hover:text-white border border-purple-500/30 hover:border-purple-400 transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
              <span>Inspect Memory Forensics</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono text-slate-400 border-t border-purple-900/40">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Learned Parameters: <strong>Strictly Frozen</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Memory Complexity: <strong>Constant 64 Bytes</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Liquid Chrome Sculpture (5 Cols) */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          <LiquidChromeSculpture />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SOCIAL PROOF & MODEL COMPARISON GRID (MATCHING REFERENCE PICTURE)         */}
      {/* ========================================================================= */}
      <div className="space-y-6 text-center pt-8 border-t border-purple-900/30">
        <div className="inline-block">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300">
            Architectural Benchmark
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-3">
            Inference Adaptation Across <span className="font-serif-luxury italic font-normal text-purple-300">Architectures.</span>
          </h2>
        </div>

        {/* 4 Architecture Badges (Matching reference client grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-4">
          {/* Static Baseline */}
          <div className="purple-glass p-5 rounded-2xl border border-purple-900/40 text-left space-y-2 group hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase">Static Weights</span>
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">{staticAcc}%</div>
            <p className="text-[11px] font-mono text-slate-400">
              0 Bytes RAM State. Fails when environment shifts.
            </p>
          </div>

          {/* Transformer KV Cache */}
          <div className="purple-glass p-5 rounded-2xl border border-purple-900/40 text-left space-y-2 group hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase">Transformer KV</span>
              <Layers className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-bold text-white">{transAcc}%</div>
            <p className="text-[11px] font-mono text-slate-400">
              Unbounded O(t) growing key-value context buffer.
            </p>
          </div>

          {/* SSM Hidden Vector */}
          <div className="purple-glass p-5 rounded-2xl border border-purple-900/40 text-left space-y-2 group hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase">SSM Recurrent</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {simulation.mechanisms.ssm.accuracy.toFixed(1)}%
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Constant 16-byte hidden vector recurrence.
            </p>
          </div>

          {/* FastSyn Plasticity */}
          <div className="purple-glass-accent p-5 rounded-2xl border border-purple-400/50 text-left space-y-2 shadow-glow-purple">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-200 uppercase font-bold">FastSyn (Ours)</span>
              <RefreshCw className="w-4 h-4 text-fuchsia-300 animate-spin" style={{ animationDuration: "12s" }} />
            </div>
            <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-fuchsia-200">
              {fastAcc}%
            </div>
            <p className="text-[11px] font-mono text-purple-200/80">
              Constant 64-byte plastic matrix. Zero backpropagation.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3 CORE PILLARS (MATCHING REFERENCE "CREATIVE THAT CONVERTS" SECTION)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="purple-glass-card p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Weights Stay Fixed.</h3>
          <p className="text-xs font-mono text-slate-400 leading-relaxed">
            Offline parameters W are strictly frozen at test time. Zero weight updates and zero gradient backpropagation during streaming inference.
          </p>
        </div>

        <div className="purple-glass-card p-6 rounded-3xl space-y-3 border-purple-500/40">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-200">
            <RefreshCw className="w-5 h-5 text-fuchsia-300" />
          </div>
          <h3 className="text-xl font-bold text-white">Memory Adapts in RAM.</h3>
          <p className="text-xs font-mono text-slate-400 leading-relaxed">
            Outer-product Hebbian updates write associative synaptic traces into dynamic RAM state with constant O(1) memory footprint.
          </p>
        </div>

        <div className="purple-glass-card p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <BarChart3 className="w-5 h-5 text-indigo-300" />
          </div>
          <h3 className="text-xl font-bold text-white">Results You Can Measure.</h3>
          <p className="text-xs font-mono text-slate-400 leading-relaxed">
            When environmental distributions shift, FastSyn rapidly recovers decision accuracy while static models collapse.
          </p>
        </div>
      </div>
    </section>
  );
};
