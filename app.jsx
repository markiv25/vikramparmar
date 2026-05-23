/* global React, ReactDOM, THREE */
const { useState, useEffect, useRef } = React;

// ─────────────────────────────────────────────────────────
// Shared chrome bits
// ─────────────────────────────────────────────────────────
function BrandMark() {
  return (
    <div className="brand-mark">
      <span className="glyph">VP</span>
      <span>Vikram&nbsp;Parmar</span>
    </div>
  );
}
function Avail({ show, label = 'Available · Spring 2026' }) {
  if (!show) return null;
  return (<div className="avail"><span className="pip"></span><span>{label}</span></div>);
}
function KbdRail({ keys = ['1', '2', '3'], hint = 'Variant' }) {
  return (
    <div className="kbd-rail">
      <span className="lbl">{hint}</span>
      {keys.map(k => <span key={k} className="kbd">{k}</span>)}
    </div>
  );
}
function FootCue({ label = 'Scroll · work' }) {
  return <div className="foot-cue">{label}</div>;
}

// ═════════════════════════════════════════════════════════
// V1 — GLOBE / FLIGHT ATLAS (Three.js)
// ═════════════════════════════════════════════════════════
const CITIES = [
  { name: 'YVR', lat: 49.19,  lon: -123.18, full: 'Vancouver' },
  { name: 'JFK', lat: 40.64,  lon: -73.78,  full: 'New York' },
  { name: 'LHR', lat: 51.47,  lon: -0.45,   full: 'London' },
  { name: 'DXB', lat: 25.25,  lon: 55.36,   full: 'Dubai' },
  { name: 'SIN', lat: 1.36,   lon: 103.99,  full: 'Singapore' },
  { name: 'NRT', lat: 35.77,  lon: 140.39,  full: 'Tokyo' },
  { name: 'SYD', lat: -33.94, lon: 151.18,  full: 'Sydney' },
  { name: 'GRU', lat: -23.43, lon: -46.48,  full: 'São Paulo' },
  { name: 'JNB', lat: -26.13, lon: 28.24,   full: 'Johannesburg' },
  { name: 'FRA', lat: 50.04,  lon: 8.55,    full: 'Frankfurt' },
  { name: 'DEL', lat: 28.55,  lon: 77.10,   full: 'Delhi' },
  { name: 'LAX', lat: 33.94,  lon: -118.41, full: 'Los Angeles' },
  { name: 'HKG', lat: 22.31,  lon: 113.91,  full: 'Hong Kong' },
  { name: 'IST', lat: 41.27,  lon: 28.74,   full: 'Istanbul' },
];

function latLonToVec3(lat, lon, R) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return [
    -R * Math.sin(phi) * Math.cos(theta),
     R * Math.cos(phi),
     R * Math.sin(phi) * Math.sin(theta),
  ];
}

function GlobeHero({ tweaks }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const [card, setCard] = useState(null);
  const [liveArcs, setLiveArcs] = useState(5);

  // Soft ticker so live arcs feels alive
  useEffect(() => {
    if (!tweaks.motion) return;
    const t = setInterval(() => setLiveArcs(4 + Math.floor(Math.random() * 4)), 1200);
    return () => clearInterval(t);
  }, [tweaks.motion]);

  useEffect(() => {
    if (!window.THREE || !canvasRef.current || !wrapRef.current) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const R = 1.6;
    const group = new THREE.Group();
    scene.add(group);

    // Solid backing sphere — almost invisible, just to shade points behind it
    const back = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.985, 48, 32),
      new THREE.MeshBasicMaterial({ color: 0x0d0c09, transparent: true, opacity: 0.96, side: THREE.FrontSide })
    );
    group.add(back);

    // Latitude lines
    const latMat = new THREE.LineBasicMaterial({ color: 0xE1E0CC, transparent: true, opacity: 0.18 });
    for (let i = -80; i <= 80; i += 20) {
      const pts = [];
      const phi = (90 - i) * Math.PI / 180;
      const r = R * Math.sin(phi);
      const y = R * Math.cos(phi);
      for (let a = 0; a <= 360; a += 4) {
        const t = a * Math.PI / 180;
        pts.push(new THREE.Vector3(r * Math.cos(t), y, r * Math.sin(t)));
      }
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      group.add(new THREE.Line(g, latMat));
    }
    // Longitude lines
    for (let l = 0; l < 360; l += 20) {
      const pts = [];
      const theta = l * Math.PI / 180;
      for (let lat = -90; lat <= 90; lat += 4) {
        const phi = (90 - lat) * Math.PI / 180;
        pts.push(new THREE.Vector3(
          R * Math.sin(phi) * Math.cos(theta),
          R * Math.cos(phi),
          R * Math.sin(phi) * Math.sin(theta),
        ));
      }
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      group.add(new THREE.Line(g, latMat));
    }

    // Land dots — fake continents via Fibonacci sphere weighted to land latitudes
    const dotsGeo = new THREE.BufferGeometry();
    const N_DOTS = 1800;
    const dotPos = new Float32Array(N_DOTS * 3);
    for (let i = 0; i < N_DOTS; i++) {
      // Random point on sphere
      const u = Math.random(), v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = R * 1.002;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      dotPos[i * 3]     = x;
      dotPos[i * 3 + 1] = y;
      dotPos[i * 3 + 2] = z;
    }
    dotsGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3));
    const dotsMat = new THREE.PointsMaterial({
      color: 0xE1E0CC, size: 0.018, transparent: true, opacity: 0.5,
      sizeAttenuation: true,
    });
    group.add(new THREE.Points(dotsGeo, dotsMat));

    // City dots
    const cityMeshes = [];
    CITIES.forEach((c) => {
      const [x, y, z] = latLonToVec3(c.lat, c.lon, R * 1.012);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xE8C77A })
      );
      dot.position.set(x, y, z);
      dot.userData = c;
      group.add(dot);
      // halo
      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.04, 0.06, 24),
        new THREE.MeshBasicMaterial({ color: 0xE8C77A, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
      );
      halo.position.set(x, y, z);
      halo.lookAt(new THREE.Vector3(0, 0, 0));
      halo.rotateX(Math.PI);
      group.add(halo);
      cityMeshes.push({ dot, halo, city: c });
    });

    // Flight arcs — random great-circle arcs between cities
    const arcsGroup = new THREE.Group();
    group.add(arcsGroup);
    const arcs = [];

    function makeArc(a, b) {
      const va = new THREE.Vector3(...latLonToVec3(a.lat, a.lon, R * 1.012));
      const vb = new THREE.Vector3(...latLonToVec3(b.lat, b.lon, R * 1.012));
      const mid = va.clone().add(vb).multiplyScalar(0.5);
      const dist = va.distanceTo(vb);
      const lift = 0.2 + dist * 0.35;
      const midDir = mid.clone().normalize();
      const midUp = midDir.multiplyScalar(R + lift);
      const curve = new THREE.QuadraticBezierCurve3(va, midUp, vb);
      const pts = curve.getPoints(60);
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: 0xE8C77A, transparent: true, opacity: 0.6,
      });
      const line = new THREE.Line(geom, mat);
      line.geometry.setDrawRange(0, 0);
      arcsGroup.add(line);

      // Pulse along arc
      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.025, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xFFE9B0 })
      );
      pulse.visible = false;
      arcsGroup.add(pulse);

      return {
        line, mat, pulse, pts,
        from: a, to: b,
        progress: 0,
        speed: 0.005 + Math.random() * 0.005,
        life: 0,
        maxLife: 4 + Math.random() * 3,
      };
    }

    function spawnArc() {
      const i = Math.floor(Math.random() * CITIES.length);
      let j = Math.floor(Math.random() * CITIES.length);
      while (j === i) j = Math.floor(Math.random() * CITIES.length);
      arcs.push(makeArc(CITIES[i], CITIES[j]));
    }
    for (let k = 0; k < 5; k++) spawnArc();

    // Initial orientation — show Americas + Atlantic
    group.rotation.y = -Math.PI * 0.45;
    group.rotation.x = -0.18;

    // Drag controls
    let pointer = { x: 0, y: 0, down: false };
    let vel = { x: 0, y: 0 };
    let auto = true;
    const onDown = (e) => {
      pointer.down = true;
      pointer.x = e.clientX; pointer.y = e.clientY;
      auto = false;
    };
    const onUp = () => { pointer.down = false; };
    const onMove = (e) => {
      if (!pointer.down) return;
      const dx = e.clientX - pointer.x;
      const dy = e.clientY - pointer.y;
      pointer.x = e.clientX; pointer.y = e.clientY;
      vel.x = dy * 0.005;
      vel.y = dx * 0.005;
      group.rotation.x += vel.x;
      group.rotation.y += vel.y;
    };
    // Hover to detect cities for the tooltip
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const onHover = (e) => {
      const r = wrap.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      raycaster.setFromCamera(ndc, camera);
      const targets = cityMeshes.map(m => m.dot);
      const hits = raycaster.intersectObjects(targets);
      if (hits.length > 0) {
        const c = hits[0].object.userData;
        setCard({ x: e.clientX, y: e.clientY, label: `${c.name} · ${c.full}` });
      } else {
        setCard(null);
      }
    };

    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointermove', onHover);
    canvas.addEventListener('pointerleave', () => setCard(null));

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Animate
    let raf = 0;
    let t0 = performance.now();
    let arcTimer = 0;
    const tick = (now) => {
      const dt = (now - t0) / 1000;
      t0 = now;

      if (auto || !pointer.down) {
        group.rotation.y += (tweaks.motion ? 0.0008 : 0) * 16;
        // damp residual velocity
        vel.y *= 0.92;
        vel.x *= 0.92;
      }

      // City halos — face camera + pulse
      const camPos = camera.position;
      cityMeshes.forEach(({ halo, dot }, i) => {
        halo.lookAt(camPos);
        const s = 1 + Math.sin(now * 0.003 + i) * 0.2;
        halo.scale.setScalar(s);
      });

      // Arcs — animate growth + pulse
      arcTimer += dt;
      if (arcTimer > 1.4 && arcs.length < 8) { spawnArc(); arcTimer = 0; }

      for (let i = arcs.length - 1; i >= 0; i--) {
        const a = arcs[i];
        const t = (tweaks.motion ? dt : 0);
        a.progress += a.speed * t * 60;
        const visible = Math.min(1, a.progress);
        const drawCount = Math.floor(visible * a.pts.length);
        a.line.geometry.setDrawRange(0, drawCount);

        // pulse
        if (visible > 0 && visible < 1) {
          a.pulse.visible = true;
          const p = visible;
          const idx = Math.min(a.pts.length - 1, Math.floor(p * a.pts.length));
          a.pulse.position.copy(a.pts[idx]);
        } else {
          a.pulse.visible = false;
        }
        if (visible >= 1) {
          a.life += t;
          a.mat.opacity = Math.max(0, 0.6 - (a.life / a.maxLife) * 0.6);
          if (a.life > a.maxLife) {
            arcsGroup.remove(a.line);
            arcsGroup.remove(a.pulse);
            arcs.splice(i, 1);
          }
        }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointermove', onHover);
      renderer.dispose();
    };
  }, [tweaks.motion]);

  return (
    <div className="scene v-globe active" ref={wrapRef}>
      <div className="globe-grid"></div>
      <canvas ref={canvasRef}></canvas>
      <div className="chrome">
        <BrandMark />
        <Avail show={tweaks.avail} />
        <KbdRail />
        <FootCue label="01 — globe" />
      </div>
      <div className="globe-overlay">
        <div className="g-hero">
          <div className="g-eyebrow">Data Engineer · Aviation</div>
          <h1 className="g-name">Vikram<span className="ast">*</span></h1>
          <div className="g-role">moving 500M events / day across 14 airports.</div>
        </div>
        <div className="g-readout">
          <div className="head">Live · network</div>
          <div className="row"><span className="k">airports</span><span className="v">14</span></div>
          <div className="row"><span className="k">live arcs</span><span className="v live">{liveArcs}</span></div>
          <div className="row"><span className="k">events / day</span><span className="v">500M</span></div>
          <div className="row"><span className="k">latency p99</span><span className="v">142ms</span></div>
        </div>
        <div className="g-hint">
          <span className="ic">↻</span>
          Drag to rotate
        </div>
        {card && (
          <div className="g-flight-card show" style={{ left: card.x, top: card.y }} ref={cardRef}>
            <span className="acc">●</span>
            <span>{card.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// V2 — TYPE / CSS-3D LETTERS (light, playful)
// ═════════════════════════════════════════════════════════
function TypeHero({ tweaks }) {
  const stageRef = useRef(null);
  const letterRefs = useRef([]);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  const LETTERS = [
    { c: 'V', accent: false },
    { c: 'I', accent: false },
    { c: 'K', accent: true },
    { c: 'R', accent: false },
    { c: 'A', accent: false },
    { c: 'M', accent: false },
  ];

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      pointerRef.current.x = (e.clientX - r.left) / r.width;
      pointerRef.current.y = (e.clientY - r.top) / r.height;
    };
    stage.addEventListener('pointermove', onMove);
    return () => stage.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    let raf = 0;
    // Per-letter eased follow
    const state = LETTERS.map(() => ({ rx: 0, ry: 0, sx: 1, sy: 1 }));
    const tick = () => {
      const { x: px, y: py } = pointerRef.current;
      letterRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const parent = stageRef.current.getBoundingClientRect();
        // Letter center in 0..1 of parent
        const lx = (r.left + r.width / 2 - parent.left) / parent.width;
        const ly = (r.top + r.height / 2 - parent.top) / parent.height;
        // Vector from letter center to pointer
        const dx = px - lx;
        const dy = py - ly;
        const targetRy = dx * 38;          // rotate Y around vertical
        const targetRx = -dy * 28;          // rotate X around horizontal
        // proximity scale
        const d = Math.sqrt(dx * dx + dy * dy);
        const close = Math.max(0, 1 - d * 3);
        const targetScale = 1 + close * 0.12;

        state[i].ry += (targetRy - state[i].ry) * 0.12;
        state[i].rx += (targetRx - state[i].rx) * 0.12;
        state[i].sx += (targetScale - state[i].sx) * 0.10;

        el.style.transform =
          `rotateY(${state[i].ry.toFixed(2)}deg) ` +
          `rotateX(${state[i].rx.toFixed(2)}deg) ` +
          `scale(${state[i].sx.toFixed(3)})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="scene v-type active">
      <div className="paper-grain"></div>
      <div className="chrome">
        <BrandMark />
        <Avail show={tweaks.avail} />
        <KbdRail />
        <FootCue label="02 — type" />
      </div>

      {/* Floating mono tags around the type */}
      {tweaks.motion && (
        <>
          <div className="t-tag" style={{ top: '14%', left: '6%', transform: 'rotate(-3deg)' }}>● Data Engineer</div>
          <div className="t-tag gold" style={{ top: '20%', right: '8%', transform: 'rotate(4deg)' }}>500M · daily</div>
          <div className="t-tag" style={{ bottom: '24%', left: '8%', transform: 'rotate(2deg)' }}>● Anuvu · Aviation</div>
          <div className="t-tag mint" style={{ bottom: '20%', right: '6%', transform: 'rotate(-3deg)' }}>● 7 years building pipes</div>
        </>
      )}

      <div className="t-stage" ref={stageRef}>
        <div className="t-row">
          {LETTERS.map((L, i) => (
            <div
              key={i}
              ref={(el) => (letterRefs.current[i] = el)}
              className={`t-letter ${L.accent ? 'gold' : ''}`}
            >
              <span className="face" data-l={L.c}>{L.c}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="t-aside role">a data engineer, building in aviation.</div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// V3 — FIELD / REACTIVE BARS (Three.js InstancedMesh)
// ═════════════════════════════════════════════════════════
function FieldHero({ tweaks }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    if (!window.THREE || !canvasRef.current || !wrapRef.current) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const cursor = cursorRef.current;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0d0c09, 14, 38);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 11, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Grid of bars via InstancedMesh
    const GRID = 36;
    const SPACING = 0.46;
    const total = GRID * GRID;
    const barGeo = new THREE.BoxGeometry(0.16, 1, 0.16);
    barGeo.translate(0, 0.5, 0); // pivot at bottom
    const barMat = new THREE.MeshBasicMaterial({ color: 0xE1E0CC });
    const mesh = new THREE.InstancedMesh(barGeo, barMat, total);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const colorAttr = new Float32Array(total * 3);
    const baseColor = new THREE.Color(0xE1E0CC);
    const goldColor = new THREE.Color(0xE8C77A);
    const tmpColor = new THREE.Color();
    const goldRow = Math.floor(GRID / 2); // central row gets gold
    for (let i = 0; i < total; i++) {
      const ix = i % GRID;
      const iz = Math.floor(i / GRID);
      const mix = (ix === goldRow || iz === goldRow) ? 0.9 : Math.random() * 0.1;
      tmpColor.copy(baseColor).lerp(goldColor, mix);
      colorAttr[i * 3]     = tmpColor.r;
      colorAttr[i * 3 + 1] = tmpColor.g;
      colorAttr[i * 3 + 2] = tmpColor.b;
    }
    mesh.instanceColor = new THREE.InstancedBufferAttribute(colorAttr, 3);
    scene.add(mesh);

    // Ground plane (subtle)
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshBasicMaterial({ color: 0x0d0c09, transparent: true, opacity: 0.6 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    scene.add(ground);

    // Pointer projected on ground plane
    const pointer = new THREE.Vector2(0, 0);
    const worldPointer = new THREE.Vector3(0, 0, 0);
    const raycaster = new THREE.Raycaster();
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      if (cursor) {
        cursor.style.left = (e.clientX) + 'px';
        cursor.style.top  = (e.clientY) + 'px';
      }
      raycaster.setFromCamera(pointer, camera);
      const hit = new THREE.Vector3();
      raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit);
      if (hit) worldPointer.copy(hit);
    };

    // Click → ripple
    const ripples = [];
    const onClick = (e) => {
      ripples.push({ cx: worldPointer.x, cz: worldPointer.z, t: 0, life: 1.6 });
    };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('click', onClick);

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const dummy = new THREE.Object3D();
    const half = (GRID - 1) * SPACING / 2;
    const baseHeights = new Float32Array(total);
    const cur = new Float32Array(total);
    const target = new Float32Array(total);

    let raf = 0;
    let t0 = performance.now();
    const tick = (now) => {
      const t = now / 1000;
      const dt = Math.min(0.05, (now - t0) / 1000);
      t0 = now;
      const mInt = tweaks.motion ? 1 : 0;

      for (let i = 0; i < total; i++) {
        const ix = i % GRID;
        const iz = Math.floor(i / GRID);
        const x = ix * SPACING - half;
        const z = iz * SPACING - half;

        // Base wave height
        const baseWave =
          Math.sin(t * 0.6 + x * 0.42 + Math.cos(z * 0.34)) * 0.6 +
          Math.sin(t * 0.4 + z * 0.38) * 0.4 +
          1.4;

        // Cursor depression — bars get TALLER near cursor (calm + playful)
        const dx = x - worldPointer.x;
        const dz = z - worldPointer.z;
        const d2 = dx * dx + dz * dz;
        const cursorBoost = Math.max(0, 3.5 - d2 * 0.6);

        // Ripples
        let rip = 0;
        for (let k = 0; k < ripples.length; k++) {
          const rp = ripples[k];
          const rdx = x - rp.cx;
          const rdz = z - rp.cz;
          const rd = Math.sqrt(rdx * rdx + rdz * rdz);
          const wave = Math.exp(-Math.pow(rd - rp.t * 9, 2) / 3) * (1 - rp.t / rp.life);
          rip += wave * 3.6;
        }

        target[i] = (baseWave * mInt) + cursorBoost + rip + 0.2;
        cur[i] += (target[i] - cur[i]) * (mInt > 0 ? 0.18 : 0.04);

        dummy.position.set(x, 0, z);
        dummy.scale.set(1, Math.max(0.05, cur[i]), 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;

      // Step ripples
      for (let k = ripples.length - 1; k >= 0; k--) {
        ripples[k].t += dt;
        if (ripples[k].t > ripples[k].life) ripples.splice(k, 1);
      }

      // Slow camera orbit
      const ang = mInt * t * 0.05;
      camera.position.x = Math.sin(ang) * 1.8;
      camera.lookAt(0, 0.5, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('click', onClick);
      renderer.dispose();
      barGeo.dispose();
      barMat.dispose();
    };
  }, [tweaks.motion]);

  return (
    <div className="scene v-field active" ref={wrapRef}>
      <canvas ref={canvasRef}></canvas>
      <div className="f-cursor" ref={cursorRef}><i className="h1"></i><i className="h2"></i></div>

      <div className="chrome">
        <BrandMark />
        <Avail show={tweaks.avail} />
        <KbdRail />
        <FootCue label="03 — field" />
      </div>

      <div className="f-overlay">
        <div className="f-name">
          <div className="top">Vikram Parmar · Spring 2026</div>
          <div className="big">data engineer<span className="ast">*</span></div>
          <div className="sub">building systems that decide in seconds, not days.</div>
        </div>

        <div className="f-card tl">
          <div className="h">moving</div>
          <div className="v">500<span className="unit">M / day</span></div>
        </div>
        <div className="f-card tr">
          <div className="h">across</div>
          <div className="v">8<span className="unit">airlines</span></div>
        </div>

        <a href="#work" className="f-cta">
          See selected work
          <span className="pill">→</span>
        </a>

        <div className="f-hint">click anywhere · ripple</div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// APP
// ═════════════════════════════════════════════════════════
const VARIANTS = [
  { id: 'globe', label: 'Globe · flight atlas',   Comp: GlobeHero },
  { id: 'type',  label: 'Type · 3D letters',       Comp: TypeHero },
  { id: 'field', label: 'Field · reactive bars',   Comp: FieldHero },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "variant": "globe",
  "avail": true,
  "motion": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const map = { '1': 'globe', '2': 'type', '3': 'field' };
      if (map[e.key]) setTweak('variant', map[e.key]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setTweak]);

  const { TweaksPanel, TweakSection, TweakSelect, TweakToggle } = window;
  const variant = VARIANTS.find(v => v.id === tweaks.variant) || VARIANTS[0];
  const Comp = variant.Comp;

  return (
    <div className="stage">
      <Comp key={variant.id} tweaks={tweaks} />

      <TweaksPanel title="Hero · Tweaks">
        <TweakSection label="Variant — press 1·2·3" />
        <TweakSelect
          label="Style"
          value={tweaks.variant}
          onChange={(v) => setTweak('variant', v)}
          options={VARIANTS.map(v => ({ value: v.id, label: v.label }))}
        />
        <TweakSection label="Details" />
        <TweakToggle
          label="Available indicator"
          value={tweaks.avail}
          onChange={(v) => setTweak('avail', v)}
        />
        <TweakToggle
          label="Motion / animation"
          value={tweaks.motion}
          onChange={(v) => setTweak('motion', v)}
        />
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
