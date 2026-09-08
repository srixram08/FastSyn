"use client";

import React, { useState, useEffect } from "react";
import { BookmarkPlus, Trash2, RotateCcw, ArrowUpRight, BarChart3, Check } from "lucide-react";
import { ExperimentBenchmark, SimulationConfig } from "@/engine/types";
import { LocalStore } from "@/engine/persistence";

interface BenchmarkManagerProps {
  onLoadConfig: (config: SimulationConfig) => void;
  onNavigateToWorkspace: () => void;
}

export const BenchmarkManager: React.FC<BenchmarkManagerProps> = ({
  onLoadConfig,
  onNavigateToWorkspace,
}) => {
  const [benchmarks, setBenchmarks] = useState<ExperimentBenchmark[]>([]);

  useEffect(() => {
    setBenchmarks(LocalStore.getBenchmarks());
  }, []);

  const handleDelete = (id: string) => {
    LocalStore.deleteBenchmark(id);
    setBenchmarks(LocalStore.getBenchmarks());
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div className="border-b border-purple-900/30 pb-6">
        <span className="text-xs font-mono text-purple-300 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30">
          Saved Experiments
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
          Benchmark <span className="font-serif-luxury italic text-purple-300">Archive</span>
        </h2>
        <p className="text-xs font-mono text-slate-400 mt-1">
          Compare saved runs, inspect parameter sensitivity, and restore previous experiment configurations.
        </p>
      </div>

      {benchmarks.length === 0 ? (
        <div className="purple-glass p-12 rounded-3xl text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center mx-auto text-purple-300">
            <BookmarkPlus className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Saved Benchmarks Yet</h3>
          <p className="text-xs font-mono text-slate-400">
            Run an experiment in the workspace and click “Bookmark Run” to preserve parameter configurations and accuracy metrics for comparative analysis.
          </p>
          <button
            onClick={onNavigateToWorkspace}
            className="btn-purple-glow px-6 py-2.5 rounded-full text-xs font-semibold text-white inline-flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Open Workspace</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benchmarks.map((bm) => (
            <div
              key={bm.id}
              className="purple-glass p-6 rounded-3xl border border-purple-500/30 space-y-4 relative group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-mono font-bold text-white">{bm.name}</h4>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(bm.timestamp).toLocaleTimeString()} • N={bm.config.sequenceLength} • Seed {bm.config.seed}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(bm.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Delete benchmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Accuracies comparison */}
              <div className="space-y-2 pt-2 border-t border-purple-900/40 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300 font-bold">FastSyn / BDH:</span>
                  <span className="text-sm font-extrabold text-white">{bm.accuracies.fastweight.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Transformer KV:</span>
                  <span>{bm.accuracies.transformer.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>SSM Memory:</span>
                  <span>{bm.accuracies.ssm.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center text-amber-400/80">
                  <span>Static Baseline:</span>
                  <span>{bm.accuracies.static.toFixed(1)}%</span>
                </div>
              </div>

              {/* Load Configuration CTA */}
              <button
                onClick={() => {
                  onLoadConfig(bm.config);
                  onNavigateToWorkspace();
                }}
                className="w-full py-2 rounded-xl purple-glass border border-purple-500/40 hover:border-purple-300 text-xs font-mono text-purple-200 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                <span>Restore This Run in Workspace</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
