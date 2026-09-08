"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, ArrowRight, MessageSquareCode, Sparkles, BookOpen } from "lucide-react";
import { evaluateExplanation } from "@/engine/rubric";

interface Stage07ExplainProps {
  onProceedToMisconception: () => void;
}

export const Stage07Explain: React.FC<Stage07ExplainProps> = ({
  onProceedToMisconception,
}) => {
  const [explanation, setExplanation] = useState<string>("");
  const rubric = evaluateExplanation(explanation);

  const sampleAnswers = [
    "FastSyn's learned weights stay frozen, but its inference-time dynamic memory matrix adapts to incoming inputs without any backpropagation.",
    "The weights are fixed, but the internal synaptic memory state updates sequentially, changing future predictions without retraining.",
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
          Stage 06 • The Explanation Challenge
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
          Synthesize the Scientific Mechanism
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mt-2 text-sm">
          Explain what you observed in the laboratory using your own words.
        </p>
      </div>

      {/* The Question Prompt */}
      <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl border-cyan-500/40 bg-slate-900/80">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
            <MessageSquareCode className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
              Core Inquiry
            </span>
            <h3 className="text-xl font-bold text-white">
              “Why could FastSyn adapt even though its learned weights never changed?”
            </h3>
          </div>
        </div>

        {/* Text Area */}
        <div className="mt-4">
          <textarea
            rows={4}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Type your scientific explanation here... (e.g., mention weights, dynamic state/memory, test-time adaptation, backpropagation)"
            className="w-full p-4 rounded-xl bg-slate-950/90 border border-slate-700 text-slate-100 placeholder-slate-500 font-mono text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-all resize-none"
          />
        </div>

        {/* Sample Prompt Helpers */}
        <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-slate-400 flex-wrap">
          <span className="text-slate-500">Need inspiration?</span>
          {sampleAnswers.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setExplanation(sample)}
              className="text-cyan-400/80 hover:text-cyan-300 underline hover:no-underline text-left truncate max-w-xs"
            >
              Paste example {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Live Transparent Rubric Feedback */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-mono">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="font-bold text-white text-sm">Transparent Conceptual Rubric</h4>
          </div>
          <div className="font-mono text-sm">
            Score:{" "}
            <span
              className={`font-bold ${
                rubric.score >= 3 ? "text-emerald-400" : rubric.score > 0 ? "text-amber-400" : "text-slate-400"
              }`}
            >
              {rubric.score} / {rubric.maxScore} Concepts
            </span>
          </div>
        </div>

        {/* Concept Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
          {rubric.concepts.map((concept) => (
            <div
              key={concept.id}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                concept.matched
                  ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-200"
                  : "bg-slate-950/50 border-slate-800/80 text-slate-400"
              }`}
            >
              <div className="mt-0.5">
                {concept.matched ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                )}
              </div>
              <div>
                <span
                  className={`text-xs font-bold block ${
                    concept.matched ? "text-emerald-300" : "text-slate-300"
                  }`}
                >
                  {concept.label}
                </span>
                <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                  {concept.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Message */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-slate-300">
          <strong>Evaluation: </strong>
          <span>{rubric.feedback}</span>
        </div>
      </div>

      {/* Proceed CTA */}
      <div className="flex justify-center">
        <button
          onClick={onProceedToMisconception}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold font-mono text-sm tracking-wide flex items-center gap-2 shadow-glow-cyan transition-all"
        >
          <span>Continue to Misconception Test</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
