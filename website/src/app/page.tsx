import React from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { PositioningSection } from "../components/PositioningSection";
import { ArchitectureSection } from "../components/ArchitectureSection";
import { LiveCritiqueDemo } from "../components/LiveCritiqueDemo";
import { RulesetCoverage } from "../components/RulesetCoverage";
import { BenchmarkScoreboard } from "../components/BenchmarkScoreboard";
import { SupportedTools } from "../components/SupportedTools";
import { AboutAnshRajore } from "../components/AboutAnshRajore";
import { QuickstartSection } from "../components/QuickstartSection";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#111827] selection:bg-[#ff6a00] selection:text-white">
      <Navbar />
      <Hero />
      <PositioningSection />
      <ArchitectureSection />
      <LiveCritiqueDemo />
      <RulesetCoverage />
      <BenchmarkScoreboard />
      <SupportedTools />
      <AboutAnshRajore />
      <QuickstartSection />
      <Footer />
    </main>
  );
}
