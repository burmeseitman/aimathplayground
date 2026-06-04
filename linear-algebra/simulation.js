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
let activeView = '3d'; // '3d' or 'ann'

// ── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderNav('linear-algebra', 'nav-bar', '..');
  renderAIContext('linear-algebra', 'ai-context');
  initVisualizer('viewport');

  // Preset buttons state helper
  const presetIds = ['preset-identity', 'preset-rotation', 'preset-scale', 'preset-shear'];
  const updatePresetButtons = (activeId) => {
    presetIds.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) {
        if (id === activeId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    });
  };

  // Bind matrix inputs
  const matrixInputs = document.querySelectorAll('.matrix-grid .input-field');
  matrixInputs.forEach((input, idx) => {
    input.addEventListener('input', debounce(() => {
      matrix[idx] = parseFloat(input.value) || 0;
      updatePresetButtons(null); // Clear active preset on manual change
      compute();
    }, 80));
  });

  // Bind point count slider
  bindSlider('num-points', 'num-points-val', (val) => {
    numPoints = Math.floor(val);
    compute();
  }, 0);

  // Preset buttons
  document.getElementById('preset-identity').addEventListener('click', () => setPreset([1, 0, 0, 0, 1, 0, 0, 0, 1], 'preset-identity'));
  document.getElementById('preset-rotation').addEventListener('click', () => {
    const a = Math.PI / 4;
    setPreset([Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a), 0, 0, 0, 1], 'preset-rotation');
  });
  document.getElementById('preset-scale').addEventListener('click', () => setPreset([2, 0, 0, 0, 0.5, 0, 0, 0, 1.5], 'preset-scale'));
  document.getElementById('preset-shear').addEventListener('click', () => setPreset([1, 0.8, 0, 0, 1, 0.5, 0.3, 0, 1], 'preset-shear'));

  // View toggles
  const btn3d = document.getElementById('btn-view-3d');
  const btnAnn = document.getElementById('btn-view-ann');
  const viewport3d = document.getElementById('viewport');
  const viewportAnn = document.getElementById('ann-viewport');
  const hint3d = document.getElementById('viewport-hint');

  btn3d.addEventListener('click', () => {
    activeView = '3d';
    btn3d.classList.add('active');
    btnAnn.classList.remove('active');
    viewport3d.style.display = 'block';
    viewportAnn.style.display = 'none';
    hint3d.style.opacity = '0.7';
    compute();
  });

  btnAnn.addEventListener('click', () => {
    activeView = 'ann';
    btnAnn.classList.add('active');
    btn3d.classList.remove('active');
    viewport3d.style.display = 'none';
    viewportAnn.style.display = 'block';
    hint3d.style.opacity = '0'; // Hide rotation hint in ANN view
    compute();
  });

  // Handle resize for ANN SVG
  window.addEventListener('resize', () => {
    if (activeView === 'ann') {
      drawANNLayer();
    }
  });

  // Highlight initial Identity preset on start
  updatePresetButtons('preset-identity');

  // Initial computation
  compute();
});

function setPreset(m, presetId) {
  matrix = [...m];
  const inputs = document.querySelectorAll('.matrix-grid .input-field');
  inputs.forEach((input, idx) => {
    input.value = parseFloat(m[idx].toFixed(3));
  });
  updatePresetButtons(presetId);
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

  // Update visualizer based on active tab
  if (activeView === '3d') {
    updateVisualization(origPoints, transPoints, analysis);
  } else {
    drawANNLayer();
  }
}

/**
 * Render the artificial neural network (3-neuron to 3-neuron layer) as SVG.
 */
function drawANNLayer() {
  const container = document.getElementById('ann-viewport');
  if (!container) return;

  const width = container.clientWidth || 500;
  const height = container.clientHeight || 400;

  // Clear previous content
  container.innerHTML = '';

  // Setup layout variables
  const inputX = 90;
  const outputX = width - 90;
  const nodeRadius = 24;

  const yPositions = [
    height * 0.22, // Neuron 1
    height * 0.50, // Neuron 2
    height * 0.78  // Neuron 3
  ];

  // Colors mapping
  const COLOR_POS = '#00d4ff'; // Cyan for positive weights
  const COLOR_NEG = '#ff4466'; // Pink for negative weights
  const COLOR_ZERO = 'rgba(255, 255, 255, 0.06)';

  let connectionsHtml = '';
  let weightsHtml = '';

  // Draw 9 synapses/connections
  for (let i = 0; i < 3; i++) {       // Output nodes (rows)
    for (let j = 0; j < 3; j++) {     // Input nodes (columns)
      const weight = matrix[i * 3 + j];
      const startY = yPositions[j];
      const endY = yPositions[i];

      // Styling based on weight value
      const isZero = Math.abs(weight) < 1e-4;
      const strokeColor = isZero ? COLOR_ZERO : (weight > 0 ? COLOR_POS : COLOR_NEG);
      const strokeWidth = isZero ? 1.5 : Math.min(Math.abs(weight) * 3 + 1, 9);
      const strokeOpacity = isZero ? 0.3 : Math.min(Math.abs(weight) * 0.5 + 0.3, 0.95);

      // Connect inputs to outputs
      connectionsHtml += `
        <line x1="${inputX}" y1="${startY}" x2="${outputX}" y2="${endY}" 
              class="ann-connection"
              stroke="${strokeColor}" 
              stroke-width="${strokeWidth}" 
              stroke-opacity="${strokeOpacity}" />
      `;

      // Unique non-overlapping label position along the line
      const pct = 0.25 + 0.12 * j + 0.08 * i;
      const textX = inputX + (outputX - inputX) * pct;
      const textY = startY + (endY - startY) * pct;

      // Draw weight value badge
      if (!isZero) {
        const textVal = weight.toFixed(2);
        const textWidth = textVal.length * 7 + 8;
        weightsHtml += `
          <g transform="translate(${textX - textWidth/2}, ${textY - 10})">
            <rect class="ann-weight-bg" width="${textWidth}" height="18" y="-4" />
            <text class="ann-weight-text" x="${textWidth/2}" y="8" text-anchor="middle" fill="${strokeColor}">
              ${textVal}
            </text>
          </g>
        `;
      }
    }
  }

  // Draw input neurons
  let inputNodesHtml = '';
  for (let j = 0; j < 3; j++) {
    const startY = yPositions[j];
    inputNodesHtml += `
      <g>
        <circle cx="${inputX}" cy="${startY}" r="${nodeRadius}" class="ann-node ann-node-input" />
        <text class="ann-label" x="${inputX}" y="${startY + 4}" text-anchor="middle">x${j + 1}</text>
        <text class="ann-sublabel" x="${inputX - 34}" y="${startY + 4}" text-anchor="end">Input ${j + 1}</text>
      </g>
    `;
  }

  // Draw output neurons
  let outputNodesHtml = '';
  for (let i = 0; i < 3; i++) {
    const endY = yPositions[i];
    outputNodesHtml += `
      <g>
        <circle cx="${outputX}" cy="${endY}" r="${nodeRadius}" class="ann-node ann-node-output" />
        <text class="ann-label" x="${outputX}" y="${endY + 4}" text-anchor="middle">y${i + 1}</text>
        <text class="ann-sublabel" x="${outputX + 34}" y="${endY + 4}" text-anchor="start">Output ${i + 1}</text>
      </g>
    `;
  }

  // Construct final SVG
  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}">
      <!-- Connections/Synapses -->
      <g>${connectionsHtml}</g>
      <!-- Weight Labels -->
      <g>${weightsHtml}</g>
      <!-- Input Layer Neurons -->
      <g>${inputNodesHtml}</g>
      <!-- Output Layer Neurons -->
      <g>${outputNodesHtml}</g>
    </svg>
  `;
}

