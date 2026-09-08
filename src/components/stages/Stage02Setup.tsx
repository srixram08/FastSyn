"use client";

import React from "react";
import { Lock, Globe, RefreshCw, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { FrozenParameters } from "@/engine/types";

interface Stage02SetupProps {
  frozen: FrozenParameters;
  onProceed: () => void;
}

export const Stage02Setup: React.FC<Stage02SetupProps> = ({ frozen, onProceed }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
          Stage 01 • Experimental Setup
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
          The Anatomy of Inference-Time Adaptation
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto mt-2 text-sm sm:text-base">
          Before observing the experiment, understand the three fundamental components interacting in the laboratory.
        </p>

        {/* Mandatory Frozen Badge */}
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
          <Lock className="w-4 h-4 text-amber-400" />
          <span className="font-bold">MODEL FROZEN</span>
          <span className="text-slate-400">•</span>
          <span>Parameters unchanged</span>
          <span className="text-slate-400">•</span>
          <span>No backpropagation</span>
        </div>
      </div>

      {/* Three Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Card 1: Model Parameters */}
        <div className="glass-panel p-6 rounded-2xl border-amber-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                FROZEN
              </span>
              <span className="text-[11px] font-mono text-slate-400">Offline Weights</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">MODEL PARAMETERS</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Fixed weights learned during prior training. In this laboratory, these values are mathematically immutable.
            </p>

            {/* Frozen Weights Matrix Readout */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] space-y-1">
              <div className="text-slate-400 text-[10px] flex justify-between">
                <span>W_frozen (4×4 substrate):</span>
                <span className="text-amber-400 text-[9px] truncate max-w-[110px]">{frozen.hash.slice(0, 16)}</span>
              </div>
              {frozen.weights.slice(0, 3).map((row, i) => (
                <div key={i} className="text-amber-200/90 flex gap-2">
                  <span>[{row.map((v) => v.toFixed(2)).join(", ")}]</span>
                </div>
              ))}
              <div className="text-slate-500 text-[10px] mt-1 pt-1 border-t border-slate-800/80">
                ΔW = 0.000 (Guaranteed zero updates)
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Never modified at test time</span>
          </div>
        </div>

        {/* Card 2: Input Stream */}
        <div className="glass-panel p-6 rounded-2xl border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 font-semibold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                CHANGING
              </span>
              <span className="text-[11px] font-mono text-slate-400">Environment</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">INPUT STREAM</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Sequential tokens arriving from the outside world. At midpoint, the environmental distribution abruptly shifts.
            </p>

            {/* Sequence Stream Visualizer */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] space-y-2">
              <div className="text-slate-400 text-[10px]">Sample Stream Sequence:</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {["A", "A", "A", "B", "B"].map((tok, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-xs">
                    {tok}
                  </span>
                ))}
                <span className="text-amber-400 text-xs font-bold animate-pulse">→ SHIFT →</span>
                {["C", "C", "D", "C"].map((tok, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-xs">
                    {tok}
                  </span>
                ))}
              </div>
              <div className="text-slate-500 text-[10px] mt-1 pt-1 border-t border-slate-800/80">
                Seeded deterministic generator
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <Zap className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span>Controlled by shift parameter δ</span>
          </div>
        </div>

        {/* Card 3: Internal Memory */}
        <div className="glass-panel-glow p-6 rounded-2xl border-cyan-500/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-semibold flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                DYNAMIC
              </span>
              <span className="text-[11px] font-mono text-cyan-400/80">FastSyn State</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">INTERNAL MEMORY</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Inference-time state ($M_t$, hidden vector, or KV cache). This is the key element you will watch adapt step-by-step.
            </p>

            {/* Dynamic Memory Preview */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-900/50 font-mono text-[11px] space-y-2">
              <div className="text-cyan-300/80 text-[10px] flex justify-between">
                <span>FastSyn Synaptic Matrix M_t:</span>
                <span className="text-emerald-400 text-[9px]">RAM State</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                <span className="p-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">0.24</span>
                <span className="p-1 rounded bg-cyan-950/40 text-cyan-400">0.05</span>
                <span className="p-1 rounded bg-cyan-950/20 text-slate-500">0.00</span>
                <span className="p-1 rounded bg-cyan-950/20 text-slate-500">0.00</span>
                <span className="p-1 rounded bg-cyan-950/30 text-cyan-400">0.11</span>
                <span className="p-1 rounded bg-cyan-950/80 text-cyan-200 border border-cyan-600/50 font-bold">0.82</span>
                <span className="p-1 rounded bg-cyan-950/40 text-cyan-400">0.18</span>
                <span className="p-1 rounded bg-cyan-950/20 text-slate-500">0.00</span>
              </div>
              <div className="text-cyan-400/80 text-[10px] mt-1 pt-1 border-t border-slate-800/80">
                M_{"{t+1}"} = λ·M_t + η·(k_t ⊗ v_t)
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-[11px] font-mono text-cyan-400">
            <RefreshCw className="w-3.5 h-3.5 flex-shrink-0 animate-spin" style={{ animationDuration: "8s" }} />
            <span>Updates dynamically per timestep</span>
          </div>
        </div>
      </div>

      {/* Scientific Distinction Table Banner */}
      <div className="glass-panel p-5 rounded-xl border-slate-800 mb-8 bg-slate-900/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Phase 01: Training
            </span>
            <span className="text-sm font-semibold text-amber-300">
              Weights (W) Change via Backpropagation
            </span>
          </div>
          <div className="p-2 border-y md:border-y-0 md:border-x border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Phase 02: Inference Setup
            </span>
            <span className="text-sm font-semibold text-white">
              Weights (W) are FROZEN Permanently
            </span>
          </div>
          <div className="p-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Phase 03: Inference Stream
            </span>
            <span className="text-sm font-semibold text-cyan-300">
              Dynamic State (M_t) Adapts in Real-Time
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={onProceed}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm font-mono flex items-center gap-2.5 shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
        >
          <span>Commit Your Hypothesis (Predict)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
