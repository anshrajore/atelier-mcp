import React from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { PositioningSection } from "../components/PositioningSection";
import { ArchitectureSection } from "../components/ArchitectureSection";
import { LiveCritiqueDemo } from "../components/LiveCritiqueDemo";
import { RulesetCoverage } from "../components/RulesetCoverage";
import { BenchmarkScoreboard } from "../components/BenchmarkScoreboard";
import { SupportedTools } from "../components/SupportedTools";
import { QuickstartSection } from "../components/QuickstartSection";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#060a0f] text-white selection:bg-[#00e5ff] selection:text-[#060a0f]">
      <Navbar />
      <Hero />
      <PositioningSection />
      <ArchitectureSection />
      <LiveCritiqueDemo />
      <RulesetCoverage />
      <BenchmarkScoreboard />
      <SupportedTools />
      <QuickstartSection />
      <Footer />
    </main>
  );
}
