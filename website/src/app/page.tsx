import React from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { InteractivePlayground } from "../components/InteractivePlayground";
import { IDESetupMatrix } from "../components/IDESetupMatrix";
import { PositioningSection } from "../components/PositioningSection";
import { ArchitectureSection } from "../components/ArchitectureSection";
import { LiveCritiqueDemo } from "../components/LiveCritiqueDemo";
import { RulesetCoverage } from "../components/RulesetCoverage";
import { BenchmarkScoreboard } from "../components/BenchmarkScoreboard";
import { SupportedTools } from "../components/SupportedTools";
import { AboutAnshRajore } from "../components/AboutAnshRajore";
import { QuickstartSection } from "../components/QuickstartSection";
import { GuideSection } from "../components/GuideSection";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#090d16] text-[#111827] dark:text-[#f1f5f9] selection:bg-[#ff6a00] selection:text-white transition-colors duration-300">
      <Navbar />
      <Hero />
      <InteractivePlayground />
      <IDESetupMatrix />
      <PositioningSection />
      <ArchitectureSection />
      <LiveCritiqueDemo />
      <RulesetCoverage />
      <BenchmarkScoreboard />
      <SupportedTools />
      <AboutAnshRajore />
      <QuickstartSection />
      <GuideSection />
      <Footer />
    </main>
  );
}
