/**
 * optimization/simulation.js — Wires UI to optimizer race visualization
 */
import { renderNav, renderAIContext, renderOutputs, bindSlider, bindSelect } from '../common/ui-utils.js';
import { fmt } from '../common/math-utils.js';
import { LOSS_FUNCTIONS, runSGD, runMomentum, runAdam, pathLength, isNearMinimum } from './math.js';
import { initVisualizer, updateSurface, clearPaths, addOptimizerPath, markMinimum } from './visualizer.js';

// ── State ────────────────────────────────────────────────
let currentLossKey = 'rosenbrock';
let optimizer = 'adam';
let lr = 0.01;
let momentum = 0.9;
let startX = -1.5;
let startY = -1.5;
let maxIter = 200;

// ── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderNav('optimization', 'nav-bar', '..');
  renderAIContext('optimization', 'ai-context');
  initVisualizer('viewport');

  bindSelect('loss-fn', (val) => { currentLossKey = val; compute(false); });
  bindSelect('optimizer-select', (val) => {
    optimizer = val;
    // Show/hide momentum row
    const momRow = document.getElementById('momentum-row');
    if (momRow) momRow.style.display = (val === 'sgd') ? 'none' : 'flex';
    compute(false);
  });

  bindSlider('start-x', 'start-x-val', (v) => { startX = v; compute(false); });
  bindSlider('start-y', 'start-y-val', (v) => { startY = v; compute(false); });
  bindSlider('learning-rate', 'learning-rate-val', (v) => { lr = v; compute(false); }, 4);
  bindSlider('momentum-val-input', 'momentum-display', (v) => { momentum = v; compute(false); }, 3);
  bindSlider('max-iter', 'max-iter-val', (v) => { maxIter = Math.floor(v); compute(false); }, 0);

  document.getElementById('btn-run').addEventListener('click', () => compute(true));
  document.getElementById('btn-race').addEventListener('click', () => raceAll(true));

  compute(false);
});

function compute(animate = false) {
  const lossData = LOSS_FUNCTIONS[currentLossKey];
  const fn = lossData.fn;
  const range = lossData.range;
  const zScale = lossData.zScale;

  // Render surface
  updateSurface(fn, range, zScale);
  clearPaths();

  // Run selected optimizer
  let path;
  switch (optimizer) {
    case 'sgd':
      path = runSGD(fn, startX, startY, lr, maxIter);
      break;
    case 'momentum':
      path = runMomentum(fn, startX, startY, lr, momentum, maxIter);
      break;
    case 'adam':
      path = runAdam(fn, startX, startY, lr, 0.9, 0.999, maxIter);
      break;
    default:
      path = runSGD(fn, startX, startY, lr, maxIter);
  }

  addOptimizerPath(path, optimizer, zScale, animate);
  markMinimum(lossData.minimum[0], lossData.minimum[1], fn, zScale);

  const last = path[path.length - 1];
  const pLen = pathLength(path);
  const reachedMin = isNearMinimum(path, lossData.minimum);

  renderOutputs('output-results', [
    { key: 'Optimizer', value: optimizer.toUpperCase() },
    { key: 'Final (x*, y*)', value: `(${fmt(last.x, 3)}, ${fmt(last.y, 3)})` },
    { key: 'Final Loss', value: fmt(last.z) },
    { key: 'အဆင့်များ (Steps)', value: String(path.length) },
    { key: 'Path Length', value: fmt(pLen) },
    { key: 'Global Min သို့ ရောက်သလား?', value: reachedMin ? '✅ ရောက်သည် (Yes)' : '❌ မရောက်ပါ (No)' },
    { key: 'Target Min', value: `(${lossData.minimum[0]}, ${lossData.minimum[1]})` },
  ]);
}

function raceAll(animate = false) {
  const lossData = LOSS_FUNCTIONS[currentLossKey];
  const fn = lossData.fn;
  const range = lossData.range;
  const zScale = lossData.zScale;

  updateSurface(fn, range, zScale);
  clearPaths();

  const sgdPath = runSGD(fn, startX, startY, lr, maxIter);
  const momPath = runMomentum(fn, startX, startY, lr, momentum, maxIter);
  const adamPath = runAdam(fn, startX, startY, lr, 0.9, 0.999, maxIter);

  addOptimizerPath(sgdPath, 'sgd', zScale, animate);
  addOptimizerPath(momPath, 'momentum', zScale, animate);
  addOptimizerPath(adamPath, 'adam', zScale, animate);
  markMinimum(lossData.minimum[0], lossData.minimum[1], fn, zScale);

  const sgdLast = sgdPath[sgdPath.length - 1];
  const momLast = momPath[momPath.length - 1];
  const adamLast = adamPath[adamPath.length - 1];

  renderOutputs('output-results', [
    { key: '🔴 SGD Final Loss', value: fmt(sgdLast.z) },
    { key: '🔴 SGD အဆင့်များ (Steps)', value: String(sgdPath.length) },
    { key: '🟢 Momentum Loss', value: fmt(momLast.z) },
    { key: '🟢 Momentum အဆင့်များ (Steps)', value: String(momPath.length) },
    { key: '🟡 Adam Loss', value: fmt(adamLast.z) },
    { key: '🟡 Adam အဆင့်များ (Steps)', value: String(adamPath.length) },
    { key: 'Target Min', value: `(${lossData.minimum[0]}, ${lossData.minimum[1]})` },
  ]);
}
