/**
 * Deterministic pseudo-random number generator (Mulberry32).
 * Guarantees 100% reproducible sequences across devices and runs.
 */
export class SeededRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  // Returns float in [0, 1)
  nextFloat(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Returns integer in [min, max]
  nextInt(min: number, max: number): number {
    return Math.floor(this.nextFloat() * (max - min + 1)) + min;
  }

  // Choose from weighted distribution
  chooseWeighted<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let r = this.nextFloat() * totalWeight;
    for (let i = 0; i < items.length; i++) {
      if (r < weights[i]) return items[i];
      r -= weights[i];
    }
    return items[items.length - 1];
  }
}

/**
 * Standard vector and matrix mathematical primitives
 */
export const MathUtils = {
  dot(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += a[i] * b[i];
    }
    return sum;
  },

  matVecMul(M: number[][], v: number[]): number[] {
    const rows = M.length;
    const cols = v.length;
    const res = new Array(rows).fill(0);
    for (let i = 0; i < rows; i++) {
      let sum = 0;
      for (let j = 0; j < cols; j++) {
        sum += M[i][j] * v[j];
      }
      res[i] = sum;
    }
    return res;
  },

  vecAdd(a: number[], b: number[]): number[] {
    return a.map((val, i) => val + b[i]);
  },

  vecScale(v: number[], s: number): number[] {
    return v.map((val) => val * s);
  },

  outerProduct(u: number[], v: number[]): number[][] {
    const rows = u.length;
    const cols = v.length;
    const mat: number[][] = [];
    for (let i = 0; i < rows; i++) {
      const row = new Array(cols);
      for (let j = 0; j < cols; j++) {
        row[j] = u[i] * v[j];
      }
      mat.push(row);
    }
    return mat;
  },

  matAdd(A: number[][], B: number[][]): number[][] {
    return A.map((row, i) => row.map((val, j) => val + B[i][j]));
  },

  matScale(A: number[][], s: number): number[][] {
    return A.map((row) => row.map((val) => val * s));
  },

  frobeniusNorm(A: number[][]): number {
    let sumSq = 0;
    for (let i = 0; i < A.length; i++) {
      for (let j = 0; j < A[i].length; j++) {
        sumSq += A[i][j] * A[i][j];
      }
    }
    return Math.sqrt(sumSq);
  },

  vecNorm(v: number[]): number {
    let sum = 0;
    for (let i = 0; i < v.length; i++) sum += v[i] * v[i];
    return Math.sqrt(sum);
  },

  softmax(logits: number[]): number[] {
    const maxVal = Math.max(...logits);
    const exps = logits.map((l) => Math.exp(l - maxVal));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / (sumExps || 1e-8));
  },
};
