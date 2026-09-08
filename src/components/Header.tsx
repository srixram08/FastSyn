"use client";

import React from "react";
import { Lock, Play, BookOpen, RotateCcw, Cpu, Sparkles } from "lucide-react";

export type StageId =
  | "hero"
  | "setup"
  | "predict"
  | "experiment"
  | "aha"
  | "compare"
  | "explain"
  | "misconception"
  | "bdh"
  | "limitation"
  | "teachback"
  | "final";

interface HeaderProps {
  currentStage: StageId;
  onSelectStage: (stage: StageId) => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onOpenTechModal: () => void;
  onResetAll: () => void;
}

const STAGES: { id: StageId; label: string; number: string }[] = [
  { id: "hero", label: "Hero", number: "00" },
  { id: "setup", label: "Setup", number: "01" },
  { id: "predict", label: "Predict", number: "02" },
  { id: "experiment", label: "Lab", number: "03" },
  { id: "aha", label: "Aha!", number: "04" },
  { id: "compare", label: "Compare", number: "05" },
  { id: "explain", label: "Explain", number: "06" },
  { id: "misconception", label: "Quiz", number: "07" },
  { id: "bdh", label: "BDH", number: "08" },
  { id: "limitation", label: "Limits", number: "09" },
  { id: "teachback", label: "Teach", number: "10" },
  { id: "final", label: "Finale", number: "11" },
];

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  onSelectStage,
  isDemoMode,
  onToggleDemoMode,
  onOpenTechModal,
  onResetAll,
}) => {
  return (
    <header className="sticky top-0 z-50 liquid-glass border-b border-white/10 shadow-2xl backdrop-blur-2xl">
      {/* Top Iridescent Glow Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Branding & Core Badge */}
        <div className="flex items-center gap-3.5">
          <div
            onClick={() => onSelectStage("hero")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-400 p-0.5 shadow-glow-cyan flex items-center justify-center group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent">
                  FASTSYN
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-bold shadow-sm">
                  3D LAB
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
                Fast Synaptic Adaptation in AI
              </p>
            </div>
          </div>

          {/* Persistent Frozen Model Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border border-amber-500/40 text-amber-300 text-xs font-mono shadow-md">
            <Lock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-bold">MODEL FROZEN:</span>
            <span className="text-amber-200/90 text-[11px]">Weights Fixed • No Backprop</span>
          </div>
        </div>

        {/* Center: Stage Navigation Pills with Liquid Glass Feel */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 px-1.5 rounded-2xl liquid-glass border border-white/10 shadow-inner">
          {STAGES.map((s) => {
            const isActive = currentStage === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectStage(s.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/30 to-teal-500/20 text-cyan-200 border border-cyan-400/50 shadow-glow-cyan font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-[10px] opacity-60 font-semibold">{s.number}</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (Demo Mode, Technical Details, Reset) */}
        <div className="flex items-center gap-2.5">
          {/* Demo Mode Button */}
          <button
            onClick={onToggleDemoMode}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
              isDemoMode
                ? "bg-emerald-400 text-slate-950 font-bold shadow-glow-emerald"
                : "liquid-glass border border-emerald-500/40 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-950/40 shadow-sm"
            }`}
            title="Start 60-Second Guided Tour"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isDemoMode ? "Exit Demo" : "60s Tour"}</span>
          </button>

          {/* Technical Details */}
          <button
            onClick={onOpenTechModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono liquid-glass border border-white/15 text-slate-200 hover:border-cyan-400/50 hover:text-cyan-300 transition-all cursor-pointer shadow-sm"
            title="View Math & Technical Equations"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Equations</span>
          </button>

          {/* Reset */}
          <button
            onClick={onResetAll}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-300 liquid-glass hover:bg-rose-950/40 transition-all border border-white/10 hover:border-rose-500/50 cursor-pointer shadow-sm"
            title="Reset Laboratory State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
