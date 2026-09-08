import { FrozenParameters, InputSample, MechanismResult, MemoryState, Prediction, Token } from "../types";
import { MathUtils } from "../seedRandom";

const TOKENS: Token[] = ["A", "B", "C", "D"];

/**
 * STATIC WEIGHTS MODEL
 * Baseline model with NO inference-time memory.
 * Weights remain frozen. Memory state = 0.
 * Prediction relies purely on static W_frozen * x + b.
 */
export function simulateStaticModel(
  samples: InputSample[],
  frozen: FrozenParameters
): MechanismResult {
  const predictions: Prediction[] = [];
  const states: MemoryState[] = [];
  let correctCount = 0;
  const cumulativeAccuracy: number[] = [];
  const memoryDeltas: number[] = [];
  const memoryFootprints: number[] = [];

  let preCorrect = 0;
  let preTotal = 0;
  let postCorrect = 0;
  let postTotal = 0;

  for (const sample of samples) {
    // Forward pass: y = W_frozen * x + bias
    const logits = MathUtils.matVecMul(frozen.weights, sample.features);
    const logitsWithBias = MathUtils.vecAdd(logits, frozen.bias);
    const probs = MathUtils.softmax(logitsWithBias);

    // Pick argmax
    let maxIdx = 0;
    let maxProb = probs[0];
    for (let i = 1; i < probs.length; i++) {
      if (probs[i] > maxProb) {
        maxProb = probs[i];
        maxIdx = i;
      }
    }

    const predictedToken = TOKENS[maxIdx];
    const isCorrect = predictedToken === sample.groundTruth;
    if (isCorrect) correctCount++;

    if (sample.phase === "before_shift") {
      preTotal++;
      if (isCorrect) preCorrect++;
    } else {
      postTotal++;
      if (isCorrect) postCorrect++;
    }

    const probMap: Record<Token, number> = {
      A: Number(probs[0].toFixed(3)),
      B: Number(probs[1].toFixed(3)),
      C: Number(probs[2].toFixed(3)),
      D: Number(probs[3].toFixed(3)),
    };

    predictions.push({
      timestep: sample.timestep,
      token: sample.token,
      predicted: predictedToken,
      groundTruth: sample.groundTruth,
      probabilities: probMap,
      correct: isCorrect,
      confidence: Number(maxProb.toFixed(3)),
    });

    // Static memory state: literally unchanged (magnitude = 0, size = 0)
    states.push({
      timestep: sample.timestep,
      mechanismId: "static",
      deltaMagnitude: 0,
      footprintBytes: 0,
      summary: "State: unchanged (no dynamic memory)",
    });

    cumulativeAccuracy.push(Number(((correctCount / sample.timestep) * 100).toFixed(1)));
    memoryDeltas.push(0);
    memoryFootprints.push(0);
  }

  const overallAcc = Number(((correctCount / samples.length) * 100).toFixed(1));
  const preAcc = preTotal > 0 ? Number(((preCorrect / preTotal) * 100).toFixed(1)) : 0;
  const postAcc = postTotal > 0 ? Number(((postCorrect / postTotal) * 100).toFixed(1)) : 0;

  return {
    id: "static",
    name: "Static Weights",
    tagline: "Input → Fixed Model → Prediction (No dynamic memory)",
    predictions,
    states,
    accuracy: overallAcc,
    preShiftAccuracy: preAcc,
    postShiftAccuracy: postAcc,
    cumulativeAccuracy,
    memoryDeltas,
    memoryFootprints,
  };
}
