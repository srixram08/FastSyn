import { FrozenParameters, InputSample, MechanismResult, MemoryState, Prediction, Token } from "../types";
import { MathUtils } from "../seedRandom";

const TOKENS: Token[] = ["A", "B", "C", "D"];

/**
 * STATE-SPACE MODEL (SSM) MEMORY
 * Recurrent linear state-space formulation:
 *   s_{t+1} = A * s_t + B * x_t
 *   y_t     = C * s_t + W_frozen * x_t + bias
 * Compact, constant memory footprint O(d_state).
 * Continuous decaying state vector.
 */
export function simulateSSMMemory(
  samples: InputSample[],
  frozen: FrozenParameters,
  decayRate = 0.78
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

  // Hidden state vector s_t of dimension 4
  let s_t = [0, 0, 0, 0];

  // SSM Transition parameters
  // A: diagonal decay matrix
  const A = [
    [decayRate, 0.05, 0.0, 0.0],
    [0.0, decayRate, 0.05, 0.0],
    [0.0, 0.0, decayRate, 0.05],
    [0.05, 0.0, 0.0, decayRate],
  ];

  // B: input projection matrix
  const B = [
    [0.45, -0.10, 0.00, 0.00],
    [-0.10, 0.45, -0.10, 0.00],
    [0.00, -0.10, 0.45, -0.10],
    [-0.10, 0.00, -0.10, 0.45],
  ];

  // C: state to logit projection matrix
  const C = [
    [1.1, -0.3, -0.2, -0.1],
    [-0.3, 1.1, -0.2, -0.1],
    [-0.2, -0.2, 1.2, -0.2],
    [-0.1, -0.1, -0.2, 1.2],
  ];

  for (const sample of samples) {
    const x = sample.features;
    const baseLogits = MathUtils.vecAdd(
      MathUtils.matVecMul(frozen.weights, x),
      frozen.bias
    );

    // State readout: C * s_t
    const stateReadout = MathUtils.matVecMul(C, s_t);

    // Total prediction logits
    const combinedLogits = MathUtils.vecAdd(
      baseLogits,
      MathUtils.vecScale(stateReadout, 0.85)
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

    // Recurrent update: s_{t+1} = A * s_t + B * x_t
    const prev_s = [...s_t];
    const decayed_s = MathUtils.matVecMul(A, s_t);
    const inputContribution = MathUtils.matVecMul(B, x);
    s_t = MathUtils.vecAdd(decayed_s, inputContribution);

    // Compute change magnitude ||s_{t+1} - s_t||_2
    const deltaVec = s_t.map((val, idx) => val - prev_s[idx]);
    const deltaMag = MathUtils.vecNorm(deltaVec);

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

    // SSM state size is constant: 4 floats * 4 bytes = 16 bytes
    const footprint = 16;

    states.push({
      timestep: sample.timestep,
      mechanismId: "ssm",
      vector: s_t.map((v) => Number(v.toFixed(3))),
      deltaMagnitude: Number(deltaMag.toFixed(3)),
      footprintBytes: footprint,
      summary: `State vector: [${s_t.map((v) => v.toFixed(2)).join(", ")}]`,
    });

    cumulativeAccuracy.push(Number(((correctCount / sample.timestep) * 100).toFixed(1)));
    memoryDeltas.push(Number(deltaMag.toFixed(3)));
    memoryFootprints.push(footprint);
  }

  const overallAcc = Number(((correctCount / samples.length) * 100).toFixed(1));
  const preAcc = preTotal > 0 ? Number(((preCorrect / preTotal) * 100).toFixed(1)) : 0;
  const postAcc = postTotal > 0 ? Number(((postCorrect / postTotal) * 100).toFixed(1)) : 0;

  return {
    id: "ssm",
    name: "SSM Memory",
    tagline: "s_{t+1} = A*s_t + B*x_t (Continuous recurrent hidden state)",
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
