"use client";

import React, { useEffect, useState } from "react";
import { Play, Pause, SkipForward, X, Sparkles, Volume2 } from "lucide-react";
import { StageId } from "../Header";

interface DemoModeRunnerProps {
  isActive: boolean;
  onExit: () => void;
  onSetStage: (stage: StageId) => void;
  onSetTimestep: (t: number) => void;
}

interface DemoPhase {
  startTime: number;
  endTime: number;
  stage: StageId;
  timestep?: number;
  title: string;
  narration: string;
}

const PHASES: DemoPhase[] = [
  {
    startTime: 0,
    endTime: 10,
    stage: "setup",
    title: "1. The Frozen Foundation",
    narration:
      "Learned parameters are mathematically frozen (ΔW = 0). There is zero backpropagation at inference time.",
  },
  {
    startTime: 10,
    endTime: 20,
    stage: "experiment",
    timestep: 6,
    title: "2. Input Stream Begins",
    narration:
      "Tokens flow sequentially. All models predict standard regime classes accurately with low memory delta.",
  },
  {
    startTime: 20,
    endTime: 30,
    stage: "experiment",
    timestep: 16,
    title: "3. Environmental Distribution Shift",
    narration:
      "At t=15, novel tokens arrive. Static weights immediately collapse, but FastSyn synaptic matrix spikes in activity!",
  },
  {
    startTime: 30,
    endTime: 40,
    stage: "aha",
    title: "4. The Aha! Visual Insight",
    narration:
      "The weights stayed fixed. The memory adapted. That changed the prediction.",
  },
  {
    startTime: 40,
    endTime: 50,
    stage: "compare",
    title: "5. Empirical Validation",
    narration:
      "FastSyn achieves 83% post-shift accuracy compared to 20% for static weights, with a constant 64-byte RAM footprint.",
  },
  {
    startTime: 50,
    endTime: 60,
    stage: "final",
    title: "6. Cognitive Synthesis",
    narration:
      "FastSyn proves dynamic inference-time memory enables adaptive intelligence without backpropagation.",
  },
];

export const DemoModeRunner: React.FC<DemoModeRunnerProps> = ({
  isActive,
  onExit,
  onSetStage,
  onSetTimestep,
}) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (!isActive) {
      setSeconds(0);
      return;
    }

    let timer: NodeJS.Timeout | null = null;
    if (!isPaused) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 60) {
            onExit();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, isPaused, onExit]);

  // Sync active phase with UI stage & timestep
  useEffect(() => {
    if (!isActive) return;
    const currentPhase = PHASES.find((p) => seconds >= p.startTime && seconds < p.endTime) || PHASES[0];
    onSetStage(currentPhase.stage);
    if (currentPhase.timestep !== undefined) {
      onSetTimestep(currentPhase.timestep);
    }
  }, [seconds, isActive, onSetStage, onSetTimestep]);

  if (!isActive) return null;

  const currentPhase = PHASES.find((p) => seconds >= p.startTime && seconds < p.endTime) || PHASES[0];
  const progressPercent = (seconds / 60) * 100;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 animate-slideUp">
      <div className="glass-panel-glow p-4 sm:p-5 rounded-2xl border-emerald-500/50 bg-slate-950/95 shadow-2xl space-y-3">
        {/* Top bar: Phase & Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-emerald-300">
              60s Guided Demo Mode
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              ({seconds}s / 60s)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-all"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            </button>

            <button
              onClick={() => {
                const nextPhase = PHASES.find((p) => p.startTime > seconds);
                if (nextPhase) setSeconds(nextPhase.startTime);
                else onExit();
              }}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-all"
              title="Next Section"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onExit}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-400 transition-all"
              title="Exit Demo Mode"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Narration Box */}
        <div className="flex items-start gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono text-xs">
          <Volume2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white mb-0.5">{currentPhase.title}</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {currentPhase.narration}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
