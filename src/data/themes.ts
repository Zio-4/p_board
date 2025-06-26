import type { Theme } from "../types/widget"

export const themes: Theme[] = [
  {
    id: "light",
    name: "Light",
    colors: {
      background: "#f9fafb",
      cardBackground: "#ffffff",
      cardBorder: "#e5e7eb",
      text: "#111827",
      textMuted: "#6b7280",
      accent: "#3b82f6",
      grid: "#e5e7eb",
    },
  },
  {
    id: "dark",
    name: "Dark",
    colors: {
      background: "#0f172a",
      cardBackground: "#1e293b",
      cardBorder: "#334155",
      text: "#f1f5f9",
      textMuted: "#94a3b8",
      accent: "#60a5fa",
      grid: "#334155",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    colors: {
      background: "#000000",
      cardBackground: "#111111",
      cardBorder: "#333333",
      text: "#ffffff",
      textMuted: "#888888",
      accent: "#00ff88",
      grid: "#222222",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: {
      background: "#0c4a6e",
      cardBackground: "#075985",
      cardBorder: "#0284c7",
      text: "#e0f2fe",
      textMuted: "#7dd3fc",
      accent: "#38bdf8",
      grid: "#0369a1",
    },
  },
  {
    id: "forest",
    name: "Forest",
    colors: {
      background: "#14532d",
      cardBackground: "#166534",
      cardBorder: "#16a34a",
      text: "#dcfce7",
      textMuted: "#86efac",
      accent: "#4ade80",
      grid: "#15803d",
    },
  },
]
