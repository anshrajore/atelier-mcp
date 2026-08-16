import React from 'react';

export function FlawedDashboard() {
  return (
    <div className="min-h-screen bg-[#0b0b14] text-white p-[19px]">
      {/* Violation UI-106: Decorative pulsing headline biscuit badge */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs animate-pulse">
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping" />
          ✨ Introducing AI Copilot 2.0 ✨
        </div>
      </div>

      {/* Violation UI-107 & UI-103: Rainbow gradient text with no tracking */}
      <h1 className="text-4xl font-bold text-center mb-6">
        Supercharge your workflow with{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500">
          Hyper-Intelligent
        </span>{' '}
        Agents
      </h1>

      {/* Violation UI-105 & UI-108: Purple-on-dark over-nested cards */}
      <div className="max-w-4xl mx-auto rounded-2xl border border-purple-500/40 bg-[#09090b] p-6 shadow-[0_0_50px_-12px_rgba(168,85,247,0.4)]">
        <h2 className="text-xl font-semibold mb-4 text-purple-200">System Metrics</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-purple-500/20 bg-[#0f0f1c] p-4">
            <div className="rounded-lg border border-purple-500/10 bg-[#16162a] p-3">
              <span className="text-xs text-gray-400">Total Invocations</span>
              <p className="text-2xl font-bold text-purple-400 mt-1">1,248,910</p>
            </div>
          </div>
          <div className="rounded-xl border border-purple-500/20 bg-[#0f0f1c] p-4">
            <div className="rounded-lg border border-purple-500/10 bg-[#16162a] p-3">
              <span className="text-xs text-gray-400">Accuracy Rate</span>
              <p className="text-2xl font-bold text-pink-400 mt-1">99.4%</p>
            </div>
          </div>
        </div>

        {/* Violation UI-110 & UI-101: Incomplete button states and arbitrary spacing */}
        <div className="mt-[13px] flex justify-end">
          <button className="bg-purple-600 text-white px-5 py-2 rounded-lg">
            Deploy Pipeline
          </button>
        </div>
      </div>
    </div>
  );
}
