/**
 * optimization/visualizer.js — 3D loss landscape + optimizer path visualization
 */
import * as THREE from 'three';
import { createScene, createGrid, createAxes, createAxisLabels, createGlowSphere } from '../common/three-setup.js';

let sceneCtx = null;
let surfaceMesh = null;
let pathLines = [];
let pathBalls = [];
let startMarker = null;
let minimumMarker = null;

const OPTIMIZER_COLORS = {
  sgd: 0xff6b6b,
  momentum: 0x4ecdc4,
  adam: 0xf59e0b,
};

/**
 * Initialize the 3D scene.
 */
export function initVisualizer(containerId) {
  sceneCtx = createScene(containerId, {
    camera: { position: { x: 5, y: 5, z: 6 } },
    controls: { autoRotate: true, autoRotateSpeed: 0.3 },
  });

  const { scene } = sceneCtx;
  scene.add(createGrid(10, 20, 0x2a2a1a));
  scene.add(createAxes(2.5));
  scene.add(createAxisLabels(2.8));

  sceneCtx.animate();
}

/**
 * Render the loss landscape surface.
 */
export function updateSurface(fn, range, zScale, resolution = 80) {
  if (!sceneCtx) return;
  const { scene } = sceneCtx;

  if (surfaceMesh) {
    scene.remove(surfaceMesh);
    surfaceMesh.geometry.dispose();
    surfaceMesh.material.dispose();
    if (surfaceMesh._wire) {
      surfaceMesh._wire.geometry.dispose();
      surfaceMesh._wire.material.dispose();
    }
  }

  const [lo, hi] = range;
  const step = (hi - lo) / resolution;
  const vertices = [];
  const colors = [];
  const indices = [];

  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const x = lo + i * step;
      const y = lo + j * step;
      const z = fn(x, y) * zScale;

      vertices.push(x, z, y);

      // Warm color gradient
      const normalizedZ = Math.max(0, Math.min(1, z / 3));
      colors.push(
        0.6 + normalizedZ * 0.4,
        0.3 + normalizedZ * 0.2,
        0.05 + normalizedZ * 0.1
      );
    }
  }

  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const a = i * (resolution + 1) + j;
      const b = a + 1;
      const c = (i + 1) * (resolution + 1) + j;
      const d = c + 1;
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  const mat = new THREE.MeshPhongMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7,
    shininess: 40,
  });

  surfaceMesh = new THREE.Mesh(geom, mat);
  scene.add(surfaceMesh);

  // Wireframe
  const wireGeom = geom.clone();
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    wireframe: true,
    transparent: true,
    opacity: 0.04,
  });
  const wire = new THREE.Mesh(wireGeom, wireMat);
  surfaceMesh.add(wire);
  surfaceMesh._wire = wire;
}

let pathAnimations = [];

/**
 * Clear all optimizer paths.
 */
export function clearPaths() {
  if (!sceneCtx) return;
  const { scene } = sceneCtx;

  // Cancel any running animations
  for (const animId of pathAnimations) {
    cancelAnimationFrame(animId);
  }
  pathAnimations = [];

  for (const line of pathLines) {
    scene.remove(line);
    line.geometry.dispose();
    line.material.dispose();
  }
  pathLines = [];

  for (const ball of pathBalls) {
    scene.remove(ball);
  }
  pathBalls = [];

  if (startMarker) { scene.remove(startMarker); startMarker = null; }
  if (minimumMarker) { scene.remove(minimumMarker); minimumMarker = null; }
}

/**
 * Render an optimizer's path on the surface.
 */
export function addOptimizerPath(path, optimizerType, zScale, animate = false) {
  if (!sceneCtx || path.length < 2) return;
  const { scene } = sceneCtx;

  const color = OPTIMIZER_COLORS[optimizerType] || 0xffffff;

  // Start ball
  const start = path[0];
  const startBall = createGlowSphere(0.07, color);
  startBall.position.set(start.x, start.z * zScale + 0.05, start.y);
  scene.add(startBall);
  pathBalls.push(startBall);

  // End ball (larger, representing the current/end position)
  const endBall = createGlowSphere(0.1, color);
  scene.add(endBall);
  pathBalls.push(endBall);

  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.9,
    linewidth: 2,
  });

  let line = null;

  if (!animate) {
    const points = path.map((p) => new THREE.Vector3(p.x, p.z * zScale + 0.03, p.y));
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    line = new THREE.Line(geom, mat);
    scene.add(line);
    pathLines.push(line);

    const end = path[path.length - 1];
    endBall.position.set(end.x, end.z * zScale + 0.05, end.y);
  } else {
    let index = 1;
    const animStep = () => {
      if (index > path.length) {
        return;
      }

      const currentPath = path.slice(0, index);
      const points = currentPath.map((p) => new THREE.Vector3(p.x, p.z * zScale + 0.03, p.y));

      if (line) {
        scene.remove(line);
        line.geometry.dispose();
      }

      const geom = new THREE.BufferGeometry().setFromPoints(points);
      line = new THREE.Line(geom, mat);
      scene.add(line);
      pathLines.push(line);

      const currentPoint = path[index - 1];
      endBall.position.set(currentPoint.x, currentPoint.z * zScale + 0.05, currentPoint.y);

      // Speed up animation if path is very long
      const stepSize = Math.max(1, Math.floor(path.length / 50));
      index += stepSize;

      const animId = requestAnimationFrame(animStep);
      pathAnimations.push(animId);
    };
    animStep();
  }
}

/**
 * Mark the global minimum.
 */
export function markMinimum(x, y, fn, zScale) {
  if (!sceneCtx) return;
  const { scene } = sceneCtx;

  if (minimumMarker) scene.remove(minimumMarker);

  const z = fn(x, y);
  minimumMarker = createGlowSphere(0.12, 0x22c55e);
  minimumMarker.position.set(x, z * zScale + 0.06, y);
  scene.add(minimumMarker);
}

export function disposeVisualizer() {
  if (sceneCtx) sceneCtx.dispose();
}
