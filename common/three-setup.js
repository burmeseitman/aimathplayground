/**
 * three-setup.js — Three.js scene factory for AI Math Playground
 * Creates a pre-configured scene with camera, renderer, OrbitControls, and helpers.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CAMERA_DEFAULTS, CONTROLS_DEFAULTS } from './constants.js';

/**
 * Create a complete Three.js scene inside a container element.
 * @param {string} containerId — DOM id of the container element
 * @param {object} [opts] — overrides for camera/controls
 * @returns {{ scene, camera, renderer, controls, animate, dispose, addHelper }}
 */
export function createScene(containerId, opts = {}) {
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`Container #${containerId} not found`);

  const width = container.clientWidth;
  const height = container.clientHeight;

  // ── Scene ─────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0f, 0.035);

  // ── Camera ────────────────────────────────────────────
  const cam = { ...CAMERA_DEFAULTS, ...opts.camera };
  const camera = new THREE.PerspectiveCamera(cam.fov, width / height, cam.near, cam.far);
  camera.position.set(cam.position.x, cam.position.y, cam.position.z);

  // ── Renderer ──────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // ── OrbitControls ─────────────────────────────────────
  const ctrl = { ...CONTROLS_DEFAULTS, ...opts.controls };
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = ctrl.enableDamping;
  controls.dampingFactor = ctrl.dampingFactor;
  controls.rotateSpeed = ctrl.rotateSpeed;
  controls.zoomSpeed = ctrl.zoomSpeed;
  controls.autoRotate = ctrl.autoRotate;
  controls.autoRotateSpeed = ctrl.autoRotateSpeed;
  controls.minDistance = ctrl.minDistance;
  controls.maxDistance = ctrl.maxDistance;

  // ── Lighting ──────────────────────────────────────────
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0xffffff, 0.8);
  directional.position.set(5, 8, 5);
  scene.add(directional);

  const pointLight = new THREE.PointLight(0x00d4ff, 0.4, 50);
  pointLight.position.set(-3, 5, -3);
  scene.add(pointLight);

  // ── Resize Handler ────────────────────────────────────
  const onResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  // ── Animation Loop ────────────────────────────────────
  let animationId;
  const callbacks = [];

  function animate() {
    animationId = requestAnimationFrame(animate);
    controls.update();
    for (const cb of callbacks) cb();
    renderer.render(scene, camera);
  }

  /**
   * Register a per-frame callback.
   */
  function onFrame(cb) {
    callbacks.push(cb);
  }

  /**
   * Clean up resources.
   */
  function dispose() {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', onResize);
    controls.dispose();
    renderer.dispose();
    container.removeChild(renderer.domElement);
  }

  return { scene, camera, renderer, controls, animate, onFrame, dispose };
}

// ══════════════════════════════════════════════════════════════
//  HELPER CONSTRUCTORS
// ══════════════════════════════════════════════════════════════

/**
 * Create a subtle grid on the XZ plane.
 */
export function createGrid(size = 10, divisions = 20, color = 0x222244) {
  const grid = new THREE.GridHelper(size, divisions, color, color);
  grid.material.transparent = true;
  grid.material.opacity = 0.25;
  return grid;
}

/**
 * Create colored XYZ axes.
 */
export function createAxes(length = 3) {
  const group = new THREE.Group();

  const dirs = [
    { dir: new THREE.Vector3(1, 0, 0), color: 0xff4466 },
    { dir: new THREE.Vector3(0, 1, 0), color: 0x44ff66 },
    { dir: new THREE.Vector3(0, 0, 1), color: 0x4488ff },
  ];

  for (const { dir, color } of dirs) {
    // Line
    const geom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      dir.clone().multiplyScalar(length),
    ]);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 });
    group.add(new THREE.Line(geom, mat));

    // Arrowhead cone
    const coneGeom = new THREE.ConeGeometry(0.04, 0.15, 8);
    const coneMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
    const cone = new THREE.Mesh(coneGeom, coneMat);
    const tipPos = dir.clone().multiplyScalar(length);
    cone.position.copy(tipPos);
    // Orient cone along the direction
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    group.add(cone);
  }

  return group;
}

/**
 * Create axis labels (X, Y, Z) as sprites.
 */
export function createAxisLabels(length = 3.3) {
  const group = new THREE.Group();
  const labels = [
    { text: 'X', pos: [length, 0, 0], color: '#ff4466' },
    { text: 'Y', pos: [0, length, 0], color: '#44ff66' },
    { text: 'Z', pos: [0, 0, length], color: '#4488ff' },
  ];

  for (const { text, pos, color } of labels) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.font = 'bold 40px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.8 });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(...pos);
    sprite.scale.set(0.3, 0.3, 1);
    group.add(sprite);
  }

  return group;
}

/**
 * Create an arrow in 3D space (for vectors/gradients).
 */
export function createArrow(origin, direction, length, color = 0x00d4ff) {
  const dir = new THREE.Vector3(...direction).normalize();
  const org = new THREE.Vector3(...origin);
  return new THREE.ArrowHelper(dir, org, length, color, length * 0.15, length * 0.08);
}

/**
 * Create a glowing sphere (for particles, points of interest).
 */
export function createGlowSphere(radius = 0.08, color = 0x00d4ff) {
  const geom = new THREE.SphereGeometry(radius, 16, 16);
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
  const mesh = new THREE.Mesh(geom, mat);

  // Outer glow
  const glowGeom = new THREE.SphereGeometry(radius * 2, 16, 16);
  const glowMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide,
  });
  const glow = new THREE.Mesh(glowGeom, glowMat);
  mesh.add(glow);

  return mesh;
}
