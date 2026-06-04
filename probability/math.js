/**
 * probability/math.js — Distribution and statistical computations
 */
import { bivariateGaussianPDF, bivariateSample } from '../common/math-utils.js';

/**
 * Generate samples from a bivariate Gaussian.
 * @param {number} n — number of samples
 * @param {number} muX, muY — means
 * @param {number} sigX, sigY — std deviations
 * @param {number} rho — correlation
 * @returns {Array<[number, number]>}
 */
export function generateSamples(n, muX, muY, sigX, sigY, rho) {
  const samples = [];
  for (let i = 0; i < n; i++) {
    samples.push(bivariateSample(muX, muY, sigX, sigY, rho));
  }
  return samples;
}

/**
 * Generate the 3D surface of the bivariate Gaussian PDF.
 * Returns a grid of { x, y, z } values.
 */
export function generatePDFSurface(muX, muY, sigX, sigY, rho, resolution = 60) {
  const range = 4;
  const lo = -range, hi = range;
  const step = (hi - lo) / resolution;
  const grid = [];

  for (let i = 0; i <= resolution; i++) {
    const row = [];
    for (let j = 0; j <= resolution; j++) {
      const x = lo + i * step;
      const y = lo + j * step;
      const z = bivariateGaussianPDF(x, y, muX, muY, sigX, sigY, rho);
      row.push({ x, y, z });
    }
    grid.push(row);
  }

  return { grid, lo, hi, resolution };
}

/**
 * Compute the covariance matrix.
 */
export function covarianceMatrix(sigX, sigY, rho) {
  return [
    sigX * sigX, rho * sigX * sigY,
    rho * sigX * sigY, sigY * sigY,
  ];
}

/**
 * Compute entropy of a bivariate Gaussian.
 * H = 1 + ln(2π) + 0.5 * ln(det(Σ))
 */
export function bivariateEntropy(sigX, sigY, rho) {
  const detSigma = sigX * sigX * sigY * sigY * (1 - rho * rho);
  return 1 + Math.log(2 * Math.PI) + 0.5 * Math.log(detSigma);
}

/**
 * Compute marginal distribution parameters.
 */
export function marginalInfo(muX, muY, sigX, sigY) {
  return {
    marginalX: { mean: muX, std: sigX },
    marginalY: { mean: muY, std: sigY },
  };
}
