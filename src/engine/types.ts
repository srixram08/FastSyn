export type Token = "A" | "B" | "C" | "D";
export type Matrix4x4 = number[][];

export interface InputSample {
  id: number;
  timestep: number;
  token: Token;
  features: number[]; // normalized embedding vector (dimension d=4)
  groundTruth: Token;
  isShiftPoint: boolean;
  phase: "before_shift" | "after_shift";
}

export interface FrozenParameters {
  weights: number[][]; // learned weight matrix W (4x4), strictly frozen during inference
  bias: number[];      // learned bias vector (4)
  hash: string;        // SHA-style fingerprint confirming zero parameter mutations
}

export interface MemoryState {
  timestep: number;
  mechanismId: "static" | "transformer" | "ssm" | "fastweight";
  matrix?: number[][]; // For FastSyn: dynamic 4x4 matrix M_t
  vector?: number[];   // For SSM: hidden state vector s_t
  kvEntries?: { key: number[]; value: number[]; token: Token }[]; // For Transformer
  deltaMagnitude: number; // ||Delta state||_F or L2
  footprintBytes: number; // Dynamic RAM footprint (excluding frozen weights)
  summary: string;
}

export interface Prediction {
  timestep: number;
  token: Token;
  predicted: Token;
  groundTruth: Token;
  probabilities: Record<Token, number>;
  correct: boolean;
  confidence: number;
}

export interface MechanismResult {
  id: "static" | "transformer" | "ssm" | "fastweight";
  name: string;
  tagline: string;
  predictions: Prediction[];
  states: MemoryState[];
  accuracy: number; // overall percentage (0-100)
  preShiftAccuracy: number;
  postShiftAccuracy: number;
  cumulativeAccuracy: number[]; // accuracy up to timestep t
  memoryDeltas: number[];       // magnitude of memory change at each timestep
  memoryFootprints: number[];   // bytes over time
}

export interface SimulationConfig {
  seed: number;
  sequenceLength: number;
  shiftTimestep: number; // timestep where environmental shift begins (e.g. 15)
  shiftDelta: number;    // environment shift intensity: 0.0 (0%) to 1.0 (100%)
  lambdaRetention: number; // lambda: fast-weight retention rate [0.0 - 1.0]
  etaUpdate: number;       // eta: fast-weight update strength [0.0 - 1.0]
  ssmDecay: number;        // SSM transition decay [0.0 - 1.0]
}

export interface SimulationRun {
  config: SimulationConfig;
  samples: InputSample[];
  frozenParameters: FrozenParameters;
  mechanisms: {
    static: MechanismResult;
    transformer: MechanismResult;
    ssm: MechanismResult;
    fastweight: MechanismResult;
  };
}

export interface ConceptMatch {
  id: string;
  label: string;
  description: string;
  matched: boolean;
  keywords: string[];
}

export interface RubricEvaluation {
  score: number;
  maxScore: number;
  allMatched: boolean;
  concepts: ConceptMatch[];
  feedback: string;
}

export type ModelId =
  | "static"
  | "transformer"
  | "ssm"
  | "fastweight"
  | "bdh_fast_weight"
  | "transformer_kv"
  | "ssm_state"
  | "static_baseline";

export interface ExperimentBenchmark {
  id: string;
  name: string;
  timestamp: number;
  config: SimulationConfig;
  accuracies: {
    fastweight: number;
    transformer: number;
    ssm: number;
    static: number;
  };
  footprints: {
    fastweightBytes: number;
    transformerBytes: number;
    ssmBytes: number;
    staticBytes: number;
  };
}

