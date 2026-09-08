import { FrozenParameters, InputSample, MechanismResult, MemoryState, Prediction, Token } from "../types";
import { MathUtils } from "../seedRandom";

const TOKENS: Token[] = ["A", "B", "C", "D"];

/**
 * FAST-WEIGHT / BDH DYNAMIC SYNAPTIC MEMORY
 * The weights stay fixed. The memory adapts.
 *
 * Update rule (simplified educational fast-weight formulation):
 *   M_{t+1} = lambda * M_t + eta * (k_t (x) v_t^T)
 *
 * Prediction:
 *   y_t = softmax( (W_frozen + M_t) * x_t + bias )
 *
 * Notice:
 * - W_frozen NEVER changes (||Delta W|| = 0).
 * - No backpropagation occurs at test time.
 * - Dynamic synaptic matrix M_t adapts rapidly to the streaming environment.
 */
export function simulateFastWeightMemory(
  samples: InputSample[],
  frozen: FrozenParameters,
  lambdaRetention = 0.86,
  etaUpdate = 0.52
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

  // Dynamic memory matrix M_0 of dimension 4x4, initialized to zeros
  let M_t: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (const sample of samples) {
    const x = sample.features;

    // Effective projection: W_eff = W_frozen + M_t
    // Notice: W_frozen is strictly untouched; M_t is added dynamically
    const W_eff = MathUtils.matAdd(frozen.weights, M_t);

    const logits = MathUtils.vecAdd(
      MathUtils.matVecMul(W_eff, x),
      frozen.bias
    );
    const probs = MathUtils.softmax(logits);

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

    // Key and Value features for fast synaptic write
    // Key = current input representation x_t
    // Value = target transition embedding for ground truth
    const targetIdx = TOKENS.indexOf(sample.groundTruth);
    const v_t = [0, 0, 0, 0];
    v_t[targetIdx] = 2.4;

    // Outer product delta: Delta = v_t * k_t^T (outer product of value target and key input)
    const synapticDelta = MathUtils.outerProduct(v_t, x);

    // Fast-weight update: M_{t+1} = lambda * M_t + eta * synapticDelta
    const prev_M = M_t.map((row) => [...row]);
    const decayed_M = MathUtils.matScale(M_t, lambdaRetention);
    const scaled_delta = MathUtils.matScale(synapticDelta, etaUpdate);
    M_t = MathUtils.matAdd(decayed_M, scaled_delta);

    // Compute Frobenius norm of memory matrix change: ||M_{t+1} - M_t||_F
    const diffMat = M_t.map((row, i) => row.map((val, j) => val - prev_M[i][j]));
    const deltaMag = MathUtils.frobeniusNorm(diffMat);

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

    // Footprint: 4x4 matrix of 4-byte floats = 64 bytes
    const footprint = 64;

    states.push({
      timestep: sample.timestep,
      mechanismId: "fastweight",
      matrix: M_t.map((row) => row.map((val) => Number(val.toFixed(3)))),
      deltaMagnitude: Number(deltaMag.toFixed(3)),
      footprintBytes: footprint,
      summary: `M_t matrix (Frobenius norm: ${MathUtils.frobeniusNorm(M_t).toFixed(2)})`,
    });

    cumulativeAccuracy.push(Number(((correctCount / sample.timestep) * 100).toFixed(1)));
    memoryDeltas.push(Number(deltaMag.toFixed(3)));
    memoryFootprints.push(footprint);
  }

  const overallAcc = Number(((correctCount / samples.length) * 100).toFixed(1));
  const preAcc = preTotal > 0 ? Number(((preCorrect / preTotal) * 100).toFixed(1)) : 0;
  const postAcc = postTotal > 0 ? Number(((postCorrect / postTotal) * 100).toFixed(1)) : 0;

  return {
    id: "fastweight",
    name: "FastSyn / BDH Memory",
    tagline: "M_{t+1} = λM_t + η·(k_t ⊗ v_t) (Dynamic synaptic fast-weights)",
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
