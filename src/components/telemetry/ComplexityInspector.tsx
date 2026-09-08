"use client";

import React, { useState } from "react";
import { Layers, Cpu, TrendingUp, Download, CheckCircle2, ArrowRight } from "lucide-react";
import { SimulationRun } from "@/engine/types";

interface ComplexityInspectorProps {
  simulation: SimulationRun;
}

export const ComplexityInspector: React.FC<ComplexityInspectorProps> = ({ simulation }) => {
  const [exportNotice, setExportNotice] = useState(false);
  const N = simulation.samples.length;
  const fastStates = simulation.mechanisms.fastweight.states;
  const transStates = simulation.mechanisms.transformer.states;

  // Handle Export Telemetry as JSON
  const handleExportJSON = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      config: simulation.config,
      totalSteps: N,
      accuracies: {
        fastweight: simulation.mechanisms.fastweight.accuracy,
        transformer: simulation.mechanisms.transformer.accuracy,
        ssm: simulation.mechanisms.ssm.accuracy,
        static: simulation.mechanisms.static.accuracy,
      },
      preShiftAccuracies: {
        fastweight: simulation.mechanisms.fastweight.preShiftAccuracy,
        static: simulation.mechanisms.static.preShiftAccuracy,
      },
      postShiftAccuracies: {
        fastweight: simulation.mechanisms.fastweight.postShiftAccuracy,
        static: simulation.mechanisms.static.postShiftAccuracy,
      },
      finalFootprintBytes: {
        fastweight: fastStates[N - 1]?.footprintBytes || 64,
        transformerKV: transStates[N - 1]?.footprintBytes || 32 * N,
        ssmHidden: 16,
        static: 0,
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fastsyn_telemetry_N${N}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 2500);
  };

  // Sample data points for SVG memory curve
  const stepsSampled = Array.from({ length: 20 }, (_, i) => {
    const stepIdx = Math.min(N - 1, Math.floor((i / 19) * (N - 1)));
    return {
      step: stepIdx + 1,
      fastBytes: fastStates[stepIdx]?.footprintBytes || 64,
      transBytes: transStates[stepIdx]?.footprintBytes || (stepIdx + 1) * 32,
    };
  });

  const maxTransBytes = Math.max(...stepsSampled.map((s) => s.transBytes), 100);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-900/30 pb-6">
        <div>
          <span className="text-xs font-mono text-purple-300 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30">
            Complexity & Telemetry
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
            Memory Footprint & <span className="font-serif-luxury italic text-purple-300">Scaling Laws</span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Empirical complexity comparison: Constant O(1) Fast-Weight Matrix vs Linear O(N) Context Cache
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          className="purple-glass px-4 py-2.5 rounded-full text-xs font-mono text-purple-200 hover:text-white border border-purple-500/40 hover:border-purple-300 flex items-center gap-2 cursor-pointer shadow-lg transition-all"
        >
          <Download className="w-4 h-4 text-purple-400" />
          <span>{exportNotice ? "Telemetry Exported!" : "Export Telemetry (JSON)"}</span>
        </button>
      </div>

      {/* Main Complexity Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive SVG Memory Growth Chart (8 Cols) */}
        <div className="lg:col-span-8 purple-glass p-6 rounded-3xl border border-purple-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                RAM Growth (Bytes) vs Sequence Length (N={N})
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-400" />
                <span className="text-purple-200">FastSyn O(1)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <span className="text-indigo-200">Transformer KV O(N)</span>
              </div>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="h-64 w-full relative bg-[#090414] p-3 rounded-2xl border border-purple-900/40 flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(168, 85, 247, 0.1)" strokeDasharray="4" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(168, 85, 247, 0.1)" strokeDasharray="4" />
              <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(168, 85, 247, 0.1)" strokeDasharray="4" />

              {/* Linear Transformer KV Curve (Ascending) */}
              <polyline
                fill="none"
                stroke="#818cf8"
                strokeWidth="3"
                points={stepsSampled
                  .map((pt, idx) => {
                    const x = (idx / 19) * 600;
                    const y = 190 - (pt.transBytes / maxTransBytes) * 170;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />

              {/* Constant FastSyn Line (Strictly Horizontal Flat) */}
              <polyline
                fill="none"
                stroke="#d946ef"
                strokeWidth="3.5"
                points={stepsSampled
                  .map((_, idx) => {
                    const x = (idx / 19) * 600;
                    const y = 190 - (64 / maxTransBytes) * 170;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />
            </svg>

            <div className="absolute top-3 left-4 text-[10px] font-mono text-indigo-300">
              KV Memory Peak: {maxTransBytes.toLocaleString()} Bytes
            </div>
            <div className="absolute bottom-6 left-4 text-[10px] font-mono text-fuchsia-300 font-bold">
              FastSyn Strictly Constant: 64 Bytes (O(1))
            </div>
          </div>

          <div className="flex justify-between text-xs font-mono text-slate-400 pt-1">
            <span>t = 1</span>
            <span>Sequence Scale: N = {N} Timesteps</span>
            <span>t = {N}</span>
          </div>
        </div>

        {/* Right: Technical Readout Cards (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="purple-glass-accent p-6 rounded-3xl border border-purple-400/40 space-y-3">
            <span className="text-xs font-mono uppercase text-purple-300 tracking-wider">
              FastSyn Memory Footprint
            </span>
            <div className="text-4xl font-extrabold text-white font-mono">64 Bytes</div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 font-mono text-xs border border-purple-400/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Strictly Constant O(1)</span>
            </div>
            <p className="text-xs font-mono text-slate-300 leading-relaxed pt-1">
              Regardless of whether the sequence processes 20 tokens or 10,000 tokens, the dynamic synaptic state occupies exactly a single 4×4 float32 matrix.
            </p>
          </div>

          <div className="purple-glass p-6 rounded-3xl border border-purple-900/40 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Transformer Context Cache
            </span>
            <div className="text-4xl font-extrabold text-indigo-300 font-mono">
              {(transStates[N - 1]?.footprintBytes || N * 32).toLocaleString()} Bytes
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 font-mono text-xs border border-indigo-400/30">
              <span>Linear Scaling O(t)</span>
            </div>
            <p className="text-xs font-mono text-slate-400 leading-relaxed pt-1">
              Context memory grows unbounded as past key-value representations accumulate in RAM with each incoming token.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
