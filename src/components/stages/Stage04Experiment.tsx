"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Cpu,
  Layers,
  Activity,
  Brain,
  Check,
  X,
  Maximize2,
  TrendingUp,
  BookmarkPlus,
  RefreshCw,
  Sparkles,
  BarChart2,
  Eye,
  ArrowRight,
} from "lucide-react";
import { SimulationRun, Token, SimulationConfig } from "@/engine/types";
import { LocalStore } from "@/engine/persistence";
import { Synaptic3DLab } from "@/components/canvas/Synaptic3DLab";

interface Stage04ExperimentProps {
  simulation: SimulationRun;
  currentTimestep: number;
  onSetTimestep: (t: number) => void;
  config: SimulationConfig;
  onUpdateConfig: (partial: Partial<SimulationConfig>) => void;
  onProceedToAha: () => void;
}

export const Stage04Experiment: React.FC<Stage04ExperimentProps> = ({
  simulation,
  currentTimestep,
  onSetTimestep,
  config,
  onUpdateConfig,
  onProceedToAha,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [view3DMode, setView3DMode] = useState<boolean>(false);
  const [hoveredCell, setHoveredCell] = useState<{
    matrix: "frozen" | "fastsyn";
    row: number;
    col: number;
    val: number;
  } | null>(null);
  const [benchmarksCount, setBenchmarksCount] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const totalSteps = simulation.samples.length;
  const currentSample = simulation.samples[currentTimestep - 1] || simulation.samples[0];

  // Mechanisms shorthand
  const mechStatic = simulation.mechanisms.static;
  const mechTrans = simulation.mechanisms.transformer;
  const mechSSM = simulation.mechanisms.ssm;
  const mechFast = simulation.mechanisms.fastweight;

  // States at current timestep
  const currentFastState = mechFast.states[currentTimestep - 1];
  const currentTransState = mechTrans.states[currentTimestep - 1];
  const currentSSMState = mechSSM.states[currentTimestep - 1];

  // Predictions at current timestep
  const predFast = mechFast.predictions[currentTimestep - 1];
  const predTrans = mechTrans.predictions[currentTimestep - 1];
  const predSSM = mechSSM.predictions[currentTimestep - 1];
  const predStatic = mechStatic.predictions[currentTimestep - 1];

  // Cumulative correct counts up to current timestep
  const fastCorrectUpTo = mechFast.predictions
    .slice(0, currentTimestep)
    .filter((p) => p.correct).length;

  useEffect(() => {
    setBenchmarksCount(LocalStore.getBenchmarks().length);
  }, []);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.max(100, 700 / playbackSpeed);
    const interval = setInterval(() => {
      onSetTimestep(currentTimestep >= totalSteps ? 1 : currentTimestep + 1);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, currentTimestep, totalSteps, playbackSpeed, onSetTimestep]);

  const handleSaveBenchmark = () => {
    const id = "bm_" + Date.now();
    LocalStore.saveBenchmark({
      id,
      name: `Shift ${(config.shiftDelta * 100).toFixed(0)}% (λ=${config.lambdaRetention.toFixed(2)}, η=${config.etaUpdate.toFixed(2)})`,
      timestamp: Date.now(),
      config,
      accuracies: {
        fastweight: mechFast.accuracy,
        transformer: mechTrans.accuracy,
        ssm: mechSSM.accuracy,
        static: mechStatic.accuracy,
      },
      footprints: {
        fastweightBytes: currentFastState?.footprintBytes || 64,
        transformerBytes: currentTransState?.footprintBytes || 240,
        ssmBytes: currentSSMState?.footprintBytes || 16,
        staticBytes: 0,
      },
    });
    setBenchmarksCount(LocalStore.getBenchmarks().length);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Luxury Purple Theme Heatmap Color Formulator
  const getCellColor = (val: number, isFrozen: boolean) => {
    if (isFrozen) {
      if (val > 0) {
        const intensity = Math.min(1, val / 2.2);
        return `rgba(245, 158, 11, ${0.2 + intensity * 0.75})`;
      } else {
        const intensity = Math.min(1, Math.abs(val) / 1.5);
        return `rgba(71, 85, 105, ${0.25 + intensity * 0.5})`;
      }
    } else {
      // Dynamic FastSyn memory in Luxury Purple / Fuchsia
      if (val >= 0) {
        const intensity = Math.min(1, val / 1.8);
        return `rgba(217, 70, 239, ${0.2 + intensity * 0.8})`; // Electric Fuchsia
      } else {
        const intensity = Math.min(1, Math.abs(val) / 1.8);
        return `rgba(99, 102, 241, ${0.2 + intensity * 0.8})`; // Deep Indigo
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 space-y-6">
      {/* Top Laboratory Title Bar & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 purple-glass p-4 rounded-3xl border border-purple-500/30 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-lg shadow-purple-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-mono tracking-wide">
                MEMORY FORENSICS LABORATORY
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/80 border border-purple-400/40 text-purple-200 font-bold">
                LIVE COMPUTE
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Deterministic inference stream • Sequence N={totalSteps} • Shift at t={config.shiftTimestep}
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveBenchmark}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono font-medium border transition-all cursor-pointer ${
              saveSuccess
                ? "bg-fuchsia-500 text-white border-fuchsia-400 font-bold shadow-lg shadow-fuchsia-500/30"
                : "purple-glass border-purple-500/30 text-purple-200 hover:border-purple-300 hover:text-white"
            }`}
            title="Save current parameter run to local benchmarks"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>{saveSuccess ? "Saved!" : `Bookmark Run (${benchmarksCount})`}</span>
          </button>

          <button
            onClick={onProceedToAha}
            className="btn-purple-glow flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono font-bold text-white shadow-lg cursor-pointer"
          >
            <span>Analyze Telemetry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3-PANEL SCIENTIFIC WORKSTATION                                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ----------------------------------------------------------------------- */}
        {/* PANEL 1: ENVIRONMENT & SEQUENCE CONTROLS (3 Cols)                       */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-3 purple-glass p-5 rounded-3xl border border-purple-500/30 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Environment
              </h3>
            </div>
            <button
              onClick={() => onUpdateConfig({ seed: Math.floor(Math.random() * 9999) + 1 })}
              className="text-[11px] font-mono text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
              title="Generate new random sequence seed"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Seed {config.seed}</span>
            </button>
          </div>

          {/* Shift Severity Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Shift Severity (δ):</span>
              <span className="font-bold text-amber-300 font-mono">
                {(config.shiftDelta * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.shiftDelta}
              onChange={(e) => onUpdateConfig({ shiftDelta: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-purple-950 rounded-lg cursor-pointer accent-fuchsia-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0% (Stable)</span>
              <span>100% (Total Shift)</span>
            </div>
          </div>

          {/* Retention Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Retention Rate (λ):</span>
              <span className="font-bold text-fuchsia-300 font-mono">
                {(config.lambdaRetention * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.99"
              step="0.02"
              value={config.lambdaRetention}
              onChange={(e) => onUpdateConfig({ lambdaRetention: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-purple-950 rounded-lg cursor-pointer accent-fuchsia-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>10% (Fast Forget)</span>
              <span>99% (Persistent)</span>
            </div>
          </div>

          {/* Update Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Update Strength (η):</span>
              <span className="font-bold text-purple-300 font-mono">
                {config.etaUpdate.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.50"
              step="0.05"
              value={config.etaUpdate}
              onChange={(e) => onUpdateConfig({ etaUpdate: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-purple-950 rounded-lg cursor-pointer accent-fuchsia-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.05 (Rigid)</span>
              <span>1.50 (High Plasticity)</span>
            </div>
          </div>

          {/* Sequence Length Slider with Quick Jumps up to 1000 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Sequence Length (N):</span>
              <span className="font-bold text-fuchsia-300 font-mono text-sm">
                {config.sequenceLength} steps
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="1000"
              step="20"
              value={config.sequenceLength}
              onChange={(e) => {
                const len = parseInt(e.target.value, 10);
                const shift = Math.floor(len / 2);
                onUpdateConfig({ sequenceLength: len, shiftTimestep: shift });
                if (currentTimestep > len) onSetTimestep(len);
              }}
              className="w-full h-1.5 bg-purple-950 rounded-lg cursor-pointer accent-fuchsia-400"
            />
            <div className="flex items-center justify-between gap-1 pt-1">
              {[20, 50, 100, 250, 500, 1000].map((stepCount) => (
                <button
                  key={stepCount}
                  onClick={() => {
                    const shift = Math.floor(stepCount / 2);
                    onUpdateConfig({ sequenceLength: stepCount, shiftTimestep: shift });
                    if (currentTimestep > stepCount) onSetTimestep(stepCount);
                  }}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                    config.sequenceLength === stepCount
                      ? "bg-purple-600 border-purple-300 text-white font-bold shadow-sm"
                      : "bg-purple-950/40 border-purple-800/40 text-slate-400 hover:text-white"
                  }`}
                >
                  {stepCount}
                </button>
              ))}
            </div>
          </div>

          {/* Playback & Step Controls */}
          <div className="pt-3 border-t border-purple-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Stream Speed:</span>
              <div className="flex items-center gap-1 bg-[#0d0722] p-1 rounded-xl border border-purple-900/50">
                {([0.5, 1, 2, 4] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-lg cursor-pointer transition-all ${
                      playbackSpeed === spd
                        ? "bg-fuchsia-500 text-white font-bold shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Main playback button bar */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => onSetTimestep(1)}
                className="p-2.5 rounded-2xl purple-glass border border-purple-500/30 hover:border-purple-300 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                title="Rewind to start"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSetTimestep(Math.max(1, currentTimestep - 1))}
                className="p-2.5 rounded-2xl purple-glass border border-purple-500/30 hover:border-purple-300 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                title="Step backward"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2.5 rounded-2xl flex items-center justify-center font-bold cursor-pointer transition-all ${
                  isPlaying
                    ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30"
                    : "btn-purple-glow text-white"
                }`}
                title={isPlaying ? "Pause Stream" : "Play Stream"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white text-white" />}
              </button>

              <button
                onClick={() => onSetTimestep(Math.min(totalSteps, currentTimestep + 1))}
                className="p-2.5 rounded-2xl purple-glass border border-purple-500/30 hover:border-purple-300 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                title="Step forward"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Timeline Scrubber */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Timestep:</span>
                <span className="text-fuchsia-300 font-bold">
                  t = {currentTimestep} / {totalSteps}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max={totalSteps}
                value={currentTimestep}
                onChange={(e) => onSetTimestep(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-purple-950 rounded-lg cursor-pointer accent-fuchsia-400"
              />
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* PANEL 2: MEMORY FORENSICS (6 Cols)                                      */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-6 purple-glass p-5 rounded-3xl border border-purple-500/30 space-y-5 shadow-xl">
          {/* Header with 3D Canvas Switcher */}
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Memory Forensics
              </h3>
            </div>

            <button
              onClick={() => setView3DMode(!view3DMode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono purple-glass border border-purple-500/40 text-purple-200 hover:text-white hover:border-purple-300 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{view3DMode ? "Show Dual Heatmaps" : "Show 3D Graph"}</span>
            </button>
          </div>

          {view3DMode ? (
            /* 3D WebGL Synaptic Network Embedded */
            <div className="space-y-3">
              <Synaptic3DLab currentModelId="bdh_fast_weight" isCompact={false} />
            </div>
          ) : (
            /* Dual Heatmaps View in Luxury Purple (Side-by-Side) */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Heatmap 1: Frozen Base Weights */}
              <div className="p-4 rounded-2xl purple-glass-card border border-amber-500/30 relative space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold text-amber-300">
                      Base Weights W_frozen (4×4)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    🔒 FROZEN • ||ΔW|| = 0.00
                  </span>
                </div>

                {/* 4x4 Grid for W_frozen */}
                <div className="grid grid-cols-4 gap-1.5 bg-[#090414] p-2.5 rounded-xl border border-white/5">
                  {simulation.frozenParameters.weights.map((row, rIdx) =>
                    row.map((val, cIdx) => (
                      <div
                        key={`frozen_${rIdx}_${cIdx}`}
                        onMouseEnter={() =>
                          setHoveredCell({ matrix: "frozen", row: rIdx, col: cIdx, val })
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                        className="h-10 rounded-lg flex flex-col items-center justify-center font-mono text-[11px] font-bold transition-all hover:scale-105 cursor-pointer border border-white/10"
                        style={{ backgroundColor: getCellColor(val, true) }}
                      >
                        <span className="text-slate-100">{val.toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>SHA: {simulation.frozenParameters.hash.slice(0, 16)}...</span>
                  <span className="text-amber-400/80">Params strictly fixed at test time</span>
                </div>
              </div>

              {/* Heatmap 2: Dynamic FastSyn Memory M_t */}
              <div className="p-4 rounded-2xl purple-glass-accent border border-purple-400/40 relative space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw
                      className="w-4 h-4 text-fuchsia-400 animate-spin"
                      style={{ animationDuration: "12s" }}
                    />
                    <span className="text-xs font-mono font-bold text-purple-200">
                      FastSyn Memory M_t (4×4)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/25 text-purple-200 border border-purple-400/40">
                    ↻ ADAPTIVE • ||ΔM_t|| = {currentFastState?.deltaMagnitude.toFixed(3) || "0.000"}
                  </span>
                </div>

                {/* 4x4 Grid for M_t (Luxury Purple Theme) */}
                <div className="grid grid-cols-4 gap-1.5 bg-[#090414] p-2.5 rounded-xl border border-purple-500/20">
                  {currentFastState?.matrix ? (
                    currentFastState.matrix.map((row, rIdx) =>
                      row.map((val, cIdx) => (
                        <div
                          key={`fast_${rIdx}_${cIdx}`}
                          onMouseEnter={() =>
                            setHoveredCell({ matrix: "fastsyn", row: rIdx, col: cIdx, val })
                          }
                          onMouseLeave={() => setHoveredCell(null)}
                          className="h-10 rounded-lg flex flex-col items-center justify-center font-mono text-[11px] font-bold transition-all hover:scale-105 cursor-pointer border border-purple-400/30"
                          style={{ backgroundColor: getCellColor(val, false) }}
                        >
                          <span className="text-white">{val.toFixed(2)}</span>
                        </div>
                      ))
                    )
                  ) : (
                    <div className="col-span-4 py-8 text-center text-xs font-mono text-slate-500">
                      M_0 is initialized to zeros
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>Hebbian plasticity active</span>
                  <span className="text-fuchsia-300 font-bold">
                    RAM Footprint: {currentFastState?.footprintBytes || 64} bytes (CONSTANT)
                  </span>
                </div>
              </div>
            </div>

            {/* Hover Cell Tooltip */}
            {hoveredCell && (
              <div className="p-2.5 rounded-xl bg-[#090414] border border-purple-400/50 text-xs font-mono flex items-center justify-between text-purple-200 animate-in fade-in">
                <span>
                  Inspect [{hoveredCell.matrix === "frozen" ? "W_frozen" : "M_t"}] [Row{" "}
                  {hoveredCell.row}, Col {hoveredCell.col}]:
                </span>
                <span className="font-bold text-white text-sm">
                  {hoveredCell.val.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        )}

          {/* Complexity & Footprint Forensic Comparison Bar */}
          <div className="p-4 rounded-2xl bg-[#090414] border border-purple-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">Memory Complexity at t={currentTimestep}:</span>
              <span className="text-[11px] text-fuchsia-300 font-bold">
                FastSyn O(1) vs KV Cache O(t)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-400/30">
                <span className="text-[10px] text-slate-400 uppercase block">FastSyn Matrix</span>
                <span className="text-sm font-bold text-fuchsia-300">
                  {currentFastState?.footprintBytes || 64} B
                </span>
                <span className="text-[9px] text-purple-300/80 block">CONSTANT O(1)</span>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-400/30">
                <span className="text-[10px] text-slate-400 uppercase block">KV Context Cache</span>
                <span className="text-sm font-bold text-indigo-300">
                  {currentTransState?.footprintBytes || 32 * currentTimestep} B
                </span>
                <span className="text-[9px] text-indigo-300/80 block">LINEAR O(t)</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/30">
                <span className="text-[10px] text-slate-400 uppercase block">SSM Hidden State</span>
                <span className="text-sm font-bold text-emerald-300">
                  {currentSSMState?.footprintBytes || 16} B
                </span>
                <span className="text-[9px] text-emerald-300/80 block">CONSTANT O(1)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* PANEL 3: PERFORMANCE & TELEMETRY (3 Cols)                               */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-3 purple-glass p-5 rounded-3xl border border-purple-500/30 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Performance
              </h3>
            </div>
            <span className="text-[11px] font-mono text-fuchsia-300 font-bold">
              {fastCorrectUpTo} / {currentTimestep} Correct
            </span>
          </div>

          {/* Model Accuracy Leaderboard */}
          <div className="space-y-2.5">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Total Accuracy (Stream):
            </span>

            {/* FastSyn (In Luxury Purple / Fuchsia) */}
            <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-400/40 space-y-1.5 shadow-sm">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-fuchsia-200">FastSyn (Ours)</span>
                <span className="text-sm font-extrabold text-white">
                  {mechFast.accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-purple-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${mechFast.accuracy}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                <span>Pre: {mechFast.preShiftAccuracy.toFixed(0)}%</span>
                <span className="text-fuchsia-300 font-semibold">
                  Post: {mechFast.postShiftAccuracy.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Transformer KV */}
            <div className="p-3 rounded-2xl bg-[#090414] border border-indigo-500/30 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-indigo-300">Transformer KV</span>
                <span className="text-sm font-extrabold text-indigo-200">
                  {mechTrans.accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-purple-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-400 transition-all duration-300"
                  style={{ width: `${mechTrans.accuracy}%` }}
                />
              </div>
            </div>

            {/* SSM */}
            <div className="p-3 rounded-2xl bg-[#090414] border border-emerald-500/30 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-emerald-300">SSM State</span>
                <span className="text-sm font-extrabold text-emerald-200">
                  {mechSSM.accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-purple-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${mechSSM.accuracy}%` }}
                />
              </div>
            </div>

            {/* Static Baseline */}
            <div className="p-3 rounded-2xl bg-[#090414] border border-amber-500/30 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-amber-300">Static Frozen</span>
                <span className="text-sm font-extrabold text-amber-200">
                  {mechStatic.accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-purple-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${mechStatic.accuracy}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                <span>Pre: {mechStatic.preShiftAccuracy.toFixed(0)}%</span>
                <span className="text-rose-400 font-semibold">
                  Post: {mechStatic.postShiftAccuracy.toFixed(0)}% (COLLAPSED)
                </span>
              </div>
            </div>
          </div>

          {/* Current Step Forensic Card */}
          <div className="p-4 rounded-2xl purple-glass-card border border-purple-900/40 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono border-b border-purple-900/40 pb-2">
              <span className="text-slate-400">Step t={currentTimestep} Output:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                  predFast?.correct
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                }`}
              >
                {predFast?.correct ? "CORRECT ✓" : "ERROR ✗"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">Input Token:</span>
                <span className="text-base font-bold text-white">{currentSample?.token}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Ground Truth:</span>
                <span className="text-base font-bold text-emerald-400">
                  {currentSample?.groundTruth}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">FastSyn Predicts:</span>
                <span className="font-bold text-fuchsia-300">
                  {predFast?.predicted} ({( (predFast?.confidence || 0) * 100).toFixed(1)}%)
                </span>
              </div>

              {/* Token probability distribution */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {(["A", "B", "C", "D"] as Token[]).map((tok) => {
                  const prob = predFast?.probabilities[tok] || 0;
                  const isGT = currentSample?.groundTruth === tok;
                  return (
                    <div
                      key={tok}
                      className={`p-1.5 text-center rounded-xl font-mono text-[10px] border ${
                        isGT
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200 font-bold"
                          : "bg-[#090414] border-purple-900/30 text-slate-400"
                      }`}
                    >
                      <div className="font-semibold">{tok}</div>
                      <div>{(prob * 100).toFixed(0)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
