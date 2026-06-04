/**
 * calculus/visualizer.js — 3D surface + gradient visualization
 */
import * as THREE from 'three';
import { createScene, createGrid, createAxes, createAxisLabels, createGlowSphere } from '../common/three-setup.js';

let sceneCtx = null;
let surfaceMesh = null;
let gradientArrows = [];
let descentPathLine = null;
let descentBall = null;
let pointMarker = null;

/**
 * Initialize the 3D scene.
 */
export function initVisualizer(containerId) {
  sceneCtx = createScene(containerId, {
    camera: { position: { x: 5, y: 4, z: 5 } },
    controls: { autoRotate: true, autoRotateSpeed: 0.3 },
  });

  const { scene } = sceneCtx;
  scene.add(createGrid(8, 16, 0x1a1a3a));
  scene.add(createAxes(2.5));
  scene.add(createAxisLabels(2.8));

  sceneCtx.animate();
}

/**
 * Render the 3D surface for a function f(x, y).
 */
export function updateSurface(fn, range, zScale = 1, resolution = 80) {
  if (!sceneCtx) return;
  const { scene } = sceneCtx;

  // Remove old surface
  if (surfaceMesh) {
    scene.remove(surfaceMesh);
    surfaceMesh.geometry.dispose();
    surfaceMesh.material.dispose();
  }

  const [lo, hi] = range;
  const step = (hi - lo) / resolution;
  const vertices = [];
  const colors = [];
  const indices = [];

  // Build vertex grid
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const x = lo + i * step;
      const y = lo + j * step;
      const z = fn(x, y) * zScale;

      vertices.push(x, z, y); // Y-up convention

      // Color based on height
      const normalizedZ = Math.max(0, Math.min(1, (z + 2) / 6));
      const r = 0.1 + normalizedZ * 0.5;
      const g = 0.15 + normalizedZ * 0.3;
      const b = 0.6 + normalizedZ * 0.4;
      colors.push(r, g, b);
    }
  }

  // Build triangle indices
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

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const material = new THREE.MeshPhongMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75,
    shininess: 60,
    flatShading: false,
  });

  surfaceMesh = new THREE.Mesh(geometry, material);
  scene.add(surfaceMesh);

  // Add wireframe overlay
  const wireGeom = geometry.clone();
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
  });
  const wireMesh = new THREE.Mesh(wireGeom, wireMat);
  surfaceMesh.add(wireMesh);
}

/**
 * Render gradient arrows on the surface.
 */
export function updateGradientField(gradientVectors, zScale = 1) {
  if (!sceneCtx) return;
  const { scene } = sceneCtx;

  // Clear old arrows
  for (const arrow of gradientArrows) {
    scene.remove(arrow);
    if (arrow.dispose) arrow.dispose();
  }
  gradientArrows = [];

  for (const v of gradientVectors) {
    const mag = Math.sqrt(v.dx * v.dx + v.dy * v.dy);
    if (mag < 0.05) continue;

    const origin = new THREE.Vector3(v.x, v.z * zScale, v.y);
    const dir = new THREE.Vector3(-v.dx, 0, -v.dy).normalize(); // Negative gradient
    const length = Math.min(mag * 0.3, 0.4);

    const arrow = new THREE.ArrowHelper(
      dir, origin, length,
      0xc084fc, length * 0.25, length * 0.12
    );
    scene.add(arrow);
    gradientArrows.push(arrow);
  }
}

let animationFrameId = null;

/**
 * Render the gradient descent path.
 */
export function updateDescentPath(path, zScale = 1, animate = false) {
  if (!sceneCtx) return;
  const { scene } = sceneCtx;

  // Cancel any running animation
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  // Clear old path
  if (descentPathLine) {
    scene.remove(descentPathLine);
    descentPathLine.geometry.dispose();
    descentPathLine.material.dispose();
    descentPathLine = null;
  }
  if (descentBall) {
    scene.remove(descentBall);
    descentBall = null;
  }

  if (path.length < 2) return;

  const color = 0xff6b6b;
  descentBall = createGlowSphere(0.08, color);
  scene.add(descentBall);

  const material = new THREE.LineBasicMaterial({
    color,
    linewidth: 2,
    transparent: true,
    opacity: 0.9,
  });

  if (!animate) {
    const points = path.map(([x, y, z]) => new THREE.Vector3(x, z * zScale + 0.02, y));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    descentPathLine = new THREE.Line(geometry, material);
    scene.add(descentPathLine);

    const last = path[path.length - 1];
    descentBall.position.set(last[0], last[2] * zScale + 0.05, last[1]);
  } else {
    let index = 1;
    const animateStep = () => {
      if (index > path.length) {
        animationFrameId = null;
        return;
      }

      // Draw path up to current index
      const currentPath = path.slice(0, index);
      const points = currentPath.map(([x, y, z]) => new THREE.Vector3(x, z * zScale + 0.02, y));
      
      if (descentPathLine) {
        scene.remove(descentPathLine);
        descentPathLine.geometry.dispose();
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      descentPathLine = new THREE.Line(geometry, material);
      scene.add(descentPathLine);

      // Move ball
      const currentPoint = path[index - 1];
      descentBall.position.set(currentPoint[0], currentPoint[2] * zScale + 0.05, currentPoint[1]);

      // Speed up animation if path is very long
      const stepSize = Math.max(1, Math.floor(path.length / 50));
      index += stepSize;

      animationFrameId = requestAnimationFrame(animateStep);
    };
    animateStep();
  }
}

/**
 * Render a marker at a specific point on the surface.
 */
export function updatePointMarker(x, y, z, zScale = 1) {
  if (!sceneCtx) return;
  const { scene } = sceneCtx;

  if (pointMarker) scene.remove(pointMarker);

  pointMarker = createGlowSphere(0.06, 0x8b5cf6);
  pointMarker.position.set(x, z * zScale + 0.05, y);
  scene.add(pointMarker);
}

export function disposeVisualizer() {
  if (sceneCtx) sceneCtx.dispose();
}
