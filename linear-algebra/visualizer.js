/**
 * linear-algebra/visualizer.js — 3D visualization for matrix transformations
 */
import * as THREE from 'three';
import { createScene, createGrid, createAxes, createAxisLabels, createArrow } from '../common/three-setup.js';

let sceneCtx = null;
let originalPoints = [];
let transformedPoints = [];
let pointsMesh = null;
let linesMesh = null;
let eigenArrows = [];

const ORIGINAL_COLOR = 0x334466;
const TRANSFORMED_COLOR = 0x00d4ff;
const EIGEN_COLORS = [0xff4466, 0x44ff66, 0x4488ff];

/**
 * Initialize the 3D scene.
 */
export function initVisualizer(containerId) {
  sceneCtx = createScene(containerId, {
    camera: { position: { x: 3.5, y: 2.5, z: 4 } },
    controls: { autoRotate: true, autoRotateSpeed: 0.5 },
  });

  const { scene } = sceneCtx;

  // Add helpers
  scene.add(createGrid(8, 16, 0x1a1a3a));
  scene.add(createAxes(2.5));
  scene.add(createAxisLabels(2.8));

  sceneCtx.animate();
}

/**
 * Update the visualization with new original & transformed point sets.
 * @param {Array<[number,number,number]>} origPts
 * @param {Array<[number,number,number]>} transPts
 * @param {object} analysis — from analyzeMatrix()
 */
export function updateVisualization(origPts, transPts, analysis) {
  if (!sceneCtx) return;
  const { scene } = sceneCtx;

  originalPoints = origPts;
  transformedPoints = transPts;

  // ── Remove old meshes ──────────────────────────────────
  if (pointsMesh) {
    scene.remove(pointsMesh);
    pointsMesh.geometry.dispose();
    pointsMesh.material.dispose();
  }
  if (linesMesh) {
    scene.remove(linesMesh);
    linesMesh.geometry.dispose();
    linesMesh.material.dispose();
  }
  for (const arrow of eigenArrows) {
    scene.remove(arrow);
  }
  eigenArrows = [];

  // ── Original points (dimmed) ───────────────────────────
  const origGeom = new THREE.BufferGeometry();
  const origPositions = new Float32Array(originalPoints.length * 3);
  originalPoints.forEach((p, i) => {
    origPositions[i * 3] = p[0];
    origPositions[i * 3 + 1] = p[1];
    origPositions[i * 3 + 2] = p[2];
  });
  origGeom.setAttribute('position', new THREE.BufferAttribute(origPositions, 3));
  const origMat = new THREE.PointsMaterial({
    color: ORIGINAL_COLOR,
    size: 0.04,
    transparent: true,
    opacity: 0.35,
    sizeAttenuation: true,
  });
  const origMeshObj = new THREE.Points(origGeom, origMat);
  scene.add(origMeshObj);

  // ── Transformed points (bright) ────────────────────────
  const transGeom = new THREE.BufferGeometry();
  const transPositions = new Float32Array(transformedPoints.length * 3);
  const transColors = new Float32Array(transformedPoints.length * 3);

  transformedPoints.forEach((p, i) => {
    transPositions[i * 3] = p[0];
    transPositions[i * 3 + 1] = p[1];
    transPositions[i * 3 + 2] = p[2];

    // Color based on distance from origin
    const dist = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
    const t = Math.min(dist / 3, 1);
    transColors[i * 3] = 0 + t * 0.5;       // R
    transColors[i * 3 + 1] = 0.83 - t * 0.3; // G
    transColors[i * 3 + 2] = 1;              // B
  });

  transGeom.setAttribute('position', new THREE.BufferAttribute(transPositions, 3));
  transGeom.setAttribute('color', new THREE.BufferAttribute(transColors, 3));
  const transMat = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.06,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  });
  pointsMesh = new THREE.Points(transGeom, transMat);
  scene.add(pointsMesh);

  // ── Connection lines (orig → transformed) ──────────────
  const linePositions = new Float32Array(originalPoints.length * 6);
  originalPoints.forEach((p, i) => {
    linePositions[i * 6] = p[0];
    linePositions[i * 6 + 1] = p[1];
    linePositions[i * 6 + 2] = p[2];
    linePositions[i * 6 + 3] = transformedPoints[i][0];
    linePositions[i * 6 + 4] = transformedPoints[i][1];
    linePositions[i * 6 + 5] = transformedPoints[i][2];
  });
  const lineGeom = new THREE.BufferGeometry();
  lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.08,
  });
  linesMesh = new THREE.LineSegments(lineGeom, lineMat);
  scene.add(linesMesh);

  // Store orig mesh for cleanup
  pointsMesh._origMesh = origMeshObj;

  // ── Eigenvector arrows ─────────────────────────────────
  if (analysis && analysis.dominantEigenvector) {
    const ev = analysis.dominantEigenvector;
    const eigenMag = Math.abs(analysis.eigenvalues[0]);
    const arrowLen = Math.min(eigenMag, 3);

    if (arrowLen > 0.1) {
      const arrow = createArrow([0, 0, 0], ev, arrowLen, EIGEN_COLORS[0]);
      scene.add(arrow);
      eigenArrows.push(arrow);

      // Negative direction
      const negArrow = createArrow(
        [0, 0, 0],
        [-ev[0], -ev[1], -ev[2]],
        arrowLen,
        EIGEN_COLORS[0]
      );
      scene.add(negArrow);
      eigenArrows.push(negArrow);
    }
  }
}

/**
 * Dispose of the visualizer.
 */
export function disposeVisualizer() {
  if (sceneCtx) sceneCtx.dispose();
}
