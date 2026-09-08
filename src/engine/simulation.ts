import {
  SimulationConfig,
  SimulationRun,
} from "./types";
import { generateFrozenParameters, generateSequence } from "./dataset";
import { simulateStaticModel } from "./models/staticModel";
import { simulateTransformerKV } from "./models/transformerMemory";
import { simulateSSMMemory } from "./models/ssmMemory";
import { simulateFastWeightMemory } from "./models/fastWeightMemory";

export const DEFAULT_CONFIG: SimulationConfig = {
  seed: 42,
  sequenceLength: 30,
  shiftTimestep: 15,
  shiftDelta: 0.85, // 85% environment shift default
  lambdaRetention: 0.86,
  etaUpdate: 0.52,
  ssmDecay: 0.78,
};

/**
 * Runs the complete deterministic simulation across all four memory mechanisms.
 * Zero hardcoded data. 100% derived from the mathematical simulation engine.
 */
export function runSimulation(userConfig: Partial<SimulationConfig> = {}): SimulationRun {
  const config: SimulationConfig = {
    ...DEFAULT_CONFIG,
    ...userConfig,
  };

  // 1. Generate frozen learned parameters (W_frozen and bias)
  const frozenParameters = generateFrozenParameters(config.seed);

  // 2. Generate sequence of inputs with environmental shift at shiftTimestep
  const samples = generateSequence(config);

  // 3. Simulate all 4 mechanisms on the exact same sequence
  const staticResult = simulateStaticModel(samples, frozenParameters);
  const transformerResult = simulateTransformerKV(samples, frozenParameters);
  const ssmResult = simulateSSMMemory(samples, frozenParameters, config.ssmDecay);
  const fastWeightResult = simulateFastWeightMemory(
    samples,
    frozenParameters,
    config.lambdaRetention,
    config.etaUpdate
  );

  return {
    config,
    samples,
    frozenParameters,
    mechanisms: {
      static: staticResult,
      transformer: transformerResult,
      ssm: ssmResult,
      fastweight: fastWeightResult,
    },
  };
}
