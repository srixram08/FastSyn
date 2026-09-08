"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Navbar, NavTab } from "@/components/navigation/Navbar";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { LoginPage } from "@/components/auth/LoginPage";
import { Stage04Experiment } from "@/components/stages/Stage04Experiment";
import { ComplexityInspector } from "@/components/telemetry/ComplexityInspector";
import { BenchmarkManager } from "@/components/benchmarks/BenchmarkManager";
import { TechnicalDetailsModal } from "@/components/modals/TechnicalDetailsModal";
import { FlowingUpwardBackground } from "@/components/canvas/FlowingUpwardBackground";
import { MultiHeadProbeSection } from "@/components/laboratory/MultiHeadProbeSection";
import { StreamingEdgeLab } from "@/components/streaming/StreamingEdgeLab";
import { runSimulation } from "@/engine/simulation";
import { SimulationConfig } from "@/engine/types";
import { Cpu, ShieldCheck, ArrowUpRight } from "lucide-react";

interface UserProfile {
  name: string;
  role: string;
  institution: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>("landing");
  const [currentTimestep, setCurrentTimestep] = useState<number>(1);
  const [isTechModalOpen, setIsTechModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Restore authenticated user session if available
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("fastsyn_user_session");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("fastsyn_user_session", JSON.stringify(user));
    } catch {
      // Ignore
    }
    setActiveTab("workspace");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("fastsyn_user_session");
    } catch {
      // Ignore
    }
    setActiveTab("landing");
  };

  // Master Arbitrary Simulation Configuration
  const [simConfig, setSimConfig] = useState<SimulationConfig>({
    seed: 42,
    sequenceLength: 30,
    shiftTimestep: 15,
    shiftDelta: 0.85,
    lambdaRetention: 0.86,
    etaUpdate: 0.52,
    ssmDecay: 0.78,
  });

  // Calculate pure mathematical simulation in real time
  const simulation = useMemo(() => {
    return runSimulation(simConfig);
  }, [simConfig]);

  // Clamp current timestep when sequence length changes
  useEffect(() => {
    if (currentTimestep > simConfig.sequenceLength) {
      setCurrentTimestep(simConfig.sequenceLength);
    }
  }, [simConfig.sequenceLength, currentTimestep]);

  // Navigation handlers
  const handleLaunchWorkspace = () => {
    if (currentUser) {
      setActiveTab("workspace");
    } else {
      setActiveTab("login");
    }
  };

  const handleOpenForensics = () => {
    if (currentUser) {
      setActiveTab("forensics");
    } else {
      setActiveTab("login");
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between selection:bg-purple-500/30 relative overflow-x-hidden bg-[#06020e] text-slate-100">
      {/* Perspective Horizon Floor Grid */}
      <div className="fixed inset-0 bg-perspective-grid opacity-60 pointer-events-none z-0" />

      {/* Dynamic Bioluminescent Upward Flowing Synaptic Background */}
      <FlowingUpwardBackground />

      {/* Top Ambient Aurora Glow */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] rounded-full pointer-events-none blur-[140px] opacity-40 z-0"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, rgba(217, 70, 239, 0.25) 45%, rgba(99, 102, 241, 0.15) 75%, transparent 90%)",
        }}
      />

      {/* Sleek Production Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenDocs={() => setIsTechModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Primary Dynamic Views (Landing -> Login -> Dashboard Lab) */}
      <div className="flex-1 relative z-10">
        {/* VIEW 1: LANDING PAGE */}
        {activeTab === "landing" && (
          <HeroSection
            simulation={simulation}
            onOpenWorkspace={handleLaunchWorkspace}
            onOpenForensics={handleOpenForensics}
            onOpenDocs={() => setIsTechModalOpen(true)}
            onOpenMultiHead={() => setActiveTab("multihead")}
            onOpenStreaming={() => setActiveTab("streaming")}
          />
        )}

        {/* VIEW 2: LOGIN ACCESS PORTAL */}
        {activeTab === "login" && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onBackToLanding={() => setActiveTab("landing")}
          />
        )}

        {/* VIEW 3: DASHBOARD LAB & WORKSPACE */}
        {(activeTab === "workspace" || activeTab === "forensics") && (
          <div className="py-4">
            <Stage04Experiment
              simulation={simulation}
              currentTimestep={currentTimestep}
              onSetTimestep={setCurrentTimestep}
              config={simConfig}
              onUpdateConfig={(partial) => setSimConfig((prev) => ({ ...prev, ...partial }))}
              onProceedToAha={() => setActiveTab("telemetry")}
            />
          </div>
        )}

        {/* VIEW 4: COMPLEXITY INSPECTOR */}
        {activeTab === "telemetry" && (
          <div className="py-4">
            <ComplexityInspector simulation={simulation} />
          </div>
        )}

        {/* VIEW 5: BENCHMARKS MANAGER */}
        {activeTab === "benchmarks" && (
          <div className="py-4">
            <BenchmarkManager
              onLoadConfig={(loaded) => setSimConfig(loaded)}
              onNavigateToWorkspace={() => setActiveTab("workspace")}
            />
          </div>
        )}

        {/* VIEW 6: MULTI-HEAD SYNAPTIC BINDING & ASSOCIATIVE PROBE */}
        {activeTab === "multihead" && (
          <div className="py-4">
            <MultiHeadProbeSection simulation={simulation} />
          </div>
        )}

        {/* VIEW 7: STREAMING & EDGE SIMULATION (INFINITE HORIZON & OOM) */}
        {activeTab === "streaming" && (
          <div className="py-4">
            <StreamingEdgeLab />
          </div>
        )}
      </div>

      {/* Technical Formulas & Complexity Drawer */}
      <TechnicalDetailsModal
        isOpen={isTechModalOpen}
        onClose={() => setIsTechModalOpen(false)}
        frozen={simulation.frozenParameters}
      />

      {/* Production Footer (Matching reference image luxury purple feel) */}
      <footer className="relative z-10 purple-glass border-t border-purple-900/30 py-8 text-xs font-mono text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-slate-300">
            <div className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-400/40 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-purple-300" />
            </div>
            <span className="font-bold text-white tracking-wider">FastSyn</span>
            <span className="text-slate-500">• Fast Synaptic Adaptation in AI</span>
          </div>

          <div className="flex items-center gap-2 text-purple-300/80 font-serif-luxury italic text-sm">
            “The weights stay fixed. The memory adapts.”
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Deterministic Math • Constant O(1) Memory</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
