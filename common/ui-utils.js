/**
 * ui-utils.js — Shared UI helpers for AI Math Toolkits
 */
import { AI_CONTEXT } from './constants.js';

/**
 * Render the AI Context bar for a given pillar.
 * @param {string} pillarId — e.g. 'linear-algebra'
 * @param {string} containerId — DOM id of the context container
 */
export function renderAIContext(pillarId, containerId) {
  const ctx = AI_CONTEXT[pillarId];
  if (!ctx) return;

  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = `
    <span class="ai-context-icon">${ctx.icon}</span>
    <div class="ai-context-body">
      <h4>🤖 ${ctx.title}</h4>
      <p>${ctx.description}</p>
      <div class="ai-keywords">
        ${ctx.keywords.map((k) => `<span class="ai-keyword">${k}</span>`).join('')}
      </div>
    </div>
  `;
}

/**
 * Render the navigation bar.
 * @param {string} activePillar — currently active pillar id, or '' for landing
 * @param {string} containerId — DOM id of the nav container
 * @param {string} basePath — relative path prefix to reach root (e.g. '..')
 */
export function renderNav(activePillar, containerId, basePath = '..') {
  const el = document.getElementById(containerId);
  if (!el) return;

  const links = [
    { id: 'linear-algebra', label: 'Linear Algebra', icon: '🔢' },
    { id: 'calculus', label: 'Calculus', icon: '📐' },
    { id: 'probability', label: 'Probability', icon: '🎲' },
    { id: 'optimization', label: 'Optimization', icon: '🎯' },
  ];

  el.innerHTML = `
    <a class="nav-brand" href="${basePath}/index.html">
      <span class="nav-brand-icon">🧠</span>
      <span>AI Math Toolkits</span>
    </a>
    <nav class="nav-links">
      ${links
        .map(
          (l) => `
        <a href="${basePath}/${l.id}/index.html" 
           class="nav-link ${l.id === activePillar ? 'active' : ''}"
           title="${l.label}">
          ${l.icon} ${l.label}
        </a>`
        )
        .join('')}
    </nav>
  `;
}

/**
 * Update output panel with computed results.
 * @param {string} containerId — DOM id of the output container
 * @param {Array<{key: string, value: string}>} results
 */
export function renderOutputs(containerId, results) {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = results
    .map(
      (r) => `
    <div class="output-row">
      <span class="output-key">${r.key}</span>
      <span class="output-value">${r.value}</span>
    </div>`
    )
    .join('');
}

/**
 * Bind a slider input to its value display and call onChange.
 * @param {string} sliderId — DOM id of the range input
 * @param {string} valueId  — DOM id of the value display span
 * @param {function} onChange — callback(newValue: number)
 * @param {number} [decimals=2]
 */
export function bindSlider(sliderId, valueId, onChange, decimals = 2) {
  const slider = document.getElementById(sliderId);
  const display = document.getElementById(valueId);
  if (!slider) return;

  const update = () => {
    const val = parseFloat(slider.value);
    if (display) display.textContent = val.toFixed(decimals);
    if (onChange) onChange(val);
  };

  slider.addEventListener('input', update);
  update(); // initial render
}

/**
 * Bind a select dropdown and call onChange.
 */
export function bindSelect(selectId, onChange) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.addEventListener('change', () => {
    onChange(select.value);
  });
  onChange(select.value); // initial
}

/**
 * Debounce a function.
 */
export function debounce(fn, ms = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Parse all numeric inputs from a form/container.
 * @param {string} containerId
 * @returns {Object<string, number>}
 */
export function parseInputs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return {};

  const inputs = container.querySelectorAll('input[type="number"], input[type="range"]');
  const result = {};
  inputs.forEach((inp) => {
    if (inp.id) result[inp.id] = parseFloat(inp.value) || 0;
  });

  const selects = container.querySelectorAll('select');
  selects.forEach((sel) => {
    if (sel.id) result[sel.id] = sel.value;
  });

  return result;
}

/**
 * Format a number for display.
 */
export function fmt(n, decimals = 4) {
  if (typeof n !== 'number' || isNaN(n)) return '—';
  if (Math.abs(n) > 1e6) return n.toExponential(2);
  return n.toFixed(decimals);
}
