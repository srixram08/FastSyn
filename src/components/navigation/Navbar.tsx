"use client";

import React from "react";
import { Cpu, ArrowUpRight, BookOpen, LogOut, UserCheck } from "lucide-react";

export type NavTab = "landing" | "login" | "dashboard" | "workspace" | "forensics" | "multihead" | "streaming" | "telemetry" | "benchmarks";

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenDocs: () => void;
  currentUser: { name: string; role: string; institution: string } | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenDocs,
  currentUser,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Floating Glass Pill Container */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between purple-glass px-5 py-3 rounded-full border border-purple-500/30 shadow-2xl backdrop-blur-2xl">
        {/* Brand Logo (Matching Neura style from reference) */}
        <div
          onClick={() => onSelectTab("landing")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-400 p-0.5 shadow-lg shadow-purple-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-[#0d0722] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-purple-300" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-purple-200 via-fuchsia-200 to-indigo-200 bg-clip-text text-transparent">
              FastSyn
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300 font-bold hidden sm:inline">
              AI LAB
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
          {currentUser ? (
            // Authenticated Navigation Links
            [
              { id: "landing", label: "Overview" },
              { id: "workspace", label: "Workspace" },
              { id: "multihead", label: "Multi-Head Probe" },
              { id: "streaming", label: "Infinite Stream & OOM" },
              { id: "telemetry", label: "Telemetry" },
              { id: "benchmarks", label: "Benchmarks" },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as NavTab)}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    isActive
                      ? "bg-purple-500/20 text-purple-200 border border-purple-400/50 font-semibold shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              );
            })
          ) : (
            // Landing Page Navigation Links
            [
              { id: "landing", label: "Home" },
              { id: "multihead", label: "Multi-Head" },
              { id: "streaming", label: "Edge OOM" },
              { id: "telemetry", label: "Complexity" },
              { id: "benchmarks", label: "Benchmarks" },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as NavTab)}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    isActive
                      ? "bg-purple-500/20 text-purple-200 border border-purple-400/50 font-semibold shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              );
            })
          )}
        </nav>

        {/* Right: Technical Docs & Authentication CTA */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-purple-300 hover:text-white border border-purple-500/30 hover:border-purple-400 hover:bg-purple-950/40 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Formulas</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <div
                onClick={() => onSelectTab("workspace")}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full purple-glass border border-purple-500/40 cursor-pointer hover:border-purple-300 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-purple-200 font-bold hidden sm:inline">
                  {currentUser.name}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-full purple-glass border border-purple-900/40 hover:border-rose-500/50 hover:bg-rose-950/30 text-slate-400 hover:text-rose-300 transition-all cursor-pointer"
                title="Sign Out of Lab"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onSelectTab("login")}
              className="btn-purple-glow px-5 py-1.5 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
