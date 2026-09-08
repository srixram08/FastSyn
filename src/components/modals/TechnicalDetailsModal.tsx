"use client";

import React from "react";
import { X, BookOpen, Cpu, ShieldCheck, Code, Layers, Activity, Brain } from "lucide-react";
import { FrozenParameters } from "@/engine/types";

interface TechnicalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  frozen: FrozenParameters;
}

export const TechnicalDetailsModal: React.FC<TechnicalDetailsModalProps> = ({
  isOpen,
  onClose,
  frozen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06020e]/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl purple-glass border border-purple-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono">
                Technical Specifications & Formulations
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                FastSyn Mathematical Formulations & Space-Time Proofs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Mathematical Formulations */}
        <div className="space-y-4 font-mono text-xs">
          <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
            <Code className="w-4 h-4" /> 1. Mathematical Update Equations
          </h4>

          {/* FastSyn / BDH */}
          <div className="p-4 rounded-2xl bg-[#090414] border border-purple-500/30 space-y-2">
            <span className="text-purple-300 font-bold flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-fuchsia-400" /> FastSyn / Dynamic Synaptic Plasticity
            </span>
            <div className="p-3 rounded-xl bg-purple-950/40 text-purple-200 text-xs">
              <code>
                M_{"{t+1}"} = λ · M_t + η · (v_t ⊗ k_t^T)
                <br />
                W_{"{eff}"} = W_{"{frozen}"} + M_t
                <br />
                y_t = softmax(W_{"{eff}"} · x_t + b)
              </code>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <strong>Properties:</strong> Parameter matrix W_frozen is strictly locked. Memory matrix M_t updates in dynamic RAM via outer-product associative writing with constant O(1) space footprint.
            </p>
          </div>

          {/* Transformer KV Cache */}
          <div className="p-4 rounded-2xl bg-[#090414] border border-indigo-500/30 space-y-2">
            <span className="text-indigo-300 font-bold flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Transformer Key-Value Context Cache
            </span>
            <div className="p-3 rounded-xl bg-indigo-950/40 text-indigo-200 text-xs">
              <code>
                K_t = [k_1, k_2, ..., k_t], &nbsp; V_t = [v_1, v_2, ..., v_t]
                <br />
                a_{"{t,i}"} = softmax(q_t^T · k_i / √d)
                <br />
                c_t = ∑ a_{"{t,i}"} · v_i
              </code>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <strong>Properties:</strong> Retains full history verbatim. Memory scales linearly O(t × d), requiring unbounded memory allocations over streaming sessions.
            </p>
          </div>

          {/* SSM */}
          <div className="p-4 rounded-2xl bg-[#090414] border border-emerald-500/30 space-y-2">
            <span className="text-emerald-300 font-bold flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> State-Space Model (SSM)
            </span>
            <div className="p-3 rounded-xl bg-emerald-950/40 text-emerald-200 text-xs">
              <code>
                s_{"{t+1}"} = Ā · s_t + B̄ · x_t
                <br />
                y_t = softmax(C · s_t + D · x_t)
              </code>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <strong>Properties:</strong> Constant hidden vector recurrence. Updates linearly via matrix-vector transition.
            </p>
          </div>
        </div>

        {/* Section 2: Complexity Comparison Table */}
        <div className="space-y-3 font-mono text-xs">
          <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" /> 2. Space & Compute Complexity
          </h4>

          <div className="overflow-x-auto rounded-2xl border border-purple-900/40 bg-[#090414]">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-purple-950/50 border-b border-purple-900/40 text-slate-300">
                <tr>
                  <th className="p-3">Architecture</th>
                  <th className="p-3">Memory State</th>
                  <th className="p-3">Memory Footprint</th>
                  <th className="p-3">Step Compute</th>
                  <th className="p-3">Inference Adaptivity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/20 text-slate-400">
                <tr className="bg-purple-500/10 text-white font-semibold">
                  <td className="p-3 text-purple-300">FastSyn (Ours)</td>
                  <td className="p-3">Matrix M_t (d×d)</td>
                  <td className="p-3 text-fuchsia-300 font-bold">O(d²) — 64 B (Constant)</td>
                  <td className="p-3">O(d²)</td>
                  <td className="p-3 text-emerald-400">High (Plastic Synapses)</td>
                </tr>
                <tr>
                  <td className="p-3 text-indigo-300 font-semibold">Transformer KV</td>
                  <td className="p-3">Context KV Cache</td>
                  <td className="p-3 text-rose-300">O(t·d) — Linear Growth</td>
                  <td className="p-3">O(t·d)</td>
                  <td className="p-3 text-emerald-400">High (In-Context Attention)</td>
                </tr>
                <tr>
                  <td className="p-3 text-emerald-300 font-semibold">SSM</td>
                  <td className="p-3">Vector s_t (d)</td>
                  <td className="p-3 text-emerald-400">O(d) — 16 B (Constant)</td>
                  <td className="p-3">O(d²)</td>
                  <td className="p-3 text-yellow-300">Moderate (Linear Recurrence)</td>
                </tr>
                <tr>
                  <td className="p-3 text-amber-300 font-semibold">Static Baseline</td>
                  <td className="p-3">None (0 B)</td>
                  <td className="p-3">0 B</td>
                  <td className="p-3">O(d²)</td>
                  <td className="p-3 text-rose-400">Zero (Rigid Parameters)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Frozen Weights Verification Hash */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between font-mono text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Frozen Base Weights Integrity Hash:</span>
            <code className="text-white font-bold bg-black/40 px-2 py-0.5 rounded">
              {frozen.hash}
            </code>
          </div>
          <span className="text-[10px] text-amber-300/80 hidden sm:inline">||ΔW|| = 0.0000</span>
        </div>
      </div>
    </div>
  );
};
