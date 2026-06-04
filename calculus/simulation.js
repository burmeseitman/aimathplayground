/**
 * calculus/simulation.js — Wires input, computation, 3D output for Calculus pillar
 */
import { renderNav, renderAIContext, renderOutputs, bindSlider, bindSelect, debounce } from '../common/ui-utils.js';
import { fmt } from '../common/math-utils.js';
import { FUNCTIONS, numericalGradient, hessianDiagonal, gradientMagnitude, gradientDescentPath, gradientField } from './math.js';
import { initVisualizer, updateSurface, updateGradientField, updateDescentPath, updatePointMarker } from './visualizer.js';

// ── State ────────────────────────────────────────────────
let currentFnKey = 'paraboloid';
let startX = 2.0;
let startY = 2.0;
let learningRate = 0.1;

// ── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderNav('calculus', 'nav-bar', '..');
  renderAIContext('calculus', 'ai-context');
  initVisualizer('viewport');

  // Bind function selector
  bindSelect('fn-select', (val) => {
    currentFnKey = val;
    compute(false);
  });

  // Bind sliders
  bindSlider('start-x', 'start-x-val', (val) => { startX = val; compute(false); });
  bindSlider('start-y', 'start-y-val', (val) => { startY = val; compute(false); });
  bindSlider('learning-rate', 'learning-rate-val', (val) => { learningRate = val; compute(false); }, 3);

  // Run button
  document.getElementById('btn-run-descent').addEventListener('click', () => compute(true));

  compute(false);
});

function compute(animate = false) {
  const funcData = FUNCTIONS[currentFnKey];
  const fn = funcData.fn;
  const range = funcData.range;
  const zScale = funcData.zScale;

  // Render surface
  updateSurface(fn, range, zScale);

  // Compute gradient at start point
  const { dx, dy } = numericalGradient(fn, startX, startY);
  const z0 = fn(startX, startY);
  const gMag = gradientMagnitude(dx, dy);
  const { fxx, fyy } = hessianDiagonal(fn, startX, startY);

  // Run gradient descent
  const path = gradientDescentPath(fn, startX, startY, learningRate, 200);
  const finalPoint = path[path.length - 1];

  // Render gradient field
  const gField = gradientField(fn, range, 10);
  updateGradientField(gField, zScale);

  // Render descent path
  updateDescentPath(path, zScale, animate);

  // Render start point marker
  updatePointMarker(startX, startY, z0, zScale);

  // Update outputs
  renderOutputs('output-results', [
    { key: 'f(x₀, y₀)', value: fmt(z0) },
    { key: '∂f/∂x', value: fmt(dx) },
    { key: '∂f/∂y', value: fmt(dy) },
    { key: '|∇f|', value: fmt(gMag) },
    { key: '∂²f/∂x²', value: fmt(fxx) },
    { key: '∂²f/∂y²', value: fmt(fyy) },
    { key: 'Final f(x*, y*)', value: fmt(finalPoint[2]) },
    { key: 'အဆင့်များ (Steps)', value: String(path.length) },
  ]);
}
