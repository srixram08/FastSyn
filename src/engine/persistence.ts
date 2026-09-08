import { ExperimentBenchmark } from "./types";

const STORAGE_KEY_BENCHMARKS = "fastsyn_benchmarks_v2";
const STORAGE_KEY_PREDICTION = "fastsyn_user_prediction_v2";
const STORAGE_KEY_PROGRESS = "fastsyn_user_progress_v2";

export interface UserProgress {
  completedStages: string[];
  lastVisitedStage: string;
  explanationScore?: number;
  teachBackScore?: number;
  runsCount: number;
}

export const LocalStore = {
  getBenchmarks(): ExperimentBenchmark[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY_BENCHMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveBenchmark(benchmark: ExperimentBenchmark): void {
    if (typeof window === "undefined") return;
    try {
      const list = this.getBenchmarks();
      const updated = [benchmark, ...list.filter((b) => b.id !== benchmark.id)].slice(0, 10);
      localStorage.setItem(STORAGE_KEY_BENCHMARKS, JSON.stringify(updated));
    } catch {
      // Ignore storage write quota errors
    }
  },

  deleteBenchmark(id: string): void {
    if (typeof window === "undefined") return;
    try {
      const list = this.getBenchmarks().filter((b) => b.id !== id);
      localStorage.setItem(STORAGE_KEY_BENCHMARKS, JSON.stringify(list));
    } catch {
      // Ignore
    }
  },

  getUserPrediction(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(STORAGE_KEY_PREDICTION);
    } catch {
      return null;
    }
  },

  saveUserPrediction(prediction: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_PREDICTION, prediction);
    } catch {
      // Ignore
    }
  },

  getProgress(): UserProgress {
    if (typeof window === "undefined") {
      return { completedStages: ["hero"], lastVisitedStage: "hero", runsCount: 0 };
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return data
        ? JSON.parse(data)
        : { completedStages: ["hero"], lastVisitedStage: "hero", runsCount: 0 };
    } catch {
      return { completedStages: ["hero"], lastVisitedStage: "hero", runsCount: 0 };
    }
  },

  saveProgress(progress: Partial<UserProgress>): void {
    if (typeof window === "undefined") return;
    try {
      const current = this.getProgress();
      const updated = { ...current, ...progress };
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  },

  clearAll(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY_BENCHMARKS);
      localStorage.removeItem(STORAGE_KEY_PREDICTION);
      localStorage.removeItem(STORAGE_KEY_PROGRESS);
    } catch {
      // Ignore
    }
  },
};
