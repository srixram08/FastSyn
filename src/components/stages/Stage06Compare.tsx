"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, Trophy, BarChart3 } from "lucide-react";
import { SimulationRun, Token } from "@/engine/types";

interface Stage06CompareProps {
  simulation: SimulationRun;
  userPrediction: string | null;
  onProceedToExplain: () => void;
}

export const Stage06Compare: React.FC<Stage06CompareProps> = ({
  simulation,
  userPrediction,
  onProceedToExplain,
}) => {
  const totalSamples = simulation.samples.length;
  const defaultStep = Math.min(totalSamples, Math.max(1, simulation.config.shiftTimestep + 3));
  const [inspectedStep, setInspectedStep] = useState<number>(defaultStep);

  const stepClamped = Math.min(totalSamples, Math.max(1, inspectedStep));
  const sampleAtStep = simulation.samples[stepClamped - 1] || simulation.samples[0];
  const fastPredAtStep = simulation.mechanisms.fastweight.predictions[stepClamped - 1];
  const staticPredAtStep = simulation.mechanisms.static.predictions[stepClamped - 1];
  const transPredAtStep = simulation.mechanisms.transformer.predictions[stepClamped - 1];
  const ssmPredAtStep = simulation.mechanisms.ssm.predictions[stepClamped - 1];

  const fastAcc = simulation.mechanisms.fastweight.accuracy;
  const ssmAcc = simulation.mechanisms.ssm.accuracy;
  const transAcc = simulation.mechanisms.transformer.accuracy;
  const staticAcc = simulation.mechanisms.static.accuracy;

  const userPredictedFastSyn = userPrediction === "fastweight";

  const mechanismsList = [
    { id: "fastweight", name: "FastSyn / BDH", acc: fastAcc, postAcc: simulation.mechanisms.fastweight.postShiftAccuracy },
    { id: "ssm", name: "SSM Memory", acc: ssmAcc, postAcc: simulation.mechanisms.ssm.postShiftAccuracy },
    { id: "transformer", name: "Transformer KV", acc: transAcc, postAcc: simulation.mechanisms.transformer.postShiftAccuracy },
    { id: "static", name: "Static Weights", acc: staticAcc, postAcc: simulation.mechanisms.static.postShiftAccuracy },
  ].sort((a, b) => b.postAcc - a.postAcc);

  const bestPostShift = mechanismsList[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
          Stage 05 • Evidence & Ground Truth Comparison
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
          Hypothesis Validation
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mt-2 text-sm">
          Examine the empirical simulation data and verify whether your initial prediction held true.
        </p>
      </div>

      {/* Prediction Feedback Card */}
      <div className="glass-panel p-6 rounded-2xl border-cyan-500/30 bg-slate-900/70">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* User's Prediction */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
              Your Pre-Experiment Hypothesis
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">
                {userPrediction
                  ? userPrediction === "fastweight"
                    ? "Fast-weight / BDH memory"
                    : userPrediction === "transformer"
                    ? "Transformer KV memory"
                    : userPrediction === "ssm"
                    ? "SSM memory"
                    : "Static weights"
                  : "Not specified"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              Committed in Stage 02 prior to viewing simulation results.
            </p>
          </div>

          {/* Scientific Outcome */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block mb-1">
              Empirical Simulation Result
            </span>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-xl font-bold text-emerald-300">
                {bestPostShift.name} adapted fastest
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 font-mono leading-relaxed">
              Post-shift accuracy: FastSyn ({simulation.mechanisms.fastweight.postShiftAccuracy}%) vs SSM ({simulation.mechanisms.ssm.postShiftAccuracy}%) vs Static ({simulation.mechanisms.static.postShiftAccuracy}%).
            </p>
          </div>
        </div>

        {/* Rationale explanation */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-mono text-slate-300">
          <strong>Why: </strong>
          {userPredictedFastSyn ? (
            <span className="text-emerald-300">
              Your hypothesis was validated by the simulation! FastSyn's localized synaptic outer-product write (M_{"{t+1}"} = λ·M_t + η·(v_t ⊗ k_t^T)) allowed it to associate the novel token classes with their sensory features within 1–2 timesteps, without altering W_frozen.
            </span>
          ) : (
            <span className="text-cyan-300">
              Notice how FastSyn rewires its dynamic synaptic matrix in a single step upon observing novel feedback, whereas Transformer KV requires accumulating a longer history buffer and Static weights have zero adaptation capacity.
            </span>
          )}
        </div>
      </div>

      {/* Full Timeline Sequence Comparison Grid */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-base">Full Sequence Stream Comparison</h3>
            <p className="text-xs text-slate-400 font-mono">
              Click any timestep below to inspect model confidence distributions
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Correct
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Incorrect
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-1.5 h-3 border-l-2 border-dashed border-amber-400" /> Shift Point (t=15)
            </span>
          </div>
        </div>

        {/* Interactive Timeline Rows */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[700px] space-y-2 font-mono text-xs">
            {/* Header: Timestep Numbers */}
            <div className="flex items-center">
              <div className="w-24 text-slate-500 text-[10px] uppercase">Timestep</div>
              <div className="flex-1 flex gap-1">
                {simulation.samples.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setInspectedStep(s.timestep)}
                    className={`flex-1 py-1 rounded text-[10px] text-center ${
                      inspectedStep === s.timestep
                        ? "bg-cyan-500 text-slate-950 font-bold"
                        : s.timestep === 15
                        ? "bg-amber-950/80 text-amber-300 font-bold border border-amber-700"
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {s.timestep}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 1: INPUT */}
            <div className="flex items-center">
              <div className="w-24 text-slate-400 font-semibold text-[11px]">INPUT</div>
              <div className="flex-1 flex gap-1">
                {simulation.samples.map((s) => (
                  <div
                    key={s.id}
                    className={`flex-1 py-1.5 rounded text-center text-[11px] font-bold ${
                      s.phase === "after_shift"
                        ? "bg-rose-950/30 text-rose-300 border border-rose-900/40"
                        : "bg-blue-950/30 text-blue-300 border border-blue-900/40"
                    }`}
                  >
                    {s.token}
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: GROUND TRUTH */}
            <div className="flex items-center">
              <div className="w-24 text-emerald-400 font-semibold text-[11px]">GROUND</div>
              <div className="flex-1 flex gap-1">
                {simulation.samples.map((s) => (
                  <div
                    key={s.id}
                    className="flex-1 py-1.5 rounded text-center text-[11px] font-bold bg-emerald-950/40 text-emerald-300 border border-emerald-900/40"
                  >
                    {s.groundTruth}
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: FASTSYN */}
            <div className="flex items-center">
              <div className="w-24 text-cyan-300 font-bold text-[11px]">FASTSYN</div>
              <div className="flex-1 flex gap-1">
                {simulation.mechanisms.fastweight.predictions.map((p) => (
                  <div
                    key={p.timestep}
                    className={`flex-1 py-1.5 rounded text-center text-[11px] font-bold ${
                      p.correct
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/50"
                    }`}
                  >
                    {p.predicted}
                  </div>
                ))}
              </div>
            </div>

            {/* Row 4: STATIC WEIGHTS */}
            <div className="flex items-center">
              <div className="w-24 text-amber-300 font-semibold text-[11px]">STATIC</div>
              <div className="flex-1 flex gap-1">
                {simulation.mechanisms.static.predictions.map((p) => (
                  <div
                    key={p.timestep}
                    className={`flex-1 py-1.5 rounded text-center text-[11px] font-bold ${
                      p.correct
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/50"
                    }`}
                  >
                    {p.predicted}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Inspected Timestep Details Drawer */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
          <div className="flex items-center justify-between mb-2">
            <span className="text-cyan-300 font-bold">
              Inspecting Timestep t = {stepClamped} ({sampleAtStep.phase === "after_shift" ? "Post-Shift" : "Pre-Shift"})
            </span>
            <span className="text-slate-400">
              Input Token: <strong>{sampleAtStep.token}</strong> • Ground Truth: <strong>{sampleAtStep.groundTruth}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] pt-2 border-t border-slate-800">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-cyan-400 font-semibold block">FastSyn / BDH</span>
              <div>Predicted: <strong>{fastPredAtStep?.predicted}</strong> ({fastPredAtStep?.correct ? "✓ Correct" : "✗ Miss"})</div>
              <div className="text-[10px] text-slate-500">Confidence: {(fastPredAtStep?.confidence * 100).toFixed(0)}%</div>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-emerald-400 font-semibold block">SSM Memory</span>
              <div>Predicted: <strong>{ssmPredAtStep?.predicted}</strong> ({ssmPredAtStep?.correct ? "✓ Correct" : "✗ Miss"})</div>
              <div className="text-[10px] text-slate-500">Confidence: {(ssmPredAtStep?.confidence * 100).toFixed(0)}%</div>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-blue-400 font-semibold block">Transformer KV</span>
              <div>Predicted: <strong>{transPredAtStep?.predicted}</strong> ({transPredAtStep?.correct ? "✓ Correct" : "✗ Miss"})</div>
              <div className="text-[10px] text-slate-500">Confidence: {(transPredAtStep?.confidence * 100).toFixed(0)}%</div>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-amber-400 font-semibold block">Static Weights</span>
              <div>Predicted: <strong>{staticPredAtStep?.predicted}</strong> ({staticPredAtStep?.correct ? "✓ Correct" : "✗ Miss"})</div>
              <div className="text-[10px] text-slate-500">Confidence: {(staticPredAtStep?.confidence * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <button
          onClick={onProceedToExplain}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold font-mono text-sm tracking-wide flex items-center gap-2 shadow-glow-cyan transition-all"
        >
          <span>Proceed to Explanation Challenge</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
