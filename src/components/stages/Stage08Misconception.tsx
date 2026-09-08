"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, AlertCircle } from "lucide-react";

interface Stage08MisconceptionProps {
  onProceedToBDH: () => void;
}

export const Stage08Misconception: React.FC<Stage08MisconceptionProps> = ({
  onProceedToBDH,
}) => {
  const [q1Answer, setQ1Answer] = useState<boolean | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const q1Correct = q1Answer === false;
  const q2Correct = q2Answer === "inference_state";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
          Stage 07 • Misconception Test
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
          Deconstruct Preconceptions
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mt-2 text-sm">
          Test your understanding against the most common misconceptions in modern sequence modeling.
        </p>
      </div>

      {/* Quiz Item 1: True / False */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <HelpCircle className="w-4 h-4" />
          <span>SCENARIO 01 • WEIGHTS VS BEHAVIOR</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white">
          “A model’s weights did not change, so its behavior cannot change.”
        </h3>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={() => setQ1Answer(true)}
            className={`flex-1 py-3 rounded-xl font-mono text-sm font-bold border transition-all ${
              q1Answer === true
                ? "bg-rose-950/60 border-rose-500 text-rose-300"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            True
          </button>
          <button
            onClick={() => setQ1Answer(false)}
            className={`flex-1 py-3 rounded-xl font-mono text-sm font-bold border transition-all ${
              q1Answer === false
                ? "bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-glow-emerald"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            False (Correct)
          </button>
        </div>

        {/* Explanation Banner */}
        {q1Answer !== null && (
          <div
            className={`p-4 rounded-xl border text-xs font-mono leading-relaxed transition-all ${
              q1Correct
                ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                : "bg-rose-950/40 border-rose-500/50 text-rose-200"
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              {q1Correct ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
              <span>{q1Correct ? "Exactly Right!" : "Misconception Detected!"}</span>
            </div>
            Learned parameters (<code className="text-amber-300">W_frozen</code>) can remain completely fixed while inference-time state (<code className="text-cyan-300">M_t</code>, KV cache, or hidden vectors) changes the model’s effective input-output mapping on subsequent tokens.
          </div>
        )}
      </div>

      {/* Quiz Item 2: Scenario Identification */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <HelpCircle className="w-4 h-4" />
          <span>SCENARIO 02 • CAUSAL MECHANISM</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white">
          “A streaming AI system encounters a new pattern. Its learned parameters remain unchanged, but its internal state updates and its predictions change. What changed?”
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
          {[
            { id: "model_weights", label: "Model weights" },
            { id: "training_data", label: "Training dataset" },
            { id: "inference_state", label: "Inference-time state" },
            { id: "hyperparameters", label: "Offline hyperparameters" },
          ].map((opt) => {
            const isSelected = q2Answer === opt.id;
            const isCorrectOption = opt.id === "inference_state";

            return (
              <button
                key={opt.id}
                onClick={() => setQ2Answer(opt.id)}
                className={`p-3.5 rounded-xl border text-left font-semibold transition-all ${
                  isSelected
                    ? isCorrectOption
                      ? "bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-glow-emerald"
                      : "bg-rose-950/60 border-rose-500 text-rose-200"
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {q2Answer !== null && (
          <div
            className={`p-4 rounded-xl border text-xs font-mono leading-relaxed transition-all ${
              q2Correct
                ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                : "bg-rose-950/40 border-rose-500/50 text-rose-200"
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              {q2Correct ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
              <span>{q2Correct ? "Precise!" : "Not Quite."}</span>
            </div>
            <strong>Inference-time state</strong> changed. The training dataset and learned model parameters were not touched. The streaming adaptation is entirely driven by test-time dynamic memory.
          </div>
        )}
      </div>

      {/* Proceed */}
      <div className="flex justify-center">
        <button
          onClick={onProceedToBDH}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold font-mono text-sm tracking-wide flex items-center gap-2 shadow-glow-cyan transition-all"
        >
          <span>Explore BDH & DataForge Connection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
