/**
 * probability/simulation.js — Wires UI to bivariate Gaussian visualization
 */
import { renderNav, renderAIContext, renderOutputs, bindSlider } from '../common/ui-utils.js';
import { fmt, bivariateGaussianPDF } from '../common/math-utils.js';
import { generateSamples, generatePDFSurface, covarianceMatrix, bivariateEntropy, marginalInfo } from './math.js';
import { initVisualizer, updateSurface, updateSamples } from './visualizer.js';

// ── State ────────────────────────────────────────────────
let muX = 0, muY = 0;
let sigX = 1, sigY = 1;
let rho = 0;
let numSamples = 500;

// ── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderNav('probability', 'nav-bar', '..');
  renderAIContext('probability', 'ai-context');
  initVisualizer('viewport');

  bindSlider('mu-x', 'mu-x-val', (v) => { muX = v; compute(); });
  bindSlider('mu-y', 'mu-y-val', (v) => { muY = v; compute(); });
  bindSlider('sig-x', 'sig-x-val', (v) => { sigX = v; compute(); });
  bindSlider('sig-y', 'sig-y-val', (v) => { sigY = v; compute(); });
  bindSlider('rho', 'rho-val', (v) => { rho = v; compute(); });
  bindSlider('num-samples', 'num-samples-val', (v) => { numSamples = Math.floor(v); compute(); }, 0);

  compute();
});

function compute() {
  // Generate PDF surface
  const surfaceData = generatePDFSurface(muX, muY, sigX, sigY, rho);
  updateSurface(surfaceData);

  // Generate samples
  const samples = generateSamples(numSamples, muX, muY, sigX, sigY, rho);
  updateSamples(samples);

  // Compute statistics
  const cov = covarianceMatrix(sigX, sigY, rho);
  const entropy = bivariateEntropy(sigX, sigY, rho);
  const marginals = marginalInfo(muX, muY, sigX, sigY);
  const peakPDF = bivariateGaussianPDF(muX, muY, muX, muY, sigX, sigY, rho);

  // Update outputs
  renderOutputs('output-results', [
    { key: 'Peak PDF f(μ)', value: fmt(peakPDF) },
    { key: 'Cov(X,Y)', value: fmt(rho * sigX * sigY) },
    { key: 'Σ₁₁ (σx²)', value: fmt(cov[0]) },
    { key: 'Σ₁₂ = Σ₂₁', value: fmt(cov[1]) },
    { key: 'Σ₂₂ (σy²)', value: fmt(cov[3]) },
    { key: 'Entropy H', value: fmt(entropy) + ' nats' },
    { key: 'Marginal X', value: `μ=${fmt(marginals.marginalX.mean, 2)}, σ=${fmt(marginals.marginalX.std, 2)}` },
    { key: 'Marginal Y', value: `μ=${fmt(marginals.marginalY.mean, 2)}, σ=${fmt(marginals.marginalY.std, 2)}` },
  ]);
}
