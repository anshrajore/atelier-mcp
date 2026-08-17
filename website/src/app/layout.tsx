import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Atelier — Two-Agent Quality Gate for Vibe-Coded Applications",
  description:
    "Post-generation UI/UX Critic and Backend Architecture Guard with gradeable rulesets, local fine-tuned MLX/GGUF models, and multi-agent IDE adapters.",
  authors: [{ name: "Ansh Rajore", url: "https://github.com/anshrajore" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans bg-[#ffffff] text-[#111827] antialiased selection:bg-[#ff7a00] selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
