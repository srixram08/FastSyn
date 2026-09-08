import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FastSyn — Fast Synaptic Adaptation in AI",
  description: "An interactive educational laboratory demonstrating inference-time dynamic memory adaptation with frozen model weights. The weights stay fixed. The memory adapts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-lab-950 text-slate-100 min-h-screen bg-lab-grid antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
