/**
 * probability/visualizer.js — 3D bivariate Gaussian distribution visualization
 */
import * as THREE from 'three';
import { createScene, createGrid, createAxes, createAxisLabels } from '../common/three-setup.js';

let sceneCtx = null;
let surfaceMesh = null;
let samplePoints = null;

/**
 * Initialize the 3D scene.
 */
export function initVisualizer(containerId) {
  sceneCtx = createScene(containerId, {
    camera: { position: { x: 5, y: 5, z: 6 } },
    controls: { autoRotate: true, autoRotateSpeed: 0.4 },
  });

  const { scene } = sceneCtx;
  scene.add(createGrid(8, 16, 0x1a2a1a));
  scene.add(createAxes(2.5));
  scene.add(createAxisLabels(2.8));

  sceneCtx.animate();
}

/**
 * Update the 3D Gaussian surface.
 */
export function updateSurface(surfaceData) {
  if (!sceneCtx) return;
  const { scene } = sceneCtx;

  // Remove old surface
  if (surfaceMesh) {
    scene.remove(surfaceMesh);
    surfaceMesh.geometry.dispose();
    surfaceMesh.material.dispose();
    if (surfaceMesh._wire) {
      surfaceMesh._wire.geometry.dispose();
      surfaceMesh._wire.material.dispose();
    }
  }

  const { grid, resolution } = surfaceData;
  const vertices = [];
  const colors = [];
  const indices = [];
  const zScale = 8; // Scale up the PDF for visibility

  // Build vertices
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const { x, y, z } = grid[i][j];
      vertices.push(x, z * zScale, y); // Y-up

      // Color: green gradient based on height
      const t = Math.min(z * zScale / 2, 1);
      colors.push(
        0.06 + t * 0.2,
        0.45 + t * 0.55,
        0.35 + t * 0.2
      );
    }
  }

  // Build indices
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
    opacity: 0.8,
    shininess: 50,
  });

  surfaceMesh = new THREE.Mesh(geom, mat);
  scene.add(surfaceMesh);

  // Wireframe overlay
  const wireGeom = geom.clone();
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    wireframe: true,
    transparent: true,
    opacity: 0.05,
  });
  const wire = new THREE.Mesh(wireGeom, wireMat);
  surfaceMesh.add(wire);
  surfaceMesh._wire = wire;
}

/**
 * Update the scatter plot of samples below the surface.
 */
export function updateSamples(samples) {
  if (!sceneCtx) return;
  const { scene } = sceneCtx;

  if (samplePoints) {
    scene.remove(samplePoints);
    samplePoints.geometry.dispose();
    samplePoints.material.dispose();
  }

  const positions = new Float32Array(samples.length * 3);
  const sampleColors = new Float32Array(samples.length * 3);

  samples.forEach(([x, y], i) => {
    positions[i * 3] = x;
    positions[i * 3 + 1] = 0.01; // Just above the ground plane
    positions[i * 3 + 2] = y;

    // Distance-based color
    const dist = Math.sqrt(x * x + y * y);
    const t = Math.min(dist / 4, 1);
    sampleColors[i * 3] = 0.06 + t * 0.5;
    sampleColors[i * 3 + 1] = 0.73 - t * 0.3;
    sampleColors[i * 3 + 2] = 0.5 - t * 0.2;
  });

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(sampleColors, 3));

  const mat = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.05,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true,
  });

  samplePoints = new THREE.Points(geom, mat);
  scene.add(samplePoints);
}

export function disposeVisualizer() {
  if (sceneCtx) sceneCtx.dispose();
}
