/**
 * optimization/math.js — Optimizer algorithms and loss functions
 */

// ══════════════════════════════════════════════════════════════
//  LOSS LANDSCAPE FUNCTIONS
// ══════════════════════════════════════════════════════════════

export const LOSS_FUNCTIONS = {
  rosenbrock: {
    name: 'Rosenbrock',
    fn: (x, y) => (1 - x) ** 2 + 100 * (y - x * x) ** 2,
    range: [-2, 2],
    zScale: 0.002,
    minimum: [1, 1],
  },
  rastrigin: {
    name: 'Rastrigin',
    fn: (x, y) => 20 + x * x - 10 * Math.cos(2 * Math.PI * x) + y * y - 10 * Math.cos(2 * Math.PI * y),
    range: [-4, 4],
    zScale: 0.05,
    minimum: [0, 0],
  },
  ackley: {
    name: 'Ackley',
    fn: (x, y) => {
      const a = 20, b = 0.2, c = 2 * Math.PI;
      return -a * Math.exp(-b * Math.sqrt(0.5 * (x * x + y * y))) -
        Math.exp(0.5 * (Math.cos(c * x) + Math.cos(c * y))) + a + Math.E;
    },
    range: [-4, 4],
    zScale: 0.15,
    minimum: [0, 0],
  },
  beale: {
    name: 'Beale',
    fn: (x, y) =>
      (1.5 - x + x * y) ** 2 +
      (2.25 - x + x * y * y) ** 2 +
      (2.625 - x + x * y * y * y) ** 2,
    range: [-4, 4],
    zScale: 0.0005,
    minimum: [3, 0.5],
  },
};

// ══════════════════════════════════════════════════════════════
//  NUMERICAL GRADIENT
// ══════════════════════════════════════════════════════════════

function gradient(fn, x, y, h = 0.0001) {
  const dx = (fn(x + h, y) - fn(x - h, y)) / (2 * h);
  const dy = (fn(x, y + h) - fn(x, y - h)) / (2 * h);
  return [dx, dy];
}

// ══════════════════════════════════════════════════════════════
//  OPTIMIZERS
// ══════════════════════════════════════════════════════════════

/**
 * Vanilla SGD.
 */
export function runSGD(fn, x0, y0, lr, maxIter) {
  const path = [];
  let x = x0, y = y0;

  for (let i = 0; i < maxIter; i++) {
    const z = fn(x, y);
    path.push({ x, y, z, iter: i });

    const [gx, gy] = gradient(fn, x, y);
    x -= lr * gx;
    y -= lr * gy;

    // Clamp
    x = Math.max(-10, Math.min(10, x));
    y = Math.max(-10, Math.min(10, y));

    if (Math.abs(gx) < 1e-8 && Math.abs(gy) < 1e-8) break;
  }

  path.push({ x, y, z: fn(x, y), iter: path.length });
  return path;
}

/**
 * SGD with Momentum.
 */
export function runMomentum(fn, x0, y0, lr, beta, maxIter) {
  const path = [];
  let x = x0, y = y0;
  let vx = 0, vy = 0;

  for (let i = 0; i < maxIter; i++) {
    const z = fn(x, y);
    path.push({ x, y, z, iter: i });

    const [gx, gy] = gradient(fn, x, y);
    vx = beta * vx + gx;
    vy = beta * vy + gy;
    x -= lr * vx;
    y -= lr * vy;

    x = Math.max(-10, Math.min(10, x));
    y = Math.max(-10, Math.min(10, y));

    if (Math.abs(gx) < 1e-8 && Math.abs(gy) < 1e-8) break;
  }

  path.push({ x, y, z: fn(x, y), iter: path.length });
  return path;
}

/**
 * Adam optimizer.
 */
export function runAdam(fn, x0, y0, lr, beta1, beta2, maxIter) {
  const path = [];
  let x = x0, y = y0;
  let mx = 0, my = 0; // first moment
  let vx = 0, vy = 0; // second moment
  const eps = 1e-8;

  for (let i = 0; i < maxIter; i++) {
    const z = fn(x, y);
    path.push({ x, y, z, iter: i });

    const [gx, gy] = gradient(fn, x, y);
    const t = i + 1;

    mx = beta1 * mx + (1 - beta1) * gx;
    my = beta1 * my + (1 - beta1) * gy;
    vx = beta2 * vx + (1 - beta2) * gx * gx;
    vy = beta2 * vy + (1 - beta2) * gy * gy;

    // Bias correction
    const mxHat = mx / (1 - beta1 ** t);
    const myHat = my / (1 - beta1 ** t);
    const vxHat = vx / (1 - beta2 ** t);
    const vyHat = vy / (1 - beta2 ** t);

    x -= lr * mxHat / (Math.sqrt(vxHat) + eps);
    y -= lr * myHat / (Math.sqrt(vyHat) + eps);

    x = Math.max(-10, Math.min(10, x));
    y = Math.max(-10, Math.min(10, y));

    if (Math.abs(gx) < 1e-8 && Math.abs(gy) < 1e-8) break;
  }

  path.push({ x, y, z: fn(x, y), iter: path.length });
  return path;
}

/**
 * Compute the total path length in x-y space.
 */
export function pathLength(path) {
  let len = 0;
  for (let i = 1; i < path.length; i++) {
    const dx = path[i].x - path[i - 1].x;
    const dy = path[i].y - path[i - 1].y;
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}

/**
 * Check if reached global minimum (within tolerance).
 */
export function isNearMinimum(path, minimum, tol = 0.1) {
  const last = path[path.length - 1];
  const dist = Math.sqrt((last.x - minimum[0]) ** 2 + (last.y - minimum[1]) ** 2);
  return dist < tol;
}
