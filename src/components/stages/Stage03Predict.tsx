"use client";

import React, { useState } from "react";
import { HelpCircle, CheckCircle2, ArrowRight, Brain, Layers, Activity, Lock } from "lucide-react";

interface Stage03PredictProps {
  userPrediction: string | null;
  onSelectPrediction: (id: string) => void;
  onProceedToLab: () => void;
}

interface MechanismOption {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  stateType: string;
  theorySummary: string;
}

const OPTIONS: MechanismOption[] = [
  {
    id: "static",
    name: "Static Weights",
    subtitle: "Input → Fixed Model → Prediction",
    badge: "Baseline",
    icon: <Lock className="w-5 h-5 text-amber-400" />,
    stateType: "No dynamic state (0 bytes)",
    theorySummary: "Relies entirely on fixed learned parameters W_frozen. Has zero inference-time adaptation.",
  },
  {
    id: "transformer",
    name: "Transformer KV Memory",
    subtitle: "Contextual Key/Value Cache",
    badge: "O(N) Context",
    icon: <Layers className="w-5 h-5 text-blue-400" />,
    stateType: "Growing KV tokens cache",
    theorySummary: "Caches past input representations and values, attending back over previous context steps.",
  },
  {
    id: "ssm",
    name: "SSM Memory",
    subtitle: "Continuous Linear State-Space",
    badge: "O(1) Vector",
    icon: <Activity className="w-5 h-5 text-emerald-400" />,
    stateType: "Recurrent state vector s_t",
    theorySummary: "Updates a compact continuous hidden state vector s_{t+1} = A*s_t + B*x_t at each step.",
  },
  {
    id: "fastweight",
    name: "Fast-Weight / BDH Memory",
    subtitle: "Dynamic Synaptic Fast-Weights",
    badge: "Matrix Plasticity",
    icon: <Brain className="w-5 h-5 text-cyan-400" />,
    stateType: "Dynamic matrix M_t (4×4)",
    theorySummary: "Updates an inference-time synaptic matrix via outer-product plasticity without altering W_frozen.",
  },
];

export const Stage03Predict: React.FC<Stage03PredictProps> = ({
  userPrediction,
  onSelectPrediction,
  onProceedToLab,
}) => {
  const [selected, setSelected] = useState<string | null>(userPrediction);

  const handleChoose = (id: string) => {
    setSelected(id);
    onSelectPrediction(id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Question Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>STAGE 02 • PREDICT & COMMIT</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
          Make Your Scientific Prediction
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto mt-2 text-sm sm:text-base">
          Before entering the laboratory, commit your hypothesis to establish the{" "}
          <span className="text-cyan-300 font-mono font-semibold">Predict → Observe → Explain</span> learning cycle.
        </p>
      </div>

      {/* Core Question Card */}
      <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl border-cyan-500/30 mb-8 text-center bg-slate-900/80">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
          The Central Research Question
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-white mt-2 mb-3">
          “Which mechanism will adapt fastest when the input pattern changes?”
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 font-mono">
          All models share identical frozen weights <span className="text-amber-300 font-bold">W_frozen</span>. None use backpropagation.
        </p>
      </div>

      {/* 4 Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => handleChoose(opt.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-cyan-950/40 border-cyan-400 shadow-glow-cyan transform scale-[1.01]"
                  : "glass-panel border-slate-800 hover:border-slate-700 hover:bg-slate-900/50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      {opt.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{opt.name}</h4>
                      <p className="text-[11px] font-mono text-slate-400">{opt.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 fill-cyan-950" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                    )}
                  </div>
                </div>

                <div className="inline-block px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300 mb-2">
                  {opt.stateType}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {opt.theorySummary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono flex justify-between items-center text-slate-400">
                <span>Architecture</span>
                <span className="text-slate-300">{opt.badge}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation & CTA */}
      <div className="flex flex-col items-center gap-3">
        <button
          disabled={!selected}
          onClick={onProceedToLab}
          className={`px-8 py-4 rounded-xl font-bold font-mono text-sm tracking-wide flex items-center gap-3 transition-all ${
            selected
              ? "bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-glow-cyan transform hover:-translate-y-0.5"
              : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
          }`}
        >
          <span>{selected ? "Lock In Prediction & Open Laboratory" : "Select a Hypothesis to Continue"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {selected && (
          <p className="text-xs font-mono text-emerald-400/90 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Hypothesis committed! Your answer is sealed until after the experiment.
          </p>
        )}
      </div>
    </div>
  );
};
