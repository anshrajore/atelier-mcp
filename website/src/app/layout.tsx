import type { Metadata } from "next";
import { Orbitron, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Atelier — Two-Agent Quality Gate for Vibe-Coded Applications",
  description:
    "Post-generation UI/UX Critic and Backend Architecture Guard with gradeable rulesets, local fine-tuned MLX/GGUF models, and multi-agent IDE adapters.",
  keywords: [
    "AI Code Quality",
    "UI/UX Critic",
    "Backend Architecture Guard",
    "MCP Server",
    "Vibe Coding",
    "Cursor Rules",
    "Windsurf Rules",
    "Claude Code",
    "Antigravity",
    "Fine-Tuned Model",
  ],
  authors: [{ name: "Ansh Rajore", url: "https://github.com/anshrajore" }],
  openGraph: {
    title: "Atelier — Two-Agent Quality Gate for Vibe-Coded Applications",
    description:
      "Post-generation UI/UX Critic and Backend Architecture Guard with gradeable rulesets and local fine-tuned models.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${orbitron.variable} ${jetbrainsMono.variable} ${inter.variable} bg-[#060a0f] text-[#ffffff] antialiased selection:bg-[#00e5ff] selection:text-[#060a0f]`}
      >
        {children}
      </body>
    </html>
  );
}
