"use client";

import React from "react";
import { Lock, RefreshCw, ArrowDown, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { FrozenParameters } from "@/engine/types";

interface Stage05AhaMomentProps {
  frozen: FrozenParameters;
  onProceedToCompare: () => void;
  onReturnToLab: () => void;
}

export const Stage05AhaMoment: React.FC<Stage05AhaMomentProps> = ({
  frozen,
  onProceedToCompare,
  onReturnToLab,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
      {/* Alert Header */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-mono mb-4">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span>CRITICAL OBSERVATION POINT • t = 15</span>
      </div>

      <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
        The Environment Changed. <br />
        <span className="bg-gradient-to-r from-cyan-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
          Watch What Happened Inside.
        </span>
      </h2>

      {/* Before / After comparison tokens */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-8 max-w-xl mx-auto">
        <div className="glass-panel p-4 rounded-xl border-blue-500/30 w-full sm:w-1/2 text-left">
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block mb-1">
            Before Shift (t &lt; 15)
          </span>
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-blue-300 mb-1">
            {["A", "A", "A", "B", "B"].map((tok, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800">
                {tok}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Standard regime (matches W_frozen)
          </span>
        </div>

        <div className="text-amber-400 font-mono font-bold text-xl sm:text-2xl animate-pulse">
          ➔
        </div>

        <div className="glass-panel p-4 rounded-xl border-rose-500/30 w-full sm:w-1/2 text-left">
          <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block mb-1">
            After Shift (t ≥ 15)
          </span>
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-rose-300 mb-1">
            {["C", "C", "B", "C", "D"].map((tok, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800">
                {tok}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Novel patterns (C & D appear)
          </span>
        </div>
      </div>

      {/* The 3-Step Cascade Architecture */}
      <div className="max-w-md mx-auto space-y-3 mb-10 text-left font-mono">
        {/* Step 1: Learned Parameters */}
        <div className="glass-panel p-4 rounded-2xl border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                LEARNED PARAMETERS
              </span>
              <span className="text-sm font-bold text-white">🔒 UNCHANGED</span>
            </div>
          </div>
          <span className="text-xs text-amber-300/80 px-2 py-1 rounded bg-amber-950/60 border border-amber-800/40">
            ΔW = 0.00
          </span>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center text-cyan-400">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Step 2: Inference Memory */}
        <div className="glass-panel-glow p-4 rounded-2xl border-cyan-500/50 flex items-center justify-between shadow-glow-cyan">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300">
              <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: "6s" }} />
            </div>
            <div>
              <span className="text-[10px] text-cyan-300 uppercase tracking-wider block">
                INFERENCE MEMORY (M_t)
              </span>
              <span className="text-sm font-bold text-cyan-200">↻ UPDATING IN RAM</span>
            </div>
          </div>
          <span className="text-xs text-cyan-300 px-2 py-1 rounded bg-cyan-950 border border-cyan-700">
            ΔM &gt; 0
          </span>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center text-emerald-400">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Step 3: Prediction */}
        <div className="glass-panel p-4 rounded-2xl border-emerald-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                PREDICTION
              </span>
              <span className="text-sm font-bold text-emerald-300">↻ ADAPTING ACCURATELY</span>
            </div>
          </div>
          <span className="text-xs text-emerald-300 px-2 py-1 rounded bg-emerald-950/60 border border-emerald-800/40">
            Correct ✓
          </span>
        </div>
      </div>

      {/* The Central AHA Payoff Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-lab-900 to-cyan-950/60 border border-cyan-500/40 max-w-2xl mx-auto mb-10 shadow-glow-cyan">
        <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
          The Core Computational Discovery
        </p>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          “The weights stayed the same. <br />
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-300 bg-clip-text text-transparent">
            The memory changed.”
          </span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed font-mono">
          No training cycles. No gradient descent. No backpropagation. FastSyn adapts directly to continuous streaming reality through inference-time synaptic plasticity.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onReturnToLab}
          className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs transition-all"
        >
          ← Return to Interactive Lab
        </button>
        <button
          onClick={onProceedToCompare}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold font-mono text-sm tracking-wide flex items-center gap-2 shadow-glow-cyan transition-all"
        >
          <span>Compare Ground Truth & Inspect Results</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
