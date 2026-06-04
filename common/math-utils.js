/**
 * math-utils.js — Shared math utilities for AI Math Toolkits
 */

// ══════════════════════════════════════════════════════════════
//  MATRIX OPERATIONS (row-major flat arrays)
// ══════════════════════════════════════════════════════════════

/**
 * Multiply 3×3 matrix M by 3-vector v.  M is flat [m00,m01,m02,...,m22].
 * @param {number[]} M  - 9-element flat matrix
 * @param {number[]} v  - 3-element vector
 * @returns {number[]}  - resulting 3-element vector
 */
export function mat3MulVec3(M, v) {
  return [
    M[0] * v[0] + M[1] * v[1] + M[2] * v[2],
    M[3] * v[0] + M[4] * v[1] + M[5] * v[2],
    M[6] * v[0] + M[7] * v[1] + M[8] * v[2],
  ];
}

/**
 * Multiply two 3×3 matrices (both flat 9-element arrays).
 */
export function mat3Mul(A, B) {
  const R = new Array(9);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      R[i * 3 + j] =
        A[i * 3 + 0] * B[0 * 3 + j] +
        A[i * 3 + 1] * B[1 * 3 + j] +
        A[i * 3 + 2] * B[2 * 3 + j];
    }
  }
  return R;
}

/**
 * Transpose a 3×3 flat matrix.
 */
export function mat3Transpose(M) {
  return [M[0], M[3], M[6], M[1], M[4], M[7], M[2], M[5], M[8]];
}

/**
 * Determinant of a 3×3 flat matrix.
 */
export function mat3Det(M) {
  return (
    M[0] * (M[4] * M[8] - M[5] * M[7]) -
    M[1] * (M[3] * M[8] - M[5] * M[6]) +
    M[2] * (M[3] * M[7] - M[4] * M[6])
  );
}

/**
 * Trace of a 3×3 flat matrix.
 */
export function mat3Trace(M) {
  return M[0] + M[4] + M[8];
}

/**
 * Identity 3×3 flat matrix.
 */
export function mat3Identity() {
  return [1, 0, 0, 0, 1, 0, 0, 0, 1];
}

// ══════════════════════════════════════════════════════════════
//  EIGENVALUE APPROXIMATION (power iteration for dominant eigenvalue)
// ══════════════════════════════════════════════════════════════

/**
 * Power iteration to find the dominant eigenvector of M (3×3 flat).
 * Returns { eigenvalue, eigenvector } after `iters` iterations.
 */
export function powerIteration(M, iters = 100) {
  let v = [1, 1, 1];
  v = vec3Normalize(v);
  let eigenvalue = 0;

  for (let i = 0; i < iters; i++) {
    const Mv = mat3MulVec3(M, v);
    eigenvalue = vec3Magnitude(Mv);
    if (eigenvalue < 1e-10) break;
    v = Mv.map((c) => c / eigenvalue);
  }

  // Determine sign via Rayleigh quotient
  const Mv = mat3MulVec3(M, v);
  const rayleigh = vec3Dot(v, Mv);
  eigenvalue = rayleigh;

  return { eigenvalue, eigenvector: v };
}

/**
 * Approximate all 3 eigenvalues using characteristic equation.
 * Uses the cubic formula for 3×3 matrices.
 */
export function eigenvalues3x3(M) {
  const a = M[0], b = M[1], c = M[2];
  const d = M[3], e = M[4], f = M[5];
  const g = M[6], h = M[7], k = M[8];

  // Coefficients of characteristic polynomial: -λ³ + pλ² + qλ + r = 0
  const p = a + e + k; // trace
  const q =
    b * d + c * g + f * h - a * e - a * k - e * k;
  const r = mat3Det(M);

  // Solve λ³ - pλ² - qλ - r = 0  using Cardano/trigonometric method
  const p3 = p / 3;
  const Q = (p * p + 3 * q) / 9;
  const R = (2 * p * p * p + 9 * p * q + 27 * r) / 54;

  // Degenerate case: all eigenvalues equal (e.g. scalar × identity)
  if (Math.abs(Q) < 1e-10) {
    return [p3, p3, p3];
  }

  if (Q * Q * Q < R * R) {
    // One real root (return approximation)
    const A = -Math.sign(R) * Math.cbrt(Math.abs(R) + Math.sqrt(R * R - Q * Q * Q));
    const B = Math.abs(A) > 1e-10 ? Q / A : 0;
    return [A + B + p3, NaN, NaN];
  }

  const QQQ = Q * Q * Q;
  const cosArg = Math.max(-1, Math.min(1, R / Math.sqrt(QQQ))); // Clamp for numerical safety
  const theta = Math.acos(cosArg);
  const sqrtQ = Math.sqrt(Q);

  return [
    -2 * sqrtQ * Math.cos(theta / 3) + p3,
    -2 * sqrtQ * Math.cos((theta + 2 * Math.PI) / 3) + p3,
    -2 * sqrtQ * Math.cos((theta - 2 * Math.PI) / 3) + p3,
  ].sort((a, b) => b - a);
}

// ══════════════════════════════════════════════════════════════
//  VECTOR OPERATIONS
// ══════════════════════════════════════════════════════════════

export function vec3Dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function vec3Cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function vec3Magnitude(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

export function vec3Normalize(v) {
  const m = vec3Magnitude(v);
  return m > 1e-10 ? [v[0] / m, v[1] / m, v[2] / m] : [0, 0, 0];
}

export function vec3Scale(v, s) {
  return [v[0] * s, v[1] * s, v[2] * s];
}

export function vec3Add(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function vec3Sub(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

// ══════════════════════════════════════════════════════════════
//  STATISTICS
// ══════════════════════════════════════════════════════════════

export function mean(arr) {
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

export function variance(arr) {
  const m = mean(arr);
  return arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
}

export function stddev(arr) {
  return Math.sqrt(variance(arr));
}

/**
 * Univariate Gaussian PDF.
 */
export function gaussianPDF(x, mu = 0, sigma = 1) {
  const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
  const exponent = -0.5 * ((x - mu) / sigma) ** 2;
  return coeff * Math.exp(exponent);
}

/**
 * Bivariate Gaussian PDF.
 */
export function bivariateGaussianPDF(x, y, muX, muY, sigX, sigY, rho) {
  const z1 = (x - muX) / sigX;
  const z2 = (y - muY) / sigY;
  const rhoSq = rho * rho;
  const denom = 2 * Math.PI * sigX * sigY * Math.sqrt(1 - rhoSq);
  const exponent =
    (-1 / (2 * (1 - rhoSq))) * (z1 * z1 - 2 * rho * z1 * z2 + z2 * z2);
  return Math.exp(exponent) / denom;
}

/**
 * Box-Muller transform — generate two standard normal samples.
 */
export function boxMuller() {
  const u1 = Math.random();
  const u2 = Math.random();
  const r = Math.sqrt(-2 * Math.log(u1));
  return [r * Math.cos(2 * Math.PI * u2), r * Math.sin(2 * Math.PI * u2)];
}

/**
 * Generate correlated bivariate normal sample.
 */
export function bivariateSample(muX, muY, sigX, sigY, rho) {
  const [z1, z2] = boxMuller();
  const x = muX + sigX * z1;
  const y = muY + sigY * (rho * z1 + Math.sqrt(1 - rho * rho) * z2);
  return [x, y];
}

// ══════════════════════════════════════════════════════════════
//  INTERPOLATION
// ══════════════════════════════════════════════════════════════

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// ══════════════════════════════════════════════════════════════
//  NUMBER FORMATTING
// ══════════════════════════════════════════════════════════════

export function fmt(n, decimals = 4) {
  if (typeof n !== 'number' || isNaN(n)) return '—';
  return n.toFixed(decimals);
}
