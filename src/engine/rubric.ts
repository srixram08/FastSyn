import { RubricEvaluation } from "./types";

/**
 * Transparent conceptual rubric evaluator for the Explanation Challenge:
 * "Why could FastSyn adapt even though its learned weights never changed?"
 */
export function evaluateExplanation(text: string): RubricEvaluation {
  const lower = text.toLowerCase().trim();

  const concepts = [
    {
      id: "fixed_weights",
      label: "Fixed Learned Parameters",
      description: "Recognizes that trained weights (W) stay frozen during inference.",
      keywords: ["frozen", "fixed", "unchanged", "weights stay", "no weight update", "static weights", "same weights", "constant weights"],
      matched: false,
    },
    {
      id: "dynamic_memory",
      label: "Dynamic Inference State",
      description: "Mentions dynamic internal memory, fast-weights, or synaptic state (M_t).",
      keywords: ["dynamic memory", "fast weight", "synaptic", "state", "matrix", "m_t", "inference state", "internal memory", "fast weights"],
      matched: false,
    },
    {
      id: "sequential_adaptation",
      label: "Sequential Adaptation",
      description: "Identifies that incoming inputs adapt the state over time.",
      keywords: ["sequence", "stream", "sequential", "adapt", "inputs", "history", "context", "accumulate", "retention"],
      matched: false,
    },
    {
      id: "no_backprop",
      label: "Zero Backpropagation",
      description: "Understands that adaptation occurs at test time without backprop or gradient descent.",
      keywords: ["no backprop", "no backpropagation", "without backprop", "test time", "inference time", "no gradient", "no retraining", "no training"],
      matched: false,
    },
  ];

  let matchedCount = 0;
  for (const c of concepts) {
    for (const kw of c.keywords) {
      if (lower.includes(kw)) {
        c.matched = true;
        matchedCount++;
        break;
      }
    }
  }

  let feedback = "";
  if (matchedCount === 4) {
    feedback = "Outstanding! You identified all four foundational principles of inference-time dynamic memory.";
  } else if (matchedCount >= 2) {
    feedback = "Solid explanation! Try explicitly highlighting how dynamic memory changes without backpropagation.";
  } else if (lower.length > 10) {
    feedback = "You're on the right track. Remember to mention fixed weights, dynamic inference memory, and zero backprop.";
  } else {
    feedback = "Type your explanation above to evaluate key scientific concepts.";
  }

  return {
    score: matchedCount,
    maxScore: 4,
    allMatched: matchedCount >= 3,
    concepts,
    feedback,
  };
}

/**
 * Evaluates the 20-word Teach-Back challenge:
 * "Explain FastSyn in 20 words or fewer."
 */
export function evaluateTeachBack(text: string): {
  wordCount: number;
  isWithinLimit: boolean;
  score: number;
  maxScore: number;
  checks: { label: string; passed: boolean }[];
  feedback: string;
} {
  const trimmed = text.trim();
  const words = trimmed.length > 0 ? trimmed.split(/\s+/) : [];
  const wordCount = words.length;
  const isWithinLimit = wordCount > 0 && wordCount <= 20;

  const lower = trimmed.toLowerCase();

  const checkFixedWeights = lower.includes("weight") && (lower.includes("fix") || lower.includes("froz") || lower.includes("unchang") || lower.includes("same"));
  const checkMemoryAdapts = (lower.includes("memor") || lower.includes("state") || lower.includes("synap")) && (lower.includes("adapt") || lower.includes("chang") || lower.includes("updat") || lower.includes("dynam"));
  const checkInference = lower.includes("infer") || lower.includes("time") || lower.includes("predict") || lower.includes("train") || lower.includes("backprop") || lower.includes("input");

  const checks = [
    { label: "Weights stay fixed / frozen", passed: checkFixedWeights },
    { label: "Dynamic memory / state adapts", passed: checkMemoryAdapts },
    { label: "Inference-time context or prediction", passed: checkInference },
    { label: "Concise (≤ 20 words)", passed: isWithinLimit },
  ];

  const passedCount = checks.filter((c) => c.passed).length;

  let feedback = "";
  if (wordCount === 0) {
    feedback = "Enter a crisp summary in 20 words or fewer.";
  } else if (wordCount > 20) {
    feedback = `Word limit exceeded (${wordCount}/20 words). Trim your explanation to distill the core essence!`;
  } else if (passedCount === 4) {
    feedback = "Brilliant! You captured the complete essence of FastSyn in an elegant, concise sentence.";
  } else {
    feedback = "Good start! Make sure you contrast the fixed weights against the adapting memory.";
  }

  return {
    wordCount,
    isWithinLimit,
    score: passedCount,
    maxScore: 4,
    checks,
    feedback,
  };
}
