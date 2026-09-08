"use client";

import React, { useState, useMemo } from "react";
import { AlertTriangle, Sliders, ArrowRight, RefreshCw, Zap, ShieldAlert, CheckCircle2 } from "lucide-react";
import { runSimulation } from "@/engine/simulation";
import { MathUtils } from "@/engine/seedRandom";

interface Stage10LimitationProps {
  onProceedToTeachBack: () => void;
}

export const Stage10Limitation: React.FC<Stage10LimitationProps> = ({
  onProceedToTeachBack,
}) => {
  const [lambdaVal, setLambdaVal] = useState<number>(0.86);
  const [etaVal, setEtaVal] = useState<number>(0.52);

  // Compute live test simulation with user's lambda and eta
  const stressRun = useMemo(() => {
    return runSimulation({
      lambdaRetention: lambdaVal,
      etaUpdate: etaVal,
      shiftDelta: 0.85,
    });
  }, [lambdaVal, etaVal]);

  const fastResult = stressRun.mechanisms.fastweight;

  // Determine pathology/failure state
  let pathology = "Optimal Balance";
  let pathologyDesc = "Memory balances plastic adaptation to novel stream tokens with stability against noise.";
  let pathologyColor = "text-emerald-400 border-emerald-500/40 bg-emerald-950/20";

  if (etaVal < 0.12) {
    pathology = "Stale / Rigid Memory";
    pathologyDesc = "Update rate η is too weak. FastSyn fails to write novel patterns into RAM, collapsing towards static performance.";
    pathologyColor = "text-amber-400 border-amber-500/40 bg-amber-950/20";
  } else if (lambdaVal < 0.35) {
    pathology = "Catastrophic Forgetting";
    pathologyDesc = "Retention λ is too low. Synaptic traces decay immediately after writing, obliterating accumulated context.";
    pathologyColor = "text-rose-400 border-rose-500/40 bg-rose-950/20";
  } else if (lambdaVal > 0.94 && etaVal > 0.8) {
    pathology = "Synaptic Saturation & Interference";
    pathologyDesc = "Both retention and update are at maximum. Memory accumulates runaway magnitudes, causing severe cross-talk interference.";
    pathologyColor = "text-rose-400 border-rose-500/40 bg-rose-950/20";
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <span className="text-xs font-mono text-rose-400 uppercase tracking-widest px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30">
          Stage 09 • The Danger Zone & Scientific Limits
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
          Does Dynamic Memory Always Win?
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mt-2 text-sm">
          No. Dynamic inference memory is a double-edged sword governed by retention and plasticity.
        </p>
      </div>

      {/* Main Interactive Test Bench Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-white text-lg font-mono flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Synaptic Stress Test Bench
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Manipulate retention λ and update strength η to observe genuine failure modes.
            </p>
          </div>

          <div className={`px-4 py-2 rounded-xl border text-xs font-mono ${pathologyColor}`}>
            <span className="font-bold block uppercase tracking-wider">{pathology}</span>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slider 1: Memory Retention Lambda */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-bold">Memory Retention (λ):</span>
              <span className="text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 font-bold">
                {(lambdaVal * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={lambdaVal}
              onChange={(e) => setLambdaVal(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0% (Instant Forgetting)</span>
              <span>100% (Permanent Retention)</span>
            </div>
          </div>

          {/* Slider 2: Update Strength Eta */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-bold">Update Strength (η):</span>
              <span className="text-emerald-300 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 font-bold">
                {(etaVal * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={etaVal}
              onChange={(e) => setEtaVal(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0% (Frozen / Zero Plasticity)</span>
              <span>100% (Aggressive Rewiring)</span>
            </div>
          </div>
        </div>

        {/* Real Computed Results for this setting */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 uppercase tracking-wider text-[10px]">
              Live Simulation Performance Under Selected Parameters:
            </span>
            <span className="text-cyan-400 text-[11px]">
              Computed live from engine
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Overall Accuracy</span>
              <span className="text-xl font-extrabold text-cyan-300">{fastResult.accuracy}%</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Pre-Shift (A/B)</span>
              <span className="text-xl font-extrabold text-slate-200">{fastResult.preShiftAccuracy}%</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Post-Shift (C/D)</span>
              <span className="text-xl font-extrabold text-emerald-300">{fastResult.postShiftAccuracy}%</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60 text-slate-300 text-[11px] leading-relaxed">
            <strong>Diagnosis: </strong>
            <span>{pathologyDesc}</span>
          </div>
        </div>

        {/* Preset Failure Mode Quick-Buttons */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Load Educational Stress Presets:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
            <button
              onClick={() => {
                setLambdaVal(0.15);
                setEtaVal(0.5);
              }}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 transition-all text-left"
            >
              ⚡ <strong>Forgetting Trap:</strong> λ = 15%, η = 50%
            </button>

            <button
              onClick={() => {
                setLambdaVal(0.9);
                setEtaVal(0.04);
              }}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 transition-all text-left"
            >
              🔒 <strong>Frozen Stagnation:</strong> λ = 90%, η = 4%
            </button>

            <button
              onClick={() => {
                setLambdaVal(0.98);
                setEtaVal(0.95);
              }}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all text-left"
            >
              💥 <strong>Runaway Interference:</strong> λ = 98%, η = 95%
            </button>
          </div>
        </div>
      </div>

      {/* Summary Alert */}
      <div className="glass-panel p-5 rounded-xl border-amber-500/20 bg-amber-950/10 text-xs font-mono text-amber-200 leading-relaxed">
        <strong>Takeaway: </strong>
        Dynamic memory does not eliminate trade-offs. Successful synaptic adaptation requires tuning plasticity rates so that new associations can be rapidly formed without corrupting previously acquired representations.
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <button
          onClick={onProceedToTeachBack}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold font-mono text-sm tracking-wide flex items-center gap-2 shadow-glow-cyan transition-all"
        >
          <span>Proceed to Final 20-Word Teach-Back</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
