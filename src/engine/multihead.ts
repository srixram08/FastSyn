// Multi-Head Synaptic Binding, Content-Addressable Associative Retrieval & Hopfield Dynamics

import { Matrix4x4 } from "./types";
import { MathUtils } from "./seedRandom";

export interface HeadConfig {
  id: number;
  name: string;
  specialization: string;
  color: string;
  lambda: number;
  eta: number;
}

export interface MultiHeadState {
  headId: number;
  name: string;
  specialization: string;
  matrix: Matrix4x4;
  frobeniusNorm: number;
  activeSparsity: number;
}

export interface AssociativeProbeResult {
  queryVector: [number, number, number, number];
  readoutVector: [number, number, number, number];
  targetVector: [number, number, number, number];
  cosineSimilarity: number;
  retrievalConfidence: number;
  associatedHeadId: number;
}

export interface HopfieldEnergyPoint {
  x: number;
  y: number;
  energy: number;
}

export const DEFAULT_HEAD_CONFIGS: HeadConfig[] = [
  {
    id: 1,
    name: "Head 1: Entity Binding",
    specialization: "Associates entity tokens with categorical attributes and features.",
    color: "#c084fc", // Purple-400
    lambda: 0.92,
    eta: 0.65,
  },
  {
    id: 2,
    name: "Head 2: Temporal Sequence",
    specialization: "Encodes pairwise sequential transitions (x_{t-1} -> x_t) and order.",
    color: "#38bdf8", // Sky-400
    lambda: 0.75,
    eta: 0.85,
  },
  {
    id: 3,
    name: "Head 3: Context Invariance",
    specialization: "Slowly adapting head preserving environmental baseline statistics.",
    color: "#f472b6", // Pink-400
    lambda: 0.98,
    eta: 0.25,
  },
  {
    id: 4,
    name: "Head 4: Distributional Gating",
    specialization: "Novelty detector surging specifically during environment shifts (delta).",
    color: "#fbbf24", // Amber-400
    lambda: 0.60,
    eta: 0.95,
  },
];

/**
 * Initialize 4 independent fast-weight matrices for multi-head decomposition
 */
export function initMultiHeadFastWeights(): Matrix4x4[] {
  return [
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ];
}

/**
 * Update multi-head fast weights at a timestep
 */
export function updateMultiHeadFastWeights(
  heads: Matrix4x4[],
  tokenVector: [number, number, number, number],
  prevTokenVector: [number, number, number, number],
  isShift: boolean
): MultiHeadState[] {
  return DEFAULT_HEAD_CONFIGS.map((cfg, idx) => {
    const prevMat = heads[idx];

    // Compute head-specific outer product update Delta
    let update: Matrix4x4;
    if (cfg.id === 1) {
      // Entity binding: auto-associative outer product
      update = MathUtils.outerProduct(tokenVector, tokenVector) as Matrix4x4;
    } else if (cfg.id === 2) {
      // Temporal order: transition outer product (prev -> curr)
      update = MathUtils.outerProduct(tokenVector, prevTokenVector) as Matrix4x4;
    } else if (cfg.id === 3) {
      // Contextual invariance: smoothed baseline
      update = MathUtils.outerProduct(tokenVector, [0.25, 0.25, 0.25, 0.25]) as Matrix4x4;
    } else {
      // Distributional gating: novelty surge when shift occurs
      const surgeMultiplier = isShift ? 2.5 : 0.4;
      update = MathUtils.outerProduct(
        tokenVector.map((v) => v * surgeMultiplier),
        tokenVector
      ) as Matrix4x4;
    }

    // A^{(h)}_t = lambda^{(h)} A^{(h)}_{t-1} + eta^{(h)} Delta
    const newMat = MathUtils.matAdd(
      MathUtils.matScale(prevMat, cfg.lambda),
      MathUtils.matScale(update, cfg.eta)
    ) as Matrix4x4;
    heads[idx] = newMat;

    // Calculate Frobenius norm
    const fNorm = MathUtils.frobeniusNorm(newMat);
    let nonZeros = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (Math.abs(newMat[r][c]) > 0.01) nonZeros++;
      }
    }

    return {
      headId: cfg.id,
      name: cfg.name,
      specialization: cfg.specialization,
      matrix: newMat,
      frobeniusNorm: fNorm,
      activeSparsity: (16 - nonZeros) / 16,
    };
  });
}

/**
 * Content-Addressable Associative Retrieval Probe
 * Projects query vector q into fast-weight memory: y = A_fast * q
 */
export function probeAssociativeRetrieval(
  matrix: Matrix4x4,
  query: [number, number, number, number],
  target: [number, number, number, number],
  headId: number
): AssociativeProbeResult {
  const readout = MathUtils.matVecMul(matrix, query) as [number, number, number, number];

  const dotVal = MathUtils.dot(readout, target);
  const normR = Math.sqrt(MathUtils.dot(readout, readout));
  const normT = Math.sqrt(MathUtils.dot(target, target));

  const cosineSim = normR > 0.0001 && normT > 0.0001 ? Math.max(-1, Math.min(1, dotVal / (normR * normT))) : 0;
  const confidence = Math.max(0, Math.min(1, (cosineSim + 1) / 2));

  return {
    queryVector: query,
    readoutVector: readout,
    targetVector: target,
    cosineSimilarity: cosineSim,
    retrievalConfidence: confidence,
    associatedHeadId: headId,
  };
}

/**
 * Calculate Continuous Hopfield Energy Landscape Grid (E(x) = -1/2 x^T A x)
 * Evaluates energy over a 2D slice for 3D visualization
 */
export function computeHopfieldLandscape(
  matrix: Matrix4x4,
  gridSize: number = 21
): HopfieldEnergyPoint[][] {
  const grid: HopfieldEnergyPoint[][] = [];
  const range = 2.5;
  const step = (range * 2) / (gridSize - 1);

  for (let i = 0; i < gridSize; i++) {
    const row: HopfieldEnergyPoint[] = [];
    const x = -range + i * step;

    for (let j = 0; j < gridSize; j++) {
      const y = -range + j * step;
      // Evaluate 4D vector slice [x, y, 0.5, 0.5]
      const vec = [x, y, 0.5, 0.5];
      const Ax = MathUtils.matVecMul(matrix, vec);
      const xTAx = MathUtils.dot(vec, Ax);

      // Continuous Hopfield energy well
      const energy = -0.5 * xTAx + 0.15 * (x * x + y * y);

      row.push({ x, y, energy });
    }
    grid.push(row);
  }

  return grid;
}
