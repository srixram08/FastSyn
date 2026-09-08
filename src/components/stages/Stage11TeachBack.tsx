"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, ArrowRight, Sparkles, Feather } from "lucide-react";
import { evaluateTeachBack } from "@/engine/rubric";

interface Stage11TeachBackProps {
  onProceedToFinale: () => void;
}

export const Stage11TeachBack: React.FC<Stage11TeachBackProps> = ({
  onProceedToFinale,
}) => {
  const [summaryText, setSummaryText] = useState<string>("");
  const evalResult = evaluateTeachBack(summaryText);

  const sampleOneLiner = "FastSyn adapts predictions using inference-time dynamic memory while learned model weights stay completely fixed.";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
          Stage 10 • Mastery Teach-Back
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
          The 20-Word Synthesis Challenge
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mt-2 text-sm">
          True understanding is distillation. Formulate the core insight of FastSyn in 20 words or fewer.
        </p>
      </div>

      {/* Main Challenge Input Card */}
      <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl border-cyan-500/40 bg-slate-900/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Feather className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base font-mono">
              Explain FastSyn in 20 words or fewer
            </h3>
          </div>

          {/* Live Word Counter */}
          <div className="font-mono text-xs">
            Word Count:{" "}
            <span
              className={`font-bold px-2 py-0.5 rounded ${
                evalResult.wordCount > 20
                  ? "bg-rose-950 text-rose-300 border border-rose-800"
                  : evalResult.wordCount > 0
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                  : "text-slate-400"
              }`}
            >
              {evalResult.wordCount} / 20 words
            </span>
          </div>
        </div>

        {/* Text Input */}
        <div>
          <textarea
            rows={3}
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            placeholder="Distill FastSyn into a single crisp sentence..."
            className="w-full p-4 rounded-xl bg-slate-950/90 border border-slate-700 text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyan-400 transition-all resize-none"
          />
        </div>

        {/* Helper autofill */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Stuck?</span>
          <button
            onClick={() => setSummaryText(sampleOneLiner)}
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            Insert exemplar sentence
          </button>
        </div>

        {/* Live Semantic Checklist */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
          {evalResult.checks.map((c, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${
                c.passed
                  ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-950/40 border-slate-800/60 text-slate-500"
              }`}
            >
              {c.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-600 flex-shrink-0" />
              )}
              <span className={c.passed ? "text-slate-200" : "text-slate-400"}>{c.label}</span>
            </div>
          ))}
        </div>

        {/* Live Feedback */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300">
          <strong>Evaluation: </strong>
          <span>{evalResult.feedback}</span>
        </div>
      </div>

      {/* Proceed */}
      <div className="flex justify-center">
        <button
          onClick={onProceedToFinale}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold font-mono text-sm tracking-wide flex items-center gap-2 shadow-glow-cyan transition-all"
        >
          <span>Reveal Final Cognitive Synthesis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
