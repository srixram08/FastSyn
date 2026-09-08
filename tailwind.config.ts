import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lab: {
          950: "#06080e",
          900: "#0b101b",
          850: "#101726",
          800: "#151f33",
          700: "#22314e",
          600: "#34496f",
        },
        synapse: {
          cyan: "#06b6d4",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
          violet: "#8b5cf6",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "SF Mono", "Fira Code", "Consolas", "monospace"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.45)",
        "glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.45)",
        "glow-amber": "0 0 25px -5px rgba(245, 158, 11, 0.45)",
        "glow-violet": "0 0 25px -5px rgba(139, 92, 246, 0.45)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "synapse-glow": "synapseGlow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        synapseGlow: {
          "0%": { boxShadow: "0 0 8px rgba(6, 182, 212, 0.2)" },
          "100%": { boxShadow: "0 0 22px rgba(6, 182, 212, 0.7)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
