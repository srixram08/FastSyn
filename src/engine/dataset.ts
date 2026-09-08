import { InputSample, Token, FrozenParameters, SimulationConfig } from "./types";
import { SeededRNG } from "./seedRandom";

const TOKENS: Token[] = ["A", "B", "C", "D"];

// Base 4-dimensional canonical representations
const BASE_EMBEDDINGS: Record<Token, number[]> = {
  A: [0.92, 0.12, 0.08, 0.05],
  B: [0.15, 0.88, 0.18, 0.10],
  C: [0.08, 0.14, 0.91, 0.15],
  D: [0.10, 0.09, 0.20, 0.89],
};

/**
 * Normalizes vector to unit length
 */
function normalize(v: number[]): number[] {
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => Number((x / norm).toFixed(4)));
}

/**
 * Generates frozen parameters W_frozen and bias b.
 * These were trained on the base regime (A and B dominant).
 * They remain 100% CONSTANT throughout all inference steps.
 */
export function generateFrozenParameters(seed: number): FrozenParameters {
  const rng = new SeededRNG(seed + 999);
  
  // W is pre-trained exclusively on regime A & B.
  // Rows 0 (A) and 1 (B) have learned discriminative features.
  // Rows 2 (C) and 3 (D) have dormant/negative initial weights.
  const weights: number[][] = [
    [ 2.10, -1.20, -0.80, -0.80],
    [-1.20,  2.10, -0.80, -0.80],
    [-0.50, -0.50, -0.20, -0.40],
    [-0.50, -0.50, -0.40, -0.20],
  ];

  // Add small deterministic variance from seed
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      weights[i][j] = Number((weights[i][j] + (rng.nextFloat() * 0.04 - 0.02)).toFixed(3));
    }
  }

  // Pre-shift prior bias towards trained classes A & B
  const bias = [0.45, 0.45, -0.75, -0.75];

  return {
    weights,
    bias,
    hash: "SHA256:7f8e3a2b1c4d9e0f_FROZEN_W",
  };
}

/**
 * Generates a deterministic sequence of InputSamples based on seed and environment shift delta.
 */
export function generateSequence(config: SimulationConfig): InputSample[] {
  const rng = new SeededRNG(config.seed);
  const samples: InputSample[] = [];
  const totalSteps = config.sequenceLength;
  const shiftStep = config.shiftTimestep;

  // Pre-shift tokens: mostly A and B
  const preShiftTokens: Token[] = ["A", "A", "A", "B", "A", "B", "B", "A", "A", "B", "B", "A", "A", "B", "B"];
  // Shifted candidate stream: novel C and D patterns
  const postShiftTokensShifted: Token[] = ["C", "C", "B", "C", "C", "D", "C", "D", "D", "C", "C", "C", "D", "C", "D"];
  const postShiftTokensUnshifted: Token[] = ["A", "B", "A", "A", "B", "B", "A", "B", "A", "A", "B", "B", "A", "A", "B"];

  const delta = Math.max(0, Math.min(1, config.shiftDelta));

  for (let t = 0; t < totalSteps; t++) {
    const isShiftPoint = t === shiftStep;
    const isPostShift = t >= shiftStep;
    const phase = isPostShift ? "after_shift" : "before_shift";

    let token: Token;
    if (!isPostShift) {
      token = preShiftTokens[t % preShiftTokens.length];
    } else {
      // With probability delta, choose from shifted distribution (C/D)
      // Otherwise choose from unshifted distribution (A/B)
      const useShifted = rng.nextFloat() < delta;
      const idx = (t - shiftStep) % postShiftTokensShifted.length;
      token = useShifted ? postShiftTokensShifted[idx] : postShiftTokensUnshifted[idx];
    }

    // Sensory features with slight deterministic jitter
    const baseFeat = BASE_EMBEDDINGS[token];
    const noisyFeat = baseFeat.map((v) => v + (rng.nextFloat() * 0.04 - 0.02));
    const normalizedFeat = normalize(noisyFeat);

    // Ground truth is the true token of the current environment
    const groundTruth = token;

    samples.push({
      id: t + 1,
      timestep: t + 1,
      token,
      features: normalizedFeat,
      groundTruth,
      isShiftPoint,
      phase,
    });
  }

  return samples;
}
