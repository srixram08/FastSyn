import { FrozenParameters, InputSample, MechanismResult, MemoryState, Prediction, Token } from "../types";
import { MathUtils } from "../seedRandom";

const TOKENS: Token[] = ["A", "B", "C", "D"];

/**
 * TRANSFORMER KV MEMORY
 * Contextual memory retains previous token representations in an explicit Key/Value cache.
 * As sequence progresses, KV cache expands linearly O(t * d).
 * Prediction attends over the cached keys to retrieve relevant values.
 */
export function simulateTransformerKV(
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

  // Cached entries: key vector, value vector, token
  const kvCache: { key: number[]; value: number[]; token: Token }[] = [];

  // Fixed learned projection matrices for Q, K, V
  const W_q = [
    [0.8, 0.1, -0.1, 0.0],
    [0.1, 0.8, 0.0, -0.1],
    [-0.1, 0.0, 0.8, 0.1],
    [0.0, -0.1, 0.1, 0.8],
  ];
  const W_k = [
    [0.9, 0.0, 0.0, 0.0],
    [0.0, 0.9, 0.0, 0.0],
    [0.0, 0.0, 0.9, 0.0],
    [0.0, 0.0, 0.0, 0.9],
  ];

  for (const sample of samples) {
    const x = sample.features;
    const baseLogits = MathUtils.vecAdd(
      MathUtils.matVecMul(frozen.weights, x),
      frozen.bias
    );

    // Compute Query
    const q = MathUtils.matVecMul(W_q, x);

    // Retrieve from KV cache if we have past entries
    let contextLogits = [0, 0, 0, 0];
    if (kvCache.length > 0) {
      // Attention scores: alpha_tau = (q . k_tau) / sqrt(d)
      const rawScores = kvCache.map((entry) => MathUtils.dot(q, entry.key) / 2.0);
      const attnWeights = MathUtils.softmax(rawScores);

      // Aggregate retrieved values
      for (let tau = 0; tau < kvCache.length; tau++) {
        const weight = attnWeights[tau];
        const val = kvCache[tau].value;
        contextLogits = MathUtils.vecAdd(contextLogits, MathUtils.vecScale(val, weight));
      }
    }

    // Combined logits: base + context retrieval
    const combinedLogits = MathUtils.vecAdd(
      baseLogits,
      MathUtils.vecScale(contextLogits, 1.2)
    );
    const probs = MathUtils.softmax(combinedLogits);

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

    // Now append new Key and Value for current step
    // Value represents the ground truth association (one-hot target vector)
    const targetIdx = TOKENS.indexOf(sample.groundTruth);
    const valVec = [0, 0, 0, 0];
    valVec[targetIdx] = 2.2;

    const newKey = MathUtils.matVecMul(W_k, x);
    kvCache.push({
      key: newKey,
      value: valVec,
      token: sample.token,
    });

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

    // Memory footprint grows linearly: 2 vectors (key + value) * 4 dims * 4 bytes each = 32 bytes per step
    const footprint = kvCache.length * 32;
    const deltaMag = MathUtils.vecNorm(newKey);

    states.push({
      timestep: sample.timestep,
      mechanismId: "transformer",
      kvEntries: kvCache.slice(-5), // store recent slice for inspection
      deltaMagnitude: Number(deltaMag.toFixed(3)),
      footprintBytes: footprint,
      summary: `KV entries: ${kvCache.length} (Context growth O(N))`,
    });

    cumulativeAccuracy.push(Number(((correctCount / sample.timestep) * 100).toFixed(1)));
    memoryDeltas.push(Number(deltaMag.toFixed(3)));
    memoryFootprints.push(footprint);
  }

  const overallAcc = Number(((correctCount / samples.length) * 100).toFixed(1));
  const preAcc = preTotal > 0 ? Number(((preCorrect / preTotal) * 100).toFixed(1)) : 0;
  const postAcc = postTotal > 0 ? Number(((postCorrect / postTotal) * 100).toFixed(1)) : 0;

  return {
    id: "transformer",
    name: "Transformer KV",
    tagline: "Contextual token cache growing O(N) over sequence length",
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
