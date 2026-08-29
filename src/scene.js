/**
 * scene.js — the "Kd Growth Engine": a metallic 3D "Kd" monogram (uppercase K +
 * lowercase d) on an obsidian platform, wrapped in slow orbital rings and six
 * floating service modules. Cinematic maroon / pink / orange / cyan lighting,
 * studio reflections (RoomEnvironment), restrained bloom + grain.
 *
 * Auto quality tiers (high / mid / low / static). prefers-reduced-motion => one
 * static frame. Loop pauses when the tab is hidden.
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import helvetikerBold from 'three/examples/fonts/helvetiker_bold.typeface.json';
import { modules } from './data.js';

const SYS = {
  maroon: 0x8e1233,
  pink: 0xff2d75,
  orange: 0xff7a18,
  gold: 0xffc928,
  violet: 0x8b5cf6,
  blue: 0x20c7ff,
  cyan: 0x19e6d2,
  lime: 0xb8ff3d,
  white: 0xf7f7f5,
};

/* ---------- module glyphs (simple line marks, not brand logos) ---------- */
function drawGlyph(ctx, kind, c, cx, cy, s) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = c;
  ctx.fillStyle = c;
  ctx.lineWidth = s * 0.13;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  switch (kind) {
    case 'target':
      ctx.beginPath(); ctx.arc(0, 0, s, 0, 6.283); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, s * 0.55, 0, 6.283); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, s * 0.12, 0, 6.283); ctx.fill();
      break;
    case 'clap':
      ctx.strokeRect(-s, -s * 0.35, s * 2, s * 1.35);
      ctx.beginPath();
      for (let i = -1; i <= 1; i++) { ctx.moveTo(i * s * 0.66, -s * 0.35); ctx.lineTo(i * s * 0.66 + s * 0.3, -s * 0.9); }
      ctx.moveTo(-s, -s * 0.6); ctx.lineTo(s, -s * 0.9);
      ctx.stroke();
      break;
    case 'ads':
      ctx.beginPath(); ctx.arc(0, 0, s, -0.4, Math.PI * 1.55); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(s * 0.1, 0); ctx.stroke();
      break;
    case 'play':
      ctx.beginPath(); ctx.moveTo(-s * 0.5, -s * 0.8); ctx.lineTo(-s * 0.5, s * 0.8); ctx.lineTo(s * 0.85, 0); ctx.closePath(); ctx.fill();
      break;
    case 'rise':
      ctx.beginPath(); ctx.moveTo(-s, s); ctx.lineTo(-s * 0.3, s * 0.1); ctx.lineTo(s * 0.2, s * 0.5); ctx.lineTo(s, -s * 0.7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s * 0.4, -s * 0.7); ctx.lineTo(s, -s * 0.7); ctx.lineTo(s, -s * 0.1); ctx.stroke();
      break;
    case 'pie':
      ctx.beginPath(); ctx.arc(0, 0, s, 0, 6.283); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -s); ctx.arc(0, 0, s, -Math.PI / 2, 0); ctx.closePath(); ctx.fill();
      break;
    default:
      ctx.beginPath(); ctx.arc(0, 0, s, 0, 6.283); ctx.stroke();
  }
  ctx.restore();
}

function makeModuleTexture(m, leftSide) {
  const hue = '#' + SYS[m.system].toString(16).padStart(6, '0');
  const W = 620;
  const H = 200;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d');
  // layout: icon on outer edge, text toward the Kd
  const iconX = leftSide ? W - 66 : 66;
  const textX = leftSide ? W - 132 : 132;
  const align = leftSide ? 'right' : 'left';

  // faint dark backing so the text keeps contrast against the scene
  ctx.fillStyle = 'rgba(8,6,10,0.55)';
  const rr = 24;
  ctx.beginPath();
  ctx.moveTo(rr, 8); ctx.arcTo(W - 8, 8, W - 8, H - 8, rr); ctx.arcTo(W - 8, H - 8, 8, H - 8, rr);
  ctx.arcTo(8, H - 8, 8, 8, rr); ctx.arcTo(8, 8, W - 8, 8, rr); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = hue + '55';
  ctx.lineWidth = 2;
  ctx.stroke();

  // glowing icon disc
  const g = ctx.createRadialGradient(iconX, H / 2, 4, iconX, H / 2, 54);
  g.addColorStop(0, hue + 'cc');
  g.addColorStop(0.55, hue + '33');
  g.addColorStop(1, hue + '00');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(iconX, H / 2, 54, 0, 6.283);
  ctx.fill();
  ctx.strokeStyle = hue;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(iconX, H / 2, 40, 0, 6.283);
  ctx.stroke();
  drawGlyph(ctx, m.glyph, hue, iconX, H / 2, 20);

  // label
  ctx.textAlign = align;
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 42px "Space Grotesk", system-ui, sans-serif';
  ctx.fillText(m.title.toUpperCase(), textX, 62);
  ctx.font = '500 25px "Space Grotesk", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(226,226,232,0.92)';
  m.lines.forEach((ln, i) => ctx.fillText(ln, textX, 106 + i * 33));
  ctx.shadowBlur = 0;

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ---------------------------------------------------- quality detection */
function detectTier() {
  const forced = new URLSearchParams(location.search).get('tier');
  if (forced && ['high', 'mid', 'low', 'static'].includes(forced)) return forced;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static';
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  let gpu = '';
  try {
    const g = document.createElement('canvas').getContext('webgl');
    const ext = g && g.getExtension('WEBGL_debug_renderer_info');
    if (ext) gpu = (g.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '').toLowerCase();
  } catch (e) {
    /* ignore */
  }
  if (/(apple|m1|m2|m3|a1[4-9]|adreno 6[5-9]|adreno 7|rtx|radeon rx|geforce)/.test(gpu)) return 'high';
  if (/(mali-4|mali-t|adreno 3|adreno 4|adreno 5[0-2]|powervr|swiftshader|software)/.test(gpu)) return 'low';
  if (cores >= 8 || mem >= 8) return 'high';
  if (cores <= 4 && mem <= 4) return 'low';
  return 'mid';
}

const TIERS = {
  high: { dpr: 2, particles: 900, samples: 4, bloom: 0.42, env: true, grain: 0.003, curve: 10, bevel: true },
  mid: { dpr: 1.6, particles: 450, samples: 0, bloom: 0.34, env: true, grain: 0.003, curve: 7, bevel: true },
  low: { dpr: 1, particles: 260, samples: 0, bloom: 0.0, env: false, grain: 0.0, curve: 4, bevel: false },
  static: { dpr: 1.5, particles: 400, samples: 0, bloom: 0.36, env: true, grain: 0.024, curve: 6, bevel: true },
};

const FINAL_SHADER = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uGrain: { value: 0.03 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uTime; uniform float uGrain; varying vec2 vUv;
    void main(){
      vec3 col = texture2D(tDiffuse, vUv).rgb;
      float d = length(vUv - 0.5);
      col *= smoothstep(1.2, 0.35, d * 1.25);
      float n = fract(sin(dot(gl_FragCoord.xy + uTime * 40.0, vec2(12.9898, 78.233))) * 43758.5453);
      col += (n - 0.5) * uGrain;
      gl_FragColor = vec4(col, 1.0);
    }`,
};

/* ============================================================== init */
export function initScene(canvas) {
  const tierName = detectTier();
  const T = TIERS[tierName];
  const isStatic = tierName === 'static';

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: T.samples === 0, alpha: false, powerPreference: 'high-performance', stencil: false });
  renderer.setClearColor(0x060609, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, T.dpr));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060609, 0.045);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.4, 8);

  if (T.env) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    scene.environment = pmrem.fromScene(roomEnv, 0.04).texture;
    roomEnv.dispose?.();
    pmrem.dispose();
  }

  // cinematic lighting
  scene.add(new THREE.AmbientLight(0x2c2028, 1.15));
  const keyL = new THREE.DirectionalLight(0xffe9d6, 2.6);
  keyL.position.set(4, 6, 6);
  scene.add(keyL);
  const keyFront = new THREE.DirectionalLight(0xffffff, 1.1);
  keyFront.position.set(-2, 2, 7);
  scene.add(keyFront);
  const rimPink = new THREE.PointLight(SYS.pink, 26, 22, 2);
  rimPink.position.set(-3.5, 1.5, -3);
  scene.add(rimPink);
  const rimMaroon = new THREE.PointLight(SYS.maroon, 30, 24, 2);
  rimMaroon.position.set(3.5, -0.5, -3.5);
  scene.add(rimMaroon);
  const accentOrange = new THREE.PointLight(SYS.orange, 14, 18, 2);
  accentOrange.position.set(2.5, 3, 3);
  scene.add(accentOrange);
  const fillCyan = new THREE.PointLight(SYS.cyan, 12, 20, 2);
  fillCyan.position.set(0, -3, 2);
  scene.add(fillCyan);

  const world = new THREE.Group();
  scene.add(world);

  /* ---- background maroon glow ---- */
  const glowCv = document.createElement('canvas');
  glowCv.width = glowCv.height = 256;
  const gx = glowCv.getContext('2d');
  const gg = gx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gg.addColorStop(0, 'rgba(142,18,51,0.55)');
  gg.addColorStop(0.4, 'rgba(90,7,27,0.28)');
  gg.addColorStop(1, 'rgba(6,6,9,0)');
  gx.fillStyle = gg;
  gx.fillRect(0, 0, 256, 256);
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(glowCv), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.7 }),
  );
  glow.position.set(0, 0.5, -5);
  world.add(glow);

  /* ---- the Kd sculpture ---- */
  const kd = new THREE.Group();
  world.add(kd);

  const font = new FontLoader().parse(helvetikerBold);
  const textGeo = new TextGeometry('Kd', {
    font,
    size: 2.2,
    height: 0.72,
    curveSegments: T.curve,
    bevelEnabled: T.bevel,
    bevelThickness: 0.07,
    bevelSize: 0.05,
    bevelSegments: T.bevel ? 3 : 0,
  });
  textGeo.computeBoundingBox();
  const bb = textGeo.boundingBox;
  textGeo.translate(-(bb.max.x + bb.min.x) / 2, -(bb.max.y + bb.min.y) / 2, -(bb.max.z + bb.min.z) / 2);
  const kdMesh = new THREE.Mesh(
    textGeo,
    new THREE.MeshStandardMaterial({
      color: 0x6e2c42,
      metalness: 0.9,
      roughness: 0.2,
      envMapIntensity: 3.0,
      emissive: 0xd42a58,
      emissiveIntensity: 0.62,
    }),
  );
  kd.add(kdMesh);
  // hot-pink fresnel rim shell (the glowing edges from the reference)
  const kdRim = new THREE.Mesh(
    textGeo,
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(0xff3b9d) } },
      vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 wp = modelMatrix * vec4(position,1.0); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 uColor; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - clamp(dot(vN, vV), 0.0, 1.0), 2.6); gl_FragColor = vec4(uColor * f * 1.6, f); }',
    }),
  );
  kdRim.scale.setScalar(1.025);
  kd.add(kdRim);

  /* ---- obsidian platform + glowing rings ---- */
  const platform = new THREE.Group();
  platform.position.y = -1.75;
  world.add(platform);

  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(2.5, 2.7, 0.34, 72),
    new THREE.MeshStandardMaterial({ color: 0x0b0709, metalness: 0.85, roughness: 0.45, envMapIntensity: 0.9 }),
  );
  platform.add(disc);

  const glowRings = [];
  [
    { r: 2.15, c: SYS.maroon, o: 0.6, sp: 0.25 },
    { r: 2.45, c: SYS.pink, o: 0.5, sp: -0.18 },
    { r: 2.78, c: SYS.cyan, o: 0.3, sp: 0.12 },
  ].forEach((cfg) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(cfg.r, 0.012, 8, 140),
      new THREE.MeshBasicMaterial({ color: cfg.c, transparent: true, opacity: cfg.o, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.2;
    platform.add(ring);
    glowRings.push({ ring, sp: cfg.sp });
  });

  // bright platform rim (cyan -> pink energy ring under the Kd)
  [
    { r: 3.0, c: 0x18c8ff, o: 0.85 },
    { r: 3.12, c: SYS.pink, o: 0.6 },
  ].forEach((cfg) => {
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(cfg.r, 0.028, 10, 160),
      new THREE.MeshBasicMaterial({ color: cfg.c, transparent: true, opacity: cfg.o, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.02;
    platform.add(rim);
  });
  // glow pool beneath
  const poolCv = document.createElement('canvas');
  poolCv.width = poolCv.height = 128;
  const px2 = poolCv.getContext('2d');
  const pgrad = px2.createRadialGradient(64, 64, 0, 64, 64, 64);
  pgrad.addColorStop(0, 'rgba(255,59,157,0.5)');
  pgrad.addColorStop(1, 'rgba(255,59,157,0)');
  px2.fillStyle = pgrad;
  px2.fillRect(0, 0, 128, 128);
  const pool = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 9),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(poolCv), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.7 }),
  );
  pool.rotation.x = -Math.PI / 2;
  pool.position.y = -0.15;
  platform.add(pool);

  // engraved circular text around the base
  const ringTxtCv = document.createElement('canvas');
  ringTxtCv.width = 2048;
  ringTxtCv.height = 128;
  const rt = ringTxtCv.getContext('2d');
  rt.fillStyle = 'rgba(255,255,255,0.5)';
  rt.font = '600 52px "Space Grotesk", system-ui, sans-serif';
  rt.textBaseline = 'middle';
  rt.fillText('  STRATEGY  •  CONTENT  •  PAID MEDIA  •  GROWTH  •  REPORTING  •  STRATEGY  •  CONTENT  •  PAID MEDIA  •  GROWTH  •  REPORTING  ', 0, 68);
  const ringTxtTex = new THREE.CanvasTexture(ringTxtCv);
  ringTxtTex.wrapS = THREE.RepeatWrapping;
  ringTxtTex.colorSpace = THREE.SRGBColorSpace;
  const baseText = new THREE.Mesh(
    new THREE.CylinderGeometry(3.35, 3.35, 0.4, 96, 1, true),
    new THREE.MeshBasicMaterial({ map: ringTxtTex, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }),
  );
  baseText.position.y = 0.12;
  platform.add(baseText);

  /* ---- orbital rings (the growth engine) ---- */
  const orbitRings = [];
  [
    { r: 2.4, c: SYS.maroon, tube: 0.014, ax: [1.15, 0.15, 0.1], sp: 0.12 },
    { r: 2.75, c: SYS.pink, tube: 0.01, ax: [1.0, 0.4, 0.15], sp: -0.09 },
    { r: 3.05, c: SYS.orange, tube: 0.009, ax: [1.3, 0.25, 0.35], sp: 0.07 },
    { r: 3.35, c: SYS.cyan, tube: 0.009, ax: [0.95, 0.5, 0.5], sp: -0.06 },
    { r: 3.7, c: SYS.violet, tube: 0.008, ax: [1.2, 0.15, 0.6], sp: 0.05 },
    { r: 4.05, c: SYS.blue, tube: 0.007, ax: [1.05, 0.35, 0.2], sp: -0.04 },
  ].forEach((cfg) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(cfg.r, cfg.tube, 8, 190),
      new THREE.MeshBasicMaterial({ color: cfg.c, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    ring.rotation.set(cfg.ax[0], cfg.ax[1], cfg.ax[2]);
    kd.add(ring);
    orbitRings.push({ ring, sp: cfg.sp, ax: cfg.ax });
  });

  /* ---- six floating service modules — icon badge + label, full circle ---- */
  const ANG = { strategy: 2.45, content: 3.14, youtube: 3.9, paid: 1.0, growth: 0.28, reporting: -0.72 };
  const modGeo = new THREE.PlaneGeometry(2.5, 0.82);
  const mods = modules.map((m, i) => {
    const a = ANG[m.key] != null ? ANG[m.key] : (i / modules.length) * Math.PI * 2;
    const left = Math.cos(a) < 0;
    const mesh = new THREE.Mesh(
      modGeo,
      new THREE.MeshBasicMaterial({ map: makeModuleTexture(m, left), transparent: true, depthWrite: false, toneMapped: false, opacity: 0.94 }),
    );
    const base = new THREE.Vector3(Math.cos(a) * 3.15 - 0.75, Math.sin(a) * 2.8 + 0.35, 1.5);
    mesh.position.copy(base);
    mesh.renderOrder = 5;
    world.add(mesh);
    return { mesh, base, phase: i * 1.3, sys: m.system };
  });

  /* ---- controlled ambient particles (subtle) ---- */
  const N = T.particles;
  const pPos = new Float32Array(N * 3);
  const pRnd = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const r = 3 + Math.random() * 6;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pPos[i * 3 + 1] = r * Math.cos(ph) * 0.6;
    pPos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 2;
    pRnd[i] = Math.random();
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('aRnd', new THREE.BufferAttribute(pRnd, 1));
  const pMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uSize: { value: 2.0 * (window.devicePixelRatio || 1) } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uTime; uniform float uSize; attribute float aRnd; varying float vA;
      void main(){
        vec3 p = position;
        float ang = uTime * 0.02 + aRnd * 6.28;
        p.xz = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * p.xz;
        p.y += sin(uTime * 0.25 + aRnd * 20.0) * 0.3;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * (40.0 / -mv.z) * (0.4 + aRnd);
        vA = 0.06 + aRnd * 0.14;
      }`,
    fragmentShader: `
      varying float vA;
      void main(){ float d = length(gl_PointCoord - 0.5); if(d > 0.5) discard;
        gl_FragColor = vec4(0.75, 0.35, 0.5, vA * smoothstep(0.5, 0.0, d)); }`,
  });
  const points = new THREE.Points(pGeo, pMat);
  points.frustumCulled = false;
  world.add(points);

  /* ---- post ---- */
  let composer = null;
  let finalPass = null;
  let bloomPass = null;
  if (!isStatic && tierName !== 'low') {
    const size = new THREE.Vector2();
    renderer.getSize(size);
    const rt = T.samples > 0 ? new THREE.WebGLRenderTarget(size.x, size.y, { samples: T.samples, type: THREE.HalfFloatType }) : undefined;
    composer = new EffectComposer(renderer, rt);
    composer.addPass(new RenderPass(scene, camera));
    bloomPass = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), T.bloom, 0.4, 0.75);
    composer.addPass(bloomPass);
    finalPass = new ShaderPass(FINAL_SHADER);
    finalPass.uniforms.uGrain.value = T.grain;
    composer.addPass(finalPass);
    composer.addPass(new OutputPass());
  }

  /* ---- interaction / scroll ---- */
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', (e) => {
    ptr.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ptr.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let scrollP = 0;
  let scrollTarget = 0;
  let narrow = false;
  let baseZ = 8;

  const FRAMES = [
    { turn: 0.0, zoom: 0.0, lift: 0.0 },
    { turn: 0.5, zoom: 0.8, lift: 0.1 },
    { turn: -0.6, zoom: 0.3, lift: -0.1 },
    { turn: 0.25, zoom: 1.4, lift: 0.15 },
    { turn: -0.35, zoom: 0.6, lift: 0.0 },
    { turn: 0.1, zoom: 0.1, lift: 0.2 },
  ];
  let focus = 0;
  let focusTarget = 0;

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    narrow = w < 980;
    if (!narrow) {
      // centre the Kd in the right ~58% of the viewport, clear of the exp panel
      world.position.set(1.75, -0.55, 0);
      world.scale.setScalar(0.5);
      camera.fov = 42;
      baseZ = 9.2;
    } else {
      world.position.set(0, 2.2, 0);
      world.scale.setScalar(0.5);
      camera.fov = 56;
      baseZ = 9.4;
    }
    camera.updateProjectionMatrix();
    if (composer) composer.setSize(w, h);
    if (bloomPass) bloomPass.resolution.set(w, h);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', resize, { passive: true });

  const tmp = new THREE.Vector3();
  const camTarget = new THREE.Vector3();
  const worldQInv = new THREE.Quaternion();

  function update(time) {
    scrollP += (scrollTarget - scrollP) * 0.1;
    ptr.x += (ptr.tx - ptr.x) * 0.045;
    ptr.y += (ptr.ty - ptr.y) * 0.045;
    focus += (focusTarget - focus) * 0.06;

    const fi = Math.max(0, Math.min(FRAMES.length - 1, focus));
    const f0 = FRAMES[Math.floor(fi)];
    const f1 = FRAMES[Math.min(FRAMES.length - 1, Math.ceil(fi))];
    const ft = fi - Math.floor(fi);
    const frTurn = f0.turn + (f1.turn - f0.turn) * ft;
    const frZoom = f0.zoom + (f1.zoom - f0.zoom) * ft;
    const frLift = f0.lift + (f1.lift - f0.lift) * ft;

    world.rotation.y = ptr.x * 0.12 + Math.sin(time * 0.14) * 0.04;
    world.updateWorldMatrix(false, false);
    worldQInv.copy(world.quaternion).invert();

    pMat.uniforms.uTime.value = time;

    // Kd: slow hero rotation + pointer + per-section turn
    kd.rotation.y = Math.sin(time * 0.18) * 0.22 + ptr.x * 0.28 + frTurn;
    kd.rotation.x = -0.04 + ptr.y * 0.1 + Math.sin(time * 0.22) * 0.03;
    kd.position.y = Math.sin(time * 0.6) * 0.06 + frLift;

    glowRings.forEach((g) => { g.ring.rotation.z += g.sp * 0.01; });
    orbitRings.forEach((o) => {
      o.ring.rotation.x += o.sp * 0.004 * o.ax[0];
      o.ring.rotation.y += o.sp * 0.004 * (o.ax[1] + 0.4);
      o.ring.rotation.z += o.sp * 0.004 * o.ax[2];
    });

    for (let i = 0; i < mods.length; i++) {
      const md = mods[i];
      tmp.copy(md.base);
      tmp.y += Math.sin(time * 0.5 + md.phase) * 0.16;
      tmp.x += Math.sin(time * 0.32 + md.phase) * 0.1;
      md.mesh.position.copy(tmp);
      md.mesh.quaternion.copy(worldQInv).multiply(camera.quaternion);
      md.mesh.material.opacity = 0.5 + 0.44 * (1 - Math.min(scrollP * 1.4, 1));
    }
    baseText.rotation.y = time * 0.06;

    rimPink.intensity = 24 + Math.sin(time * 1.2) * 5;
    accentOrange.intensity = 12 + Math.sin(time * 0.9 + 1) * 3;

    const dist = Math.max(3.6, baseZ - scrollP * 1.8 - frZoom);
    // frame the Kd centred in the right zone: look slightly toward the world offset
    camera.position.x = world.position.x * 0.5 + ptr.x * 0.7;
    camera.position.y = (narrow ? 1.9 : 1.15) + ptr.y * -0.5 - scrollP * 0.4 + Math.sin(time * 0.2) * 0.1;
    camera.position.z = dist;
    camTarget.set(world.position.x * 0.5, (narrow ? 1.9 : 0.15) - scrollP * 0.1, 0);
    camera.lookAt(camTarget);

    if (bloomPass) bloomPass.strength = T.bloom * (1 + scrollP * 0.2);
    if (finalPass) finalPass.uniforms.uTime.value = time;

    if (composer) composer.render();
    else renderer.render(scene, camera);
  }

  let running = true;
  let raf = 0;
  const clock = new THREE.Clock();
  function frame() {
    if (!running) { raf = 0; return; }
    update(clock.getElapsedTime());
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (isStatic || raf || !running) return;
    raf = requestAnimationFrame(frame);
  }

  update(1.2);
  if (!isStatic) {
    document.addEventListener('visibilitychange', () => {
      running = document.visibilityState === 'visible';
      if (running) start();
    });
    start();
  }

  return {
    tier: tierName,
    setScroll(p) { scrollTarget = THREE.MathUtils.clamp(p, 0, 1); },
    setFocus(i) { focusTarget = THREE.MathUtils.clamp(i, 0, FRAMES.length - 1); },
    resize,
    dispose() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      if (composer) composer.dispose();
      renderer.dispose();
      textGeo.dispose();
    },
  };
}
