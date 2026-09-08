"use client";

import React from "react";
import { Cpu, ArrowRight, Check, AlertCircle, Sparkles, Database, GitFork } from "lucide-react";

interface Stage09BDHProps {
  onProceedToLimitation: () => void;
}

export const Stage09BDH: React.FC<Stage09BDHProps> = ({
  onProceedToLimitation,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
          Stage 08 • Architectural Context
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
          Why This Matters for BDH & DataForge
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto mt-2 text-sm leading-relaxed">
          FastSyn uses a simplified interactive laboratory to demonstrate the foundational concept of dynamic inference-time memory: how a persistent learned substrate interacts with changing internal state.
        </p>
      </div>

      {/* Mandatory Correspondence vs Difference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Correspondence */}
        <div className="glass-panel-glow p-6 sm:p-7 rounded-2xl border-cyan-500/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-3 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Exact Conceptual Correspondence</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">CORRESPONDENCE</h3>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/60 text-xs sm:text-sm font-mono text-cyan-200 leading-relaxed mb-4">
              “FastSyn makes the idea of dynamic inference-time memory experimentally visible: internal state can change as a sequence is processed while learned parameters remain fixed.”
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Frozen Learned Substrate:</strong> Long-term parameters W are trained offline and never mutate at test time.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Fast Synaptic Plasticity:</strong> Stream-driven outer-product updates occur directly in inference-time state.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Zero Backpropagation:</strong> Real-time streaming adaptation without computational gradient loops.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] font-mono text-cyan-400">
            ✓ Validated pedagogical analog
          </div>
        </div>

        {/* Card 2: Difference */}
        <div className="glass-panel p-6 sm:p-7 rounded-2xl border-amber-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-3 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              <span>Pedagogical Boundary</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">DIFFERENCE</h3>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-900/60 text-xs sm:text-sm font-mono text-amber-200 leading-relaxed mb-4">
              “FastSyn is an educational abstraction designed to isolate and visualize memory adaptation. It is not a complete reproduction of every component or training detail of BDH.”
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                <span><strong>Dimension & Scope:</strong> FastSyn operates in a 4-dimensional educational toy space rather than multi-billion parameter production scale.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                <span><strong>Gating & Hebbian Formulations:</strong> BDH utilizes sophisticated learned gating and decay schedules beyond single-matrix outer products.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                <span><strong>Scientific Honesty:</strong> FastSyn claims zero universal superiority—it isolates a single cognitive mechanism for learner discovery.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] font-mono text-amber-300">
            ⚠ Scientific rigor requirement
          </div>
        </div>
      </div>

      {/* Modern AI Architecture Spectrum */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800">
        <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4">
          The Memory Spectrum in Modern AI
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-amber-400 font-bold block mb-1">Static MLP / CNN</span>
            <p className="text-slate-400 text-[11px] mb-2">Memory footprint: 0 bytes</p>
            <span className="text-slate-300 text-[11px]">Relies completely on weights. Zero test-time adaptation.</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-blue-400 font-bold block mb-1">Transformers</span>
            <p className="text-slate-400 text-[11px] mb-2">Memory footprint: O(N) cache</p>
            <span className="text-slate-300 text-[11px]">Linear context growth. Retains raw token history.</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1">State-Space Models</span>
            <p className="text-slate-400 text-[11px] mb-2">Memory footprint: O(d) vector</p>
            <span className="text-slate-300 text-[11px]">Continuous linear recurrence. Constant-size hidden state.</span>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
            <span className="text-cyan-300 font-bold block mb-1">FastSyn / BDH</span>
            <p className="text-cyan-400 text-[11px] mb-2">Memory footprint: O(d²) matrix</p>
            <span className="text-cyan-200 text-[11px]">Associative synaptic plasticity. Rapid localized rewriting.</span>
          </div>
        </div>
      </div>

      {/* Proceed */}
      <div className="flex justify-center">
        <button
          onClick={onProceedToLimitation}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold font-mono text-sm tracking-wide flex items-center gap-2 shadow-glow-cyan transition-all"
        >
          <span>Investigate the Danger Zone (Limitations)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
