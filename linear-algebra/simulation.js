/**
 * linear-algebra/simulation.js — Wires input, computation, 3D output together
 */
import { renderNav, renderAIContext, renderOutputs, bindSlider, debounce } from '../common/ui-utils.js';
import { fmt } from '../common/math-utils.js';
import { generateUnitSpherePoints, transformPoints, analyzeMatrix } from './math.js';
import { initVisualizer, updateVisualization } from './visualizer.js';

// ── State ────────────────────────────────────────────────
let matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]; // Identity
let numPoints = 200;

// ── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderNav('linear-algebra', 'nav-bar', '..');
  renderAIContext('linear-algebra', 'ai-context');
  initVisualizer('viewport');

  // Bind matrix inputs
  const matrixInputs = document.querySelectorAll('.matrix-grid .input-field');
  matrixInputs.forEach((input, idx) => {
    input.addEventListener('input', debounce(() => {
      matrix[idx] = parseFloat(input.value) || 0;
      compute();
    }, 80));
  });

  // Bind point count slider
  bindSlider('num-points', 'num-points-val', (val) => {
    numPoints = Math.floor(val);
    compute();
  }, 0);

  // Preset buttons
  document.getElementById('preset-identity').addEventListener('click', () => setPreset([1, 0, 0, 0, 1, 0, 0, 0, 1]));
  document.getElementById('preset-rotation').addEventListener('click', () => {
    const a = Math.PI / 4;
    setPreset([Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a), 0, 0, 0, 1]);
  });
  document.getElementById('preset-scale').addEventListener('click', () => setPreset([2, 0, 0, 0, 0.5, 0, 0, 0, 1.5]));
  document.getElementById('preset-shear').addEventListener('click', () => setPreset([1, 0.8, 0, 0, 1, 0.5, 0.3, 0, 1]));

  // Initial computation
  compute();
});

function setPreset(m) {
  matrix = [...m];
  const inputs = document.querySelectorAll('.matrix-grid .input-field');
  inputs.forEach((input, idx) => {
    input.value = parseFloat(m[idx].toFixed(3));
  });
  compute();
}

function compute() {
  // Generate original points on unit sphere
  const origPoints = generateUnitSpherePoints(numPoints);

  // Transform points with the matrix
  const transPoints = transformPoints(matrix, origPoints);

  // Analyze the matrix
  const analysis = analyzeMatrix(matrix);

  // Update outputs
  renderOutputs('output-results', [
    { key: 'Determinant', value: fmt(analysis.determinant) },
    { key: 'Trace', value: fmt(analysis.trace) },
    { key: 'Rank', value: String(analysis.rank) },
    { key: 'Eigenvalue λ₁', value: fmt(analysis.eigenvalues[0]) },
    { key: 'Eigenvalue λ₂', value: fmt(analysis.eigenvalues[1]) },
    { key: 'Eigenvalue λ₃', value: fmt(analysis.eigenvalues[2]) },
    { key: 'Orientation', value: analysis.orientationPreserved ? '✅ Preserved' : '🔄 Reversed' },
  ]);

  // Update 3D visualization
  updateVisualization(origPoints, transPoints, analysis);
}
