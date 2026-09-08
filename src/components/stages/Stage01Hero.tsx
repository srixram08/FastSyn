"use client";

import React, { useState } from "react";
import { Lock, RefreshCw, ArrowRight, Play, Cpu, Sparkles, Box } from "lucide-react";
import { Synaptic3DLab } from "@/components/canvas/Synaptic3DLab";
import { ModelId } from "@/engine/types";

interface Stage01HeroProps {
  onStartExperiment: () => void;
  onStartDemo: () => void;
}

export const Stage01Hero: React.FC<Stage01HeroProps> = ({
  onStartExperiment,
  onStartDemo,
}) => {
  const [selected3DModel, setSelected3DModel] = useState<ModelId>("bdh_fast_weight");

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-10 max-w-6xl mx-auto overflow-hidden">
      {/* Top Scientific Badge */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full liquid-glass border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-8 shadow-glow-cyan">
        <Cpu className="w-4 h-4 text-cyan-400" />
        <span className="font-semibold tracking-wider">FASTSYN 3D RESEARCH LABORATORY</span>
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
      </div>

      {/* Main Punchy Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl leading-tight">
        Can an AI adapt without changing its{" "}
        <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent underline decoration-cyan-500/40 decoration-wavy decoration-2">
          weights?
        </span>
      </h1>

      {/* Subheading */}
      <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mb-10 font-light leading-relaxed">
        Explore how inference-time dynamic memory updates in RAM while learned parameters remain 100% frozen. Zero backpropagation during live test stream.
      </p>

      {/* Interactive 3D Synaptic Lab Viewport */}
      <div className="w-full max-w-4xl mb-12">
        <Synaptic3DLab
          currentModelId={selected3DModel}
          onModelSelect={(id) => setSelected3DModel(id)}
        />
      </div>

      {/* 3 Core Conceptual Pillars - Liquid Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
        {/* Pillar 1: Weights */}
        <div className="liquid-glass-card p-6 rounded-2xl border-amber-500/30 flex flex-col items-center text-center group relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/10">
            <Lock className="w-7 h-7" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">
            Model Parameters
          </span>
          <h3 className="text-xl font-bold text-white mb-1">WEIGHTS</h3>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-semibold mt-2 border border-amber-500/30">
            <span>🔒 FROZEN W</span>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-mono">
            Trained offline. Zero backprop at inference time.
          </p>
        </div>

        {/* Pillar 2: Memory */}
        <div className="liquid-glass-accent p-6 rounded-2xl flex flex-col items-center text-center group relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center mb-4 text-cyan-300 group-hover:scale-110 transition-transform shadow-glow-cyan">
            <RefreshCw className="w-7 h-7 animate-spin" style={{ animationDuration: "14s" }} />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-300/90 mb-1">
            Inference-Time State
          </span>
          <h3 className="text-xl font-bold text-white mb-1">MEMORY</h3>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/25 text-cyan-200 font-mono text-xs font-semibold mt-2 border border-cyan-500/40 shadow-glow-cyan">
            <span>↻ ADAPTIVE S</span>
          </div>
          <p className="text-xs text-slate-300 mt-3 font-mono">
            Fast synaptic updates in RAM. Continuous stream response.
          </p>
        </div>

        {/* Pillar 3: Prediction */}
        <div className="liquid-glass-card p-6 rounded-2xl border-emerald-500/30 flex flex-col items-center text-center group relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/10">
            <ArrowRight className="w-7 h-7" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">
            Behavioral Output
          </span>
          <h3 className="text-xl font-bold text-white mb-1">PREDICTION</h3>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-semibold mt-2 border border-emerald-500/30">
            <span>→ ADAPTS Y</span>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-mono">
            New decisions emerge dynamically without altering learned weights.
          </p>
        </div>
      </div>

      {/* CTA Buttons with Liquid Glass Aesthetics */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <button
          onClick={onStartExperiment}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-base tracking-wide flex items-center gap-3 shadow-glow-cyan transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>Enter Live Laboratory</span>
        </button>

        <button
          onClick={onStartDemo}
          className="px-6 py-4 rounded-xl liquid-glass border border-cyan-500/30 hover:border-cyan-400 text-slate-200 hover:text-white font-mono text-sm flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Launch 60s Guided Tour</span>
        </button>
      </div>

      {/* Secondary Tagline */}
      <div className="inline-flex items-center gap-2 text-slate-400 text-xs sm:text-sm font-mono tracking-wider">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-glow-emerald"></span>
        <span>The weights stay fixed. The memory adapts.</span>
      </div>
    </section>
  );
};
