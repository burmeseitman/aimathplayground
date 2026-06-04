/**
 * calculus/math.js — Gradient and derivative computations
 */

// ── Available Functions ─────────────────────────────────────
export const FUNCTIONS = {
  paraboloid: {
    name: 'Paraboloid: x² + y²',
    fn: (x, y) => x * x + y * y,
    range: [-3, 3],
    zScale: 1,
  },
  sincos: {
    name: 'Wave: sin(x)·cos(y)',
    fn: (x, y) => Math.sin(x) * Math.cos(y),
    range: [-Math.PI, Math.PI],
    zScale: 1,
  },
  saddle: {
    name: 'Saddle: x² − y²',
    fn: (x, y) => x * x - y * y,
    range: [-2.5, 2.5],
    zScale: 1,
  },
  rosenbrock: {
    name: 'Rosenbrock (scaled)',
    fn: (x, y) => ((1 - x) ** 2 + 100 * (y - x * x) ** 2) * 0.002,
    range: [-2, 2],
    zScale: 1,
  },
  gaussian: {
    name: 'Gaussian Bump',
    fn: (x, y) => Math.exp(-(x * x + y * y) / 2),
    range: [-3, 3],
    zScale: 2,
  },
};

/**
 * Compute numerical gradient using central differences.
 * @param {function} fn — f(x, y)
 * @param {number} x
 * @param {number} y
 * @param {number} h — step size
 * @returns {{ dx: number, dy: number }}
 */
export function numericalGradient(fn, x, y, h = 0.001) {
  const dx = (fn(x + h, y) - fn(x - h, y)) / (2 * h);
  const dy = (fn(x, y + h) - fn(x, y - h)) / (2 * h);
  return { dx, dy };
}

/**
 * Compute Hessian diagonal (second partial derivatives).
 */
export function hessianDiagonal(fn, x, y, h = 0.001) {
  const fxx = (fn(x + h, y) - 2 * fn(x, y) + fn(x - h, y)) / (h * h);
  const fyy = (fn(x, y + h) - 2 * fn(x, y) + fn(x, y - h)) / (h * h);
  return { fxx, fyy };
}

/**
 * Gradient magnitude.
 */
export function gradientMagnitude(dx, dy) {
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Run gradient descent from a starting point.
 * Returns the path as array of [x, y, z].
 * @param {function} fn
 * @param {number} x0
 * @param {number} y0
 * @param {number} lr — learning rate
 * @param {number} steps
 * @returns {Array<[number, number, number]>}
 */
export function gradientDescentPath(fn, x0, y0, lr, steps = 100) {
  const path = [];
  let x = x0, y = y0;

  for (let i = 0; i < steps; i++) {
    const z = fn(x, y);
    path.push([x, y, z]);

    const { dx, dy } = numericalGradient(fn, x, y);
    x -= lr * dx;
    y -= lr * dy;

    // Clamp to prevent divergence
    x = Math.max(-10, Math.min(10, x));
    y = Math.max(-10, Math.min(10, y));

    // Stop if converged
    if (Math.abs(dx) < 1e-8 && Math.abs(dy) < 1e-8) break;
  }

  path.push([x, y, fn(x, y)]);
  return path;
}

/**
 * Generate gradient field vectors on a grid.
 */
export function gradientField(fn, range, resolution = 8) {
  const [lo, hi] = range;
  const step = (hi - lo) / resolution;
  const vectors = [];

  for (let xi = lo; xi <= hi; xi += step) {
    for (let yi = lo; yi <= hi; yi += step) {
      const { dx, dy } = numericalGradient(fn, xi, yi);
      const z = fn(xi, yi);
      vectors.push({ x: xi, y: yi, z, dx, dy });
    }
  }

  return vectors;
}
