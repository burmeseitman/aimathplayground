/**
 * linear-algebra/math.js — Matrix & vector computation for the LA simulation
 */
import { mat3MulVec3, mat3Det, mat3Trace, eigenvalues3x3, powerIteration } from '../common/math-utils.js';

/**
 * Generate points on a unit sphere.
 * @param {number} count
 * @returns {Array<[number, number, number]>}
 */
export function generateUnitSpherePoints(count) {
  const points = [];
  // Fibonacci sphere for even distribution
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // -1 to 1
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    points.push([x, y, z]);
  }
  return points;
}

/**
 * Apply a 3×3 matrix transformation to a set of 3D points.
 * @param {number[]} matrix — flat 9-element array
 * @param {Array<[number,number,number]>} points
 * @returns {Array<[number,number,number]>}
 */
export function transformPoints(matrix, points) {
  return points.map((p) => mat3MulVec3(matrix, p));
}

/**
 * Compute all analysis results for the given matrix.
 * @param {number[]} matrix — flat 9-element array
 * @returns {object}
 */
export function analyzeMatrix(matrix) {
  const det = mat3Det(matrix);
  const trace = mat3Trace(matrix);
  const eigenvals = eigenvalues3x3(matrix);
  const { eigenvector } = powerIteration(matrix);

  // Matrix rank approximation (based on reduced row echelon — simplified)
  let rank = 3;
  if (Math.abs(det) < 1e-8) {
    rank = 2;
    // Check if it's rank 1 or 0
    const allZero = matrix.every((v) => Math.abs(v) < 1e-8);
    if (allZero) rank = 0;
  }

  const orientationPreserved = det > 0;

  return {
    determinant: det,
    trace,
    eigenvalues: eigenvals,
    dominantEigenvector: eigenvector,
    rank,
    orientationPreserved,
  };
}
