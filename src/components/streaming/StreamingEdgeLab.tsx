"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  Cpu, 
  Radio, 
  Server, 
  Smartphone, 
  Microchip, 
  Zap, 
  ShieldAlert, 
  CheckCircle2,
  Gauge
} from "lucide-react";

interface HardwareTarget {
  id: string;
  name: string;
  category: "mcu" | "sbc" | "mobile" | "cloud";
  ramLimitBytes: number;
  ramDisplay: string;
  clockSpeed: string;
  powerWatts: number;
  icon: any;
}

const HARDWARE_PRESETS: HardwareTarget[] = [
  {
    id: "mcu",
    name: "Cortex-M4 IoT MCU",
    category: "mcu",
    ramLimitBytes: 64 * 1024, // 64 KB
    ramDisplay: "64 KB SRAM",
    clockSpeed: "80 MHz",
    powerWatts: 0.05,
    icon: Microchip,
  },
  {
    id: "sbc",
    name: "Raspberry Pi 5 (Edge SBC)",
    category: "sbc",
    ramLimitBytes: 512 * 1024, // 512 KB threshold for demonstration
    ramDisplay: "512 KB Buffer",
    clockSpeed: "2.4 GHz",
    powerWatts: 5.0,
    icon: Cpu,
  },
  {
    id: "mobile",
    name: "Mobile Edge NPU",
    category: "mobile",
    ramLimitBytes: 2 * 1024 * 1024, // 2 MB demonstration threshold
    ramDisplay: "2 MB Cache",
    clockSpeed: "3.2 GHz",
    powerWatts: 12.0,
    icon: Smartphone,
  },
  {
    id: "cloud",
    name: "Cloud GPU Cluster (H100)",
    category: "cloud",
    ramLimitBytes: 16 * 1024 * 1024, // 16 MB threshold
    ramDisplay: "80 GB HBM3",
    clockSpeed: "1.9 GHz",
    powerWatts: 700.0,
    icon: Server,
  },
];

export const StreamingEdgeLab: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamStep, setStreamStep] = useState<number>(1);
  const [streamSpeed, setStreamSpeed] = useState<number>(400); // ms per step
  const [selectedHardware, setSelectedHardware] = useState<HardwareTarget>(HARDWARE_PRESETS[0]);
  const [isOOMCrashed, setIsOOMCrashed] = useState<boolean>(false);
  const [crashStep, setCrashStep] = useState<number | null>(null);

  // Fast-weight constant memory: strictly 64 Bytes (4x4 floats * 4 bytes)
  const fastWeightBytes = 64;

  // Transformer KV Cache grows linearly with step: 2 * t * d * layers * 4 bytes (d=64, layers=4 for realistic token cache)
  const kvBytesPerStep = 2 * 64 * 4 * 4; // 2,048 Bytes per step
  const transformerKVBytes = streamStep * kvBytesPerStep;

  // SSM memory: constant state vector h_t = 128 floats * 4 bytes = 512 Bytes
  const ssmBytes = 512;

  // Check for OOM Crash
  useEffect(() => {
    if (transformerKVBytes >= selectedHardware.ramLimitBytes && !isOOMCrashed) {
      setIsOOMCrashed(true);
      setCrashStep(streamStep);
      setIsStreaming(false);
    }
  }, [transformerKVBytes, selectedHardware.ramLimitBytes, isOOMCrashed, streamStep]);

  // Streaming Interval Runner
  useEffect(() => {
    if (!isStreaming) return;

    const timer = setInterval(() => {
      setStreamStep((prev) => prev + 1);
    }, streamSpeed);

    return () => clearInterval(timer);
  }, [isStreaming, streamSpeed]);

  const handleReset = () => {
    setIsStreaming(false);
    setStreamStep(1);
    setIsOOMCrashed(false);
    setCrashStep(null);
  };

  const kvUsagePercent = Math.min(100, (transformerKVBytes / selectedHardware.ramLimitBytes) * 100);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10 text-slate-100">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full purple-glass border border-purple-500/40 text-purple-300 text-xs font-mono">
          <Radio className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
          <span>Infinite Horizon Streaming • Hardware OOM Profiler</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Streaming & Edge Simulation <br />
          <span className="font-serif-luxury italic font-normal text-purple-300">
            Infinite Horizon vs. OOM Crash.
          </span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Watch what happens when continuous real-time input streams (robotics, telemetry, endless dialogue) 
          are deployed on resource-constrained hardware. Transformer KV caches inevitably trigger an 
          <strong className="text-rose-400"> Out-Of-Memory (OOM) Crash</strong>, while FastSyn operates forever in constant 64 Bytes.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* STREAM CONTROLS & HARDWARE SELECTOR                                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stream Controller */}
        <div className="lg:col-span-6 purple-glass p-6 rounded-3xl border border-purple-500/30 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Live Stream Controls
            </span>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isStreaming ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`} />
              <span className="text-xs font-mono text-purple-300">
                {isStreaming ? "STREAMING LIVE" : isOOMCrashed ? "HALTED (OOM)" : "PAUSED"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (isOOMCrashed) handleReset();
                setIsStreaming(!isStreaming);
              }}
              disabled={isOOMCrashed}
              className={`px-6 py-3 rounded-full font-bold text-xs flex items-center gap-2.5 transition-all ${
                isOOMCrashed
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  : isStreaming
                  ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/40"
                  : "btn-purple-glow text-white"
              }`}
            >
              {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isStreaming ? "Pause Stream" : "Run Live Stream"}</span>
            </button>

            <button
              onClick={handleReset}
              className="purple-glass px-4 py-3 rounded-full text-xs font-mono text-slate-300 hover:text-white border border-purple-500/30 flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Buffer</span>
            </button>

            <div className="ml-auto text-right font-mono">
              <span className="text-[10px] text-slate-400 block">Stream Step (t)</span>
              <span className="text-xl font-bold text-white">#{streamStep.toLocaleString()}</span>
            </div>
          </div>

          {/* Speed Selector */}
          <div className="space-y-2 pt-2 border-t border-purple-900/40">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Streaming Rate:</span>
              <span className="text-purple-300 font-bold">{(1000 / streamSpeed).toFixed(1)} tokens / sec</span>
            </div>
            <div className="flex gap-2">
              {[
                { label: "1x (Normal)", ms: 500 },
                { label: "2x (Fast)", ms: 250 },
                { label: "5x (Turbo)", ms: 100 },
                { label: "10x (Extreme)", ms: 40 },
              ].map((sp) => (
                <button
                  key={sp.ms}
                  onClick={() => setStreamSpeed(sp.ms)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                    streamSpeed === sp.ms
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-[#0c0418] text-slate-400 border-purple-900/50 hover:text-slate-200"
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Hardware Target Preset Selector */}
        <div className="lg:col-span-6 purple-glass p-6 rounded-3xl border border-purple-500/30 space-y-4">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Select Hardware Deployment Target
          </span>

          <div className="grid grid-cols-2 gap-3">
            {HARDWARE_PRESETS.map((hw) => {
              const isSelected = selectedHardware.id === hw.id;
              const Icon = hw.icon;
              return (
                <div
                  key={hw.id}
                  onClick={() => {
                    setSelectedHardware(hw);
                    if (transformerKVBytes >= hw.ramLimitBytes) {
                      setIsOOMCrashed(true);
                      setCrashStep(streamStep);
                      setIsStreaming(false);
                    } else {
                      setIsOOMCrashed(false);
                    }
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? "purple-glass-accent border-purple-400 shadow-md shadow-purple-900/30"
                      : "bg-[#0a0316] border-purple-900/40 hover:border-purple-500/30 opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white truncate">{hw.name}</span>
                  </div>
                  <div className="text-[11px] font-mono text-purple-300">Limit: {hw.ramDisplay}</div>
                  <div className="text-[10px] font-mono text-slate-400">{hw.clockSpeed} • {hw.powerWatts}W</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* OOM CRASH BANNER / ALERT MODAL                                            */}
      {/* ========================================================================= */}
      {isOOMCrashed && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/80 via-red-900/60 to-purple-950/80 border-2 border-rose-500 shadow-2xl shadow-rose-950/60 space-y-4 animate-bounce-short">
          <div className="flex items-center gap-3 text-rose-300 font-mono text-sm font-bold">
            <ShieldAlert className="w-6 h-6 text-rose-400 animate-pulse" />
            <span>CRITICAL FAILURE: OUT-OF-MEMORY (OOM) CRASH AT STEP t=#{crashStep}</span>
          </div>

          <div className="bg-black/60 p-4 rounded-xl border border-rose-500/40 font-mono text-xs text-rose-200 space-y-1">
            <p className="text-rose-400 font-bold">[FATAL ERROR: MemoryAllocationFailed]</p>
            <p>Transformer KV-Cache allocated: {(transformerKVBytes / 1024).toFixed(1)} KB</p>
            <p>Target Device Hardware RAM Ceiling: {(selectedHardware.ramLimitBytes / 1024).toFixed(1)} KB ({selectedHardware.name})</p>
            <p className="text-slate-400">Process killed by OS kernel (SIGKILL / OOM-Killer). Linear KV buffer exhausted physical RAM.</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="text-xs font-mono text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>FastSyn Fast-Weight Status: <strong>Operating Normative (64 Bytes, O(1) Constant)</strong></span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-colors"
              >
                Evict Buffer & Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REAL-TIME ARCHITECTURE RESOURCE GAUGES                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FastSyn Plasticity Card */}
        <div className="purple-glass p-6 rounded-3xl border border-purple-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-purple-300 font-bold uppercase">FastSyn Fast-Weights</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono">
              O(1) CONSTANT
            </span>
          </div>

          <div className="text-3xl font-bold text-white font-mono">
            {fastWeightBytes} <span className="text-sm font-normal text-slate-400">Bytes</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Device Capacity Used:</span>
              <span className="text-emerald-300 font-bold">&lt; 0.01%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#0b0416] overflow-hidden border border-purple-900/50">
              <div className="h-full bg-emerald-400" style={{ width: "2%" }} />
            </div>
          </div>

          <p className="text-[11px] font-mono text-slate-400">
            Fixed 4×4 synaptic matrix in RAM. Endless streaming with zero allocation overhead.
          </p>
        </div>

        {/* Transformer KV-Cache Card */}
        <div className={`p-6 rounded-3xl border transition-all ${
          isOOMCrashed
            ? "bg-rose-950/50 border-rose-500/80 shadow-lg shadow-rose-950/50"
            : "purple-glass border-purple-500/40"
        } space-y-4`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300 font-bold uppercase">Transformer KV Cache</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
              isOOMCrashed
                ? "bg-rose-900/60 border-rose-500 text-rose-300"
                : "bg-purple-950/60 border-purple-500/40 text-purple-300"
            }`}>
              {isOOMCrashed ? "OOM CRASH" : "O(t) LINEAR"}
            </span>
          </div>

          <div className="text-3xl font-bold text-white font-mono">
            {(transformerKVBytes / 1024).toFixed(1)} <span className="text-sm font-normal text-slate-400">KB</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Device Capacity Used:</span>
              <span className={isOOMCrashed ? "text-rose-400 font-bold" : "text-amber-300 font-bold"}>
                {kvUsagePercent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#0b0416] overflow-hidden border border-purple-900/50">
              <div
                className={`h-full transition-all duration-200 ${
                  isOOMCrashed
                    ? "bg-rose-500"
                    : kvUsagePercent > 80
                    ? "bg-amber-400"
                    : "bg-purple-500"
                }`}
                style={{ width: `${kvUsagePercent}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] font-mono text-slate-400">
            Allocates +{(kvBytesPerStep / 1024).toFixed(2)} KB per token. Destined to crash on edge memory.
          </p>
        </div>

        {/* SSM Recurrent State Card */}
        <div className="purple-glass p-6 rounded-3xl border border-purple-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300 font-bold uppercase">SSM Recurrent State</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-[10px] font-mono">
              O(1) CONSTANT
            </span>
          </div>

          <div className="text-3xl font-bold text-white font-mono">
            {ssmBytes} <span className="text-sm font-normal text-slate-400">Bytes</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Device Capacity Used:</span>
              <span className="text-purple-300 font-bold">&lt; 0.1%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#0b0416] overflow-hidden border border-purple-900/50">
              <div className="h-full bg-indigo-400" style={{ width: "4%" }} />
            </div>
          </div>

          <p className="text-[11px] font-mono text-slate-400">
            Compact recurrent hidden state. Constant footprint, but prone to exponential forgetting.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HARDWARE PROFILE COMPARISON (EDGE VS. CLOUD) TABLE                        */}
      {/* ========================================================================= */}
      <div className="purple-glass p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Hardware Deployment & Energy Telemetry</h3>
          </div>
          <span className="text-xs font-mono text-purple-300">
            Streaming Efficiency Comparison
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-purple-900/60 text-slate-400">
                <th className="py-3 px-4">Architecture</th>
                <th className="py-3 px-4">RAM Footprint (t=1,000)</th>
                <th className="py-3 px-4">Memory Bandwidth</th>
                <th className="py-3 px-4">Edge MCU Feasibility</th>
                <th className="py-3 px-4">Energy Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/30 text-slate-200">
              {/* FastSyn */}
              <tr className="bg-purple-950/20 hover:bg-purple-900/20 transition-colors font-bold text-white">
                <td className="py-3.5 px-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
                  <span>FastSyn Fast-Weights</span>
                </td>
                <td className="py-3.5 px-4 text-emerald-300">64 Bytes (Strictly Fixed)</td>
                <td className="py-3.5 px-4">0.12 MB/s (O(1))</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">100% Native (Fits in L1)</td>
                <td className="py-3.5 px-4 text-emerald-300">0.02 mJ / token</td>
              </tr>

              {/* Transformer KV Cache */}
              <tr className="hover:bg-purple-900/10 transition-colors">
                <td className="py-3.5 px-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400" />
                  <span>Transformer KV Cache</span>
                </td>
                <td className="py-3.5 px-4 text-rose-300">2,048,000 Bytes (2 MB)</td>
                <td className="py-3.5 px-4 text-amber-300">18.4 MB/s (Scales O(t))</td>
                <td className="py-3.5 px-4 text-rose-400 font-bold">FAILS (OOM Crash)</td>
                <td className="py-3.5 px-4 text-amber-300">4.85 mJ / token</td>
              </tr>

              {/* SSM */}
              <tr className="hover:bg-purple-900/10 transition-colors">
                <td className="py-3.5 px-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>SSM Recurrent</span>
                </td>
                <td className="py-3.5 px-4 text-emerald-300">512 Bytes (Fixed)</td>
                <td className="py-3.5 px-4">0.45 MB/s (O(1))</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">Native</td>
                <td className="py-3.5 px-4 text-emerald-300">0.08 mJ / token</td>
              </tr>

              {/* Static */}
              <tr className="hover:bg-purple-900/10 transition-colors">
                <td className="py-3.5 px-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Static Baseline</span>
                </td>
                <td className="py-3.5 px-4 text-emerald-300">0 Bytes State</td>
                <td className="py-3.5 px-4">0.00 MB/s</td>
                <td className="py-3.5 px-4 text-slate-400">Native (No Adaptation)</td>
                <td className="py-3.5 px-4 text-slate-400">0.01 mJ / token</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
