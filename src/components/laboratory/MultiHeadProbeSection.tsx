"use client";

import React, { useState, useMemo } from "react";
import { 
  DEFAULT_HEAD_CONFIGS, 
  initMultiHeadFastWeights, 
  updateMultiHeadFastWeights, 
  probeAssociativeRetrieval, 
  computeHopfieldLandscape 
} from "@/engine/multihead";
import { Matrix4x4, SimulationRun, InputSample } from "@/engine/types";
import { Layers, Search, Sparkles, Activity, ArrowRight, Compass, ShieldCheck, Cpu } from "lucide-react";

interface MultiHeadProbeSectionProps {
  simulation: SimulationRun;
}

export const MultiHeadProbeSection: React.FC<MultiHeadProbeSectionProps> = ({ simulation }) => {
  const [selectedHeadId, setSelectedHeadId] = useState<number>(1);
  const [probeQueryIndex, setProbeQueryIndex] = useState<number>(0);
  const [probeMode, setProbeMode] = useState<"token" | "custom">("token");
  const [customVector, setCustomVector] = useState<[number, number, number, number]>([0.8, 0.4, -0.2, 0.6]);

  // Compute multi-head fast weights across simulation history
  const multiHeadResults = useMemo(() => {
    const heads = initMultiHeadFastWeights();
    let currentStates = heads.map((m, idx) => ({
      headId: idx + 1,
      name: DEFAULT_HEAD_CONFIGS[idx].name,
      specialization: DEFAULT_HEAD_CONFIGS[idx].specialization,
      matrix: m,
      frobeniusNorm: 0,
      activeSparsity: 1.0,
    }));

    const samples = simulation.samples;
    let prevVec: [number, number, number, number] = [0.2, 0.2, 0.2, 0.2];

    for (let t = 0; t < samples.length; t++) {
      const s = samples[t];
      const isShift = t === simulation.config.shiftTimestep;
      const feat = s.features as [number, number, number, number];
      currentStates = updateMultiHeadFastWeights(heads, feat, prevVec, isShift);
      prevVec = feat;
    }

    return currentStates;
  }, [simulation]);

  const activeHead = multiHeadResults.find((h) => h.headId === selectedHeadId) || multiHeadResults[0];

  // Active query vector for content-addressable probe
  const queryVector: [number, number, number, number] = useMemo(() => {
    if (probeMode === "custom") return customVector;
    const sample = simulation.samples[probeQueryIndex];
    return sample ? (sample.features as [number, number, number, number]) : [0.5, 0.5, 0.5, 0.5];
  }, [probeMode, customVector, simulation, probeQueryIndex]);

  // Target expected association
  const targetVector: [number, number, number, number] = useMemo(() => {
    const nextSample = simulation.samples[Math.min(probeQueryIndex + 1, simulation.samples.length - 1)];
    return nextSample ? (nextSample.features as [number, number, number, number]) : [0.5, 0.5, 0.5, 0.5];
  }, [probeQueryIndex, simulation]);

  // Probe computation
  const probeResult = useMemo(() => {
    return probeAssociativeRetrieval(activeHead.matrix, queryVector, targetVector, activeHead.headId);
  }, [activeHead, queryVector, targetVector]);

  // Hopfield Energy Grid calculation
  const hopfieldGrid = useMemo(() => {
    return computeHopfieldLandscape(activeHead.matrix, 21);
  }, [activeHead.matrix]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 text-slate-100">
      {/* Top Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full purple-glass border border-purple-500/40 text-purple-300 text-xs font-mono">
          <Layers className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>Multi-Head Plasticity • Content-Addressable Probe</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Multi-Head Synaptic Binding & <span className="font-serif-luxury italic font-normal text-purple-300">Associative Probe.</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          In contrast to multi-head self-attention which must store and search through quadratic token KV histories, 
          FastSyn maintains <strong className="text-purple-300">H independent fast-weight matrices</strong> in parallel. 
          Each head specializes in distinct relational bindings without cross-talk, supporting instantaneous $O(1)$ associative query retrieval.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: 4-HEAD DECOMPOSITION HEATMAP GRID                              */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{"Multi-Head Fast-Weight Decomposition (A^(1) ... A^(4))"}</span>
          </h2>
          <span className="text-xs font-mono text-purple-300">
            Total Heads: 4 • Memory per Head: 64B (Fixed O(1))
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {multiHeadResults.map((head) => {
            const isSelected = selectedHeadId === head.headId;
            const cfg = DEFAULT_HEAD_CONFIGS.find((c) => c.id === head.headId)!;

            return (
              <div
                key={head.headId}
                onClick={() => setSelectedHeadId(head.headId)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  isSelected
                    ? "purple-glass-accent border-purple-400 shadow-xl shadow-purple-900/40 scale-[1.02]"
                    : "purple-glass border-purple-900/40 hover:border-purple-500/40 opacity-90"
                }`}
              >
                {/* Head Title & Selection Indicator */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white tracking-wide" style={{ color: cfg.color }}>
                    {head.name}
                  </span>
                  <div className={`w-3 h-3 rounded-full border ${isSelected ? "bg-fuchsia-400 border-white shadow-sm" : "border-slate-600"}`} />
                </div>

                <p className="text-[11px] text-slate-300 leading-snug mb-4 min-h-[34px]">
                  {head.specialization}
                </p>

                {/* 4x4 Synaptic Head Heatmap */}
                <div className="bg-[#0b0416] p-2.5 rounded-xl border border-purple-900/50 mb-3">
                  <div className="grid grid-cols-4 gap-1">
                    {head.matrix.map((row: number[], rIdx: number) =>
                      row.map((val: number, cIdx: number) => {
                        const absVal = Math.min(1, Math.abs(val) * 1.2);
                        const isPositive = val >= 0;
                        return (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            className="h-7 rounded flex items-center justify-center text-[9px] font-mono transition-colors"
                            style={{
                              backgroundColor: isPositive
                                ? `rgba(217, 70, 239, ${0.15 + absVal * 0.75})`
                                : `rgba(56, 189, 248, ${0.15 + absVal * 0.75})`,
                              color: absVal > 0.4 ? "#ffffff" : "#cbd5e1",
                            }}
                            title={`Head ${head.headId} [${rIdx},${cIdx}]: ${val.toFixed(3)}`}
                          >
                            {val.toFixed(1)}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-purple-900/40">
                  <span>||A||_F: <strong className="text-purple-200">{head.frobeniusNorm.toFixed(2)}</strong></span>
                  <span>Sparsity: <strong className="text-purple-200">{(head.activeSparsity * 100).toFixed(0)}%</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: VECTOR ASSOCIATION & CONTENT-ADDRESSABLE RETRIEVAL PROBE       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Probe Controls & Readout (7 Cols) */}
        <div className="lg:col-span-7 purple-glass p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-400/40 flex items-center justify-center">
                <Search className="w-4 h-4 text-purple-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Content-Addressable Retrieval Probe</h3>
                <p className="text-xs text-slate-400">{"Query associative fast weights: y = A_fast q"}</p>
              </div>
            </div>

            {/* Probe Mode Switch */}
            <div className="flex items-center gap-1 bg-[#0b0416] p-1 rounded-xl border border-purple-900/60 text-xs font-mono">
              <button
                onClick={() => setProbeMode("token")}
                className={`px-3 py-1 rounded-lg transition-all ${probeMode === "token" ? "bg-purple-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
              >
                Token History
              </button>
              <button
                onClick={() => setProbeMode("custom")}
                className={`px-3 py-1 rounded-lg transition-all ${probeMode === "custom" ? "bg-purple-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
              >
                Custom Vector
              </button>
            </div>
          </div>

          {/* Token Selector Strip */}
          {probeMode === "token" ? (
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Select Query Token ($x_t$):</span>
                <span className="text-purple-300 font-bold">Step #{probeQueryIndex + 1} of {simulation.samples.length}</span>
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {simulation.samples.slice(0, 15).map((tok: InputSample, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setProbeQueryIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono shrink-0 transition-all border ${
                      probeQueryIndex === idx
                        ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-purple-300 shadow-md scale-105"
                        : "bg-[#0f0724] text-slate-300 border-purple-900/40 hover:border-purple-500/40"
                    }`}
                  >
                    t={tok.timestep}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-xs font-mono text-slate-400">Custom 4D Query Vector ($q$):</label>
              <div className="grid grid-cols-4 gap-2">
                {customVector.map((val, idx) => (
                  <div key={idx} className="bg-[#0b0416] p-2 rounded-xl border border-purple-900/60">
                    <span className="text-[10px] font-mono text-slate-500 block mb-1">q[{idx}]</span>
                    <input
                      type="number"
                      step="0.1"
                      min="-2"
                      max="2"
                      value={val}
                      onChange={(e) => {
                        const newV = [...customVector] as [number, number, number, number];
                        newV[idx] = parseFloat(e.target.value) || 0;
                        setCustomVector(newV);
                      }}
                      className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mathematical Associative Readout Display */}
          <div className="bg-[#090314] p-5 rounded-2xl border border-purple-900/60 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-center">
              {/* Query Vector q */}
              <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/20">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">Query Vector q</span>
                <span className="text-xs font-mono text-purple-200">
                  [{queryVector.map((v) => v.toFixed(2)).join(", ")}]
                </span>
              </div>

              {/* Transformation Operator */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs font-mono text-fuchsia-300 flex items-center gap-1 font-bold">
                  <span>× {activeHead.name.split(":")[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-fuchsia-400" />
                </span>
                <span className="text-[10px] font-mono text-slate-500">Associative Readout</span>
              </div>

              {/* Retrieved Vector y */}
              <div className="p-3 bg-fuchsia-950/40 rounded-xl border border-fuchsia-500/30">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">Retrieved Vector y</span>
                <span className="text-xs font-mono text-fuchsia-200">
                  [{probeResult.readoutVector.map((v) => v.toFixed(2)).join(", ")}]
                </span>
              </div>
            </div>

            {/* Cosine Similarity & Retrieval Precision */}
            <div className="space-y-2 pt-2 border-t border-purple-900/40">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Target Alignment (Cosine Similarity):</span>
                <span className="text-fuchsia-300 font-bold">
                  {(probeResult.cosineSimilarity * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-purple-950/60 overflow-hidden border border-purple-900/40">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${Math.max(0, Math.min(100, (probeResult.cosineSimilarity + 1) * 50))}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Probe directly extracts the associated representation without scanning through sequential token buffers.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Continuous Hopfield Energy Landscape (5 Cols) */}
        <div className="lg:col-span-5 purple-glass p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-fuchsia-400" />
              <h3 className="text-base font-bold text-white">Continuous Hopfield Energy Landscape</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/50 border border-purple-500/30 text-purple-300">
              Lyapunov Attractor
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Fast synaptic updates form dynamical attractor basins according to modern continuous Hopfield energy:
            <span className="block font-mono text-purple-300 text-[11px] mt-1">{"E(x) = -1/2 * x^T * A_fast * x"}</span>
          </p>

          {/* 2D Contour Elevation Elevation Map */}
          <div className="relative bg-[#080214] p-3 rounded-2xl border border-purple-900/60 flex items-center justify-center">
            <div className="grid grid-cols-21 gap-[2px] w-full max-w-[340px] aspect-square">
              {hopfieldGrid.map((row, rIdx) =>
                row.map((pt, cIdx) => {
                  // Normalize energy for contour coloring
                  const normEnergy = Math.max(0, Math.min(1, (pt.energy + 4) / 8));
                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className="w-full h-full rounded-[1px] transition-colors"
                      style={{
                        backgroundColor: `hsl(${280 + normEnergy * 60}, 90%, ${15 + normEnergy * 65}%)`,
                      }}
                      title={`x: ${pt.x.toFixed(1)}, y: ${pt.y.toFixed(1)}, E: ${pt.energy.toFixed(2)}`}
                    />
                  );
                })
              )}
            </div>

            {/* Attractor Well Center Pin */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-6 h-6 rounded-full border-2 border-white/80 bg-fuchsia-500/40 animate-ping" />
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-lg shadow-fuchsia-500" />
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#38105c]" />
              <span>Deep Energy Well (Attractor)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#f472b6]" />
              <span>High Energy Basin</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
