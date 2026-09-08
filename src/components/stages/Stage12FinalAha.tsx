"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { RotateCcw, BookOpen, Award, CheckCircle2, ArrowUpRight, Cpu } from "lucide-react";
import { SimulationRun } from "@/engine/types";

interface Stage12FinalAhaProps {
  simulation: SimulationRun;
  onRestart: () => void;
  onOpenReview: () => void;
  onOpenTechModal: () => void;
}

export const Stage12FinalAha: React.FC<Stage12FinalAhaProps> = ({
  simulation,
  onRestart,
  onOpenReview,
  onOpenTechModal,
}) => {
  useEffect(() => {
    // Fire festive scientific confetti celebration
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ["#06b6d4", "#10b981", "#3b82f6"],
    });
    fire(0.2, {
      spread: 60,
      colors: ["#38bdf8", "#34d399", "#f59e0b"],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-10">
      {/* Laboratory Completion Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
        <Award className="w-4 h-4 text-emerald-400" />
        <span className="font-bold tracking-wider">LABORATORY EXPERIMENT COMPLETE</span>
      </div>

      {/* The Iconic Typography Triptych */}
      <div className="space-y-4 sm:space-y-6 my-6">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-400">
          THE WEIGHTS STAYED{" "}
          <span className="text-amber-400 underline decoration-amber-500/50">
            FIXED.
          </span>
        </h2>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent animate-pulse">
          THE MEMORY ADAPTED.
        </h2>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
          THAT CHANGED THE PREDICTION.
        </h2>
      </div>

      {/* Subtitle definition */}
      <div className="glass-panel-glow p-6 sm:p-8 rounded-3xl border-cyan-500/40 max-w-2xl mx-auto bg-slate-900/80 shadow-glow-cyan text-left space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-lg">
              FastSyn — Fast Synaptic Adaptation in AI
            </h3>
            <p className="text-xs font-mono text-cyan-300">
              Interactive Cognitive Laboratory
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
          You have verified through empirical simulation that an artificial intelligence model does not need parameter backpropagation or offline retraining to respond to an evolving world. By maintaining an inference-time synaptic memory substrate, AI systems can dynamically adapt while preserving foundational stability.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono border-t border-slate-800">
          <div>
            <span className="text-slate-400 text-[10px] block">Learned Weights</span>
            <span className="text-amber-300 font-bold">100% Frozen</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Inference Adaptation</span>
            <span className="text-cyan-300 font-bold">Dynamic (M_t)</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Backpropagation</span>
            <span className="text-emerald-300 font-bold">Zero Required</span>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={onRestart}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold font-mono text-sm tracking-wide flex items-center gap-2.5 shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Run Experiment Again</span>
        </button>

        <button
          onClick={onOpenReview}
          className="px-6 py-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white font-mono text-sm flex items-center gap-2 transition-all"
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Review What I Learned</span>
        </button>

        <button
          onClick={onOpenTechModal}
          className="px-6 py-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 font-mono text-sm flex items-center gap-2 transition-all"
        >
          <span>View Technical Specs</span>
          <ArrowUpRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
