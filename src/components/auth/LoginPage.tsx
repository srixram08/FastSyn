"use client";

import React, { useState } from "react";
import { Cpu, ArrowRight, ShieldCheck, KeyRound, Sparkles, ArrowLeft, UserCheck } from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: (user: { name: string; role: string; institution: string }) => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToLanding,
}) => {
  const [email, setEmail] = useState("researcher@dataforge.ai");
  const [name, setName] = useState("Dr. Elena Vance");
  const [institution, setInstitution] = useState("DataForge Cognitive AI Institute");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      name: name.trim() || "Lead Researcher",
      role: "AI Research Fellow",
      institution: institution.trim() || "DataForge Lab",
    });
  };

  const handleGuestLogin = () => {
    onLoginSuccess({
      name: "Guest Researcher",
      role: "Visiting Scholar",
      institution: "Autonomous Intelligence Lab",
    });
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12">
      {/* Intense Vertical Aurora Light Beam Behind Login Card */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[500px] pointer-events-none opacity-60 blur-3xl"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(192, 132, 252, 0.6) 0%, rgba(147, 51, 234, 0.35) 45%, transparent 75%)",
        }}
      />

      {/* Main Glass Login Card */}
      <div className="relative w-full max-w-md purple-glass-accent p-8 rounded-3xl border border-purple-400/40 shadow-2xl space-y-6 z-10 backdrop-blur-3xl">
        {/* Back Button */}
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </button>

        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 p-0.5 mx-auto shadow-lg shadow-purple-500/30 flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-[#0d0722] flex items-center justify-center">
              <Cpu className="w-6 h-6 text-purple-200" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Research <span className="font-serif-luxury italic font-normal text-purple-300">Access Portal</span>
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Sign in to enter the FastSyn inference-time laboratory.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-mono text-slate-300">Researcher Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#090414] border border-purple-500/30 text-xs font-mono text-white focus:outline-none focus:border-purple-400"
              placeholder="e.g. Dr. Jane Doe"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-mono text-slate-300">Institutional Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#090414] border border-purple-500/30 text-xs font-mono text-white focus:outline-none focus:border-purple-400"
              placeholder="name@institution.edu"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-mono text-slate-300">Affiliation / Lab</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#090414] border border-purple-500/30 text-xs font-mono text-white focus:outline-none focus:border-purple-400"
              placeholder="e.g. DataForge AI Institute"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-purple-glow py-3 rounded-full text-xs font-mono font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
          >
            <span>Enter Laboratory Workstation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 pt-1">
          <div className="h-[1px] flex-1 bg-purple-900/40" />
          <span className="text-[10px] font-mono text-slate-500 uppercase">Or</span>
          <div className="h-[1px] flex-1 bg-purple-900/40" />
        </div>

        {/* 1-Click Instant Guest Access */}
        <button
          onClick={handleGuestLogin}
          className="w-full py-2.5 rounded-full purple-glass border border-purple-500/30 hover:border-purple-300 text-xs font-mono text-purple-200 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>Instant Access as Guest Researcher</span>
        </button>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-500 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero Server Storage • Client-Side Mathematical Execution</span>
        </div>
      </div>
    </div>
  );
};
