const { useState, useEffect, useRef } = React;

const HERO_VIDEO = 'hero.mp4';
const CARD_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4';

// ── Icons ───────────────────────────────────────────────────────────
const Check = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ArrowRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const MailIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
const GitHubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.69-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17a10.8 10.8 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.57.23 2.73.11 3.02.73.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.79.56C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
  </svg>
);
const LinkedInIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66h-3.55V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>
  </svg>
);
const FileIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="13" x2="15" y2="13"/>
    <line x1="9" y1="17" x2="15" y2="17"/>
  </svg>
);
const CodeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);
const BookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

// ── WordsPullUp ─────────────────────────────────────────────────────
// Each word wrapped in overflow:hidden span; inner span animates from translateY(110%)
function WordsPullUp({ text, baseDelay = 0, perWord = 0.08, asterisk = false, className = '' }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((w, i) => {
        const isLast = i === words.length - 1;
        const delay = baseDelay + i * perWord;
        return (
          <React.Fragment key={i}>
            <span className="word">
              <span style={{ animationDelay: delay + 's' }}>
                {w}
                {asterisk && isLast && (
                  <span className="asterisk">*</span>
                )}
              </span>
            </span>
            {!isLast && (
              <span className="word">
                <span style={{ animationDelay: delay + 's' }}>{'\u00A0'}</span>
              </span>
            )}
          </React.Fragment>
        );
      })}
    </span>
  );
}

// Multi-style version: segments [{text, className}], each word in a segment shares className
function WordsPullUpInView({ segments, perWord = 0.08, className = '' }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  let counter = 0;
  return (
    <h2 ref={ref} className={`about-h ${on ? 'in' : ''} ${className}`}>
      {segments.map((seg, si) => {
        const words = seg.text.split(' ');
        return (
          <span key={si} className={`seg ${seg.className || ''}`}>
            {words.map((w, wi) => {
              const isLast = wi === words.length - 1 && si === segments.length - 1;
              const delay = counter * perWord;
              counter++;
              return (
                <React.Fragment key={wi}>
                  <span className="word">
                    <span style={{ animationDelay: delay + 's' }}>{w}</span>
                  </span>
                  {!isLast && (
                    <span className="word">
                      <span style={{ animationDelay: delay + 's' }}>{'\u00A0'}</span>
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </span>
        );
      })}
    </h2>
  );
}

// ── Scroll-linked character opacity ────────────────────────────────
function ScrollLitText({ text, className = '' }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    let raf = 0;
    const tick = () => {
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // Range: top of element hits 80% of viewport (start) → bottom hits 20% (end)
      const start = vh * 0.8;
      const end = vh * 0.2;
      const total = (start - end) + r.height;
      const traveled = (start - r.top);
      const p = Math.max(0, Math.min(1, traveled / total));
      setProgress(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const chars = [...text];
  return (
    <p ref={ref} className={className}>
      {chars.map((ch, i) => {
        const cp = i / chars.length;
        const lit = progress >= cp;
        return (
          <span key={i} className={`char ${lit ? 'lit' : ''}`}>
            {ch}
          </span>
        );
      })}
    </p>
  );
}

// ── Reveal on scroll ───────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .card, .fade-up');
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.85) el.classList.add('in');
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (e.target.classList.contains('card') && e.target.dataset.idx) {
            setTimeout(() => e.target.classList.add('in'), parseInt(e.target.dataset.idx) * 120);
          } else {
            e.target.classList.add('in');
          }
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── Animated counter (triggers on scroll into view) ───────────────
function Counter({ to, suffix = '', prefix = '', duration = 1600, format }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(eased * to);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.disconnect();
    }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration]);
  const display = format ? format(val) : Math.round(val).toLocaleString();
  return <span ref={ref}>{prefix}{display}{suffix && <span className="unit">{suffix}</span>}</span>;
}

// ── Active nav highlighting based on which section is in view ──────
function useActiveNav() {
  useEffect(() => {
    const links = document.querySelectorAll('.navbar a[href^="#"]');
    const sections = [...links].map(l => {
      const id = l.getAttribute('href').slice(1);
      return { link: l, el: document.getElementById(id) };
    }).filter(s => s.el);

    const update = () => {
      const y = window.scrollY + window.innerHeight * 0.3;
      let active = sections[0];
      for (const s of sections) {
        if (s.el.offsetTop <= y) active = s;
      }
      links.forEach(l => l.classList.remove('active'));
      active?.link.classList.add('active');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
}

// ── Scroll progress bar (top edge) ────────────────────────────────
function useProgressBar() {
  useEffect(() => {
    const bar = document.querySelector('.progress-bar');
    if (!bar) return;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const p = scrollable > 0 ? window.scrollY / scrollable : 0;
      bar.style.width = (p * 100) + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
}

// ── Architecture flow (calm static SVG-free row) ──────────────────
const ARCH_NODES = [
  { role: 'ingest',  name: 'Kafka' },
  { role: 'process', name: 'Airflow · Polars' },
  { role: 'store',   name: 'ClickHouse' },
  { role: 'serve',   name: 'API · Dash' },
  { role: 'observe', name: 'Grafana' },
];
function ArchFlow() {
  return (
    <div className="arch fade-up">
      <div className="arch-caption">/ Platform · data plane</div>
      <div className="arch-flow">
        {ARCH_NODES.flatMap((n, i) => {
          const node = (
            <div key={n.name} className="arch-node">
              <span className="role">{n.role}</span>
              <span className="name">{n.name}</span>
            </div>
          );
          const arr = i < ARCH_NODES.length - 1
            ? <span key={`a${i}`} className="arr">→</span>
            : null;
          return [node, arr].filter(Boolean);
        })}
      </div>
    </div>
  );
}

// ── Event Ticker — removed by user request; component kept out intentionally.

// ── HeroETL — Three.js particles morph from unstructured → structured on scroll
function HeroETL() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 9999, y: 9999, active: false });

  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight;
      const range = Math.max(h * 0.9, 600);
      progressRef.current = Math.max(0, Math.min(1, window.scrollY / range));
      const stage = progressRef.current < 0.2 ? 'e'
                  : progressRef.current < 0.55 ? 't'
                  : 'l';
      const el = document.querySelector('.etl-labels');
      if (el) el.setAttribute('data-stage', stage);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!window.THREE || !canvasRef.current || !wrapRef.current) return;
    const THREE = window.THREE;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 22);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Pointer tracking (in NDC -1..1)
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      pointerRef.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointerRef.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      pointerRef.current.active = true;
    };
    const onLeave = () => { pointerRef.current.active = false; };
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    // ─── BASE PARTICLES (data points) ─────────────────────────────
    const N = 580;
    const ROWS = 14;
    const COLS = Math.ceil(N / ROWS);
    const unstr = [];
    const tform = [];
    const struc = [];
    const positions = new Float32Array(N * 3);
    const velocities = new Float32Array(N * 3);
    const colors    = new Float32Array(N * 3);
    const sizesArr  = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      unstr.push(new THREE.Vector3(
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 14
      ));
      const row = i % ROWS;
      const col = Math.floor(i / ROWS);
      const gridW = (COLS - 1) * 0.55;
      const gridH = (ROWS - 1) * 0.78;
      tform.push(new THREE.Vector3(
        col * 0.55 - gridW / 2 + (Math.random() - 0.5) * 0.5,
        row * 0.78 - gridH / 2 + (Math.random() - 0.5) * 0.25,
        (Math.random() - 0.5) * 1.5
      ));
      struc.push(new THREE.Vector3(
        col * 0.55 - gridW / 2,
        row * 0.78 - gridH / 2,
        0
      ));
      positions[i*3]   = unstr[i].x;
      positions[i*3+1] = unstr[i].y;
      positions[i*3+2] = unstr[i].z;
      const isAccent = Math.random() < 0.08;
      const hue = isAccent ? 38 : 40 + Math.random() * 40;
      const sat = isAccent ? 70 : 25 + Math.random() * 30;
      const lt  = isAccent ? 78 : 68 + Math.random() * 18;
      const c = new THREE.Color(`hsl(${hue}, ${sat}%, ${lt}%)`);
      colors[i*3]   = c.r;
      colors[i*3+1] = c.g;
      colors[i*3+2] = c.b;
      sizesArr[i] = isAccent ? 0.32 : 0.14 + Math.random() * 0.10;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizesArr, 1));

    // Custom shader for varying point sizes
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: { value: 1 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float aSize;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * 320.0 / -mv.z;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.18, d);
          gl_FragColor = vec4(vColor, a * uOpacity);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ─── ROW LINES — appear on Load ─────────────────────────────
    const lineMat = new THREE.LineBasicMaterial({ color: 0xe1e0cc, transparent: true, opacity: 0 });
    for (let r = 0; r < ROWS; r++) {
      const lg = new THREE.BufferGeometry();
      const pts = new Float32Array(COLS * 3);
      for (let c = 0; c < COLS; c++) {
        const i = r + c * ROWS;
        if (i >= N) break;
        pts[c*3]   = struc[i].x;
        pts[c*3+1] = struc[i].y;
        pts[c*3+2] = struc[i].z;
      }
      lg.setAttribute('position', new THREE.BufferAttribute(pts, 3));
      scene.add(new THREE.Line(lg, lineMat));
    }

    // ─── TEXT TOKENS (data-engineering keywords floating in space) ──
    const TOKENS = [
      '{raw}', 'json', 'bytes', 'event', '@kafka', 'topic',
      'SELECT', 'JOIN', 'GROUP BY', 'CAST', 'PARTITION', 'schema',
      'aircraft_id', 'altitude', 'ts', 'route', 'rows', 'shard',
      '0x4f', '14ms', '99.9%', 'OK', 'parquet', 'avro',
    ];
    function makeTokenTexture(text, color) {
      const c = document.createElement('canvas');
      const fontPx = 36;
      c.width = 384; c.height = 96;
      const ctx = c.getContext('2d');
      ctx.font = `600 ${fontPx}px JetBrains Mono, ui-monospace, monospace`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = color;
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 6;
      ctx.fillText(text, 12, c.height / 2);
      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearFilter;
      return tex;
    }
    const tokenSprites = [];
    for (let i = 0; i < TOKENS.length; i++) {
      const t = TOKENS[i];
      const isAccent = i % 6 === 0;
      const color = isAccent ? '#E8C77A' : 'rgba(225,224,204,0.85)';
      const tex = makeTokenTexture(t, color);
      const sm = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false });
      const sp = new THREE.Sprite(sm);
      sp.scale.set(2.5, 0.62, 1);
      sp.position.set(
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8
      );
      sp.userData = {
        base: sp.position.clone(),
        drift: { x: (Math.random()-0.5)*0.4, y: (Math.random()-0.5)*0.3 },
        phase: Math.random() * Math.PI * 2,
        target: new THREE.Vector3(
          (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 4),
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 2
        ),
      };
      scene.add(sp);
      tokenSprites.push(sp);
    }

    // ─── DATA PULSES — bright packets flowing along curved paths ───
    function makePathPoints() {
      // Curved S-path from left → right
      const path = [];
      const startY = (Math.random() - 0.5) * 10;
      const endY   = (Math.random() - 0.5) * 10;
      const midY   = (startY + endY) / 2 + (Math.random() - 0.5) * 6;
      for (let t = 0; t <= 1; t += 0.04) {
        // Quadratic bezier
        const x = -14 + 28 * t;
        const a = (1 - t) * (1 - t);
        const b = 2 * (1 - t) * t;
        const c = t * t;
        const y = a * startY + b * midY + c * endY;
        path.push(new THREE.Vector3(x, y, (Math.random() - 0.5) * 0.5));
      }
      return path;
    }
    const PULSES = [];
    const pulseGeo = new THREE.SphereGeometry(0.10, 12, 12);
    const pulseColors = [0xE8C77A, 0xE1E0CC, 0x9FD9A8];
    function spawnPulse() {
      const m = new THREE.MeshBasicMaterial({
        color: pulseColors[Math.floor(Math.random() * pulseColors.length)],
        transparent: true,
      });
      const mesh = new THREE.Mesh(pulseGeo, m);
      // Tail (line behind it)
      const tailGeo = new THREE.BufferGeometry();
      tailGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(15), 3));
      const tailMat = new THREE.LineBasicMaterial({
        color: m.color, transparent: true, opacity: 0.5,
      });
      const tail = new THREE.Line(tailGeo, tailMat);
      scene.add(mesh);
      scene.add(tail);
      PULSES.push({
        mesh, tail, mat: m, tailMat,
        path: makePathPoints(),
        t: 0,
        speed: 0.004 + Math.random() * 0.005,
        history: [],
      });
    }
    for (let i = 0; i < 12; i++) spawnPulse();

    // ─── Animate ─────────────────────────────────────────────────
    const ease = (t) => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2;
    // Pointer in world space
    const pointerWorld = new THREE.Vector3();

    let raf = 0;
    const animate = (now) => {
      const p = progressRef.current;
      const pos = geo.attributes.position.array;

      // Compute pointer in world coords (z=0 plane)
      const pt = pointerRef.current;
      const ndc = new THREE.Vector3(pt.x, pt.y, 0.5);
      ndc.unproject(camera);
      const dir = ndc.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      pointerWorld.copy(camera.position).add(dir.multiplyScalar(dist));

      // Update particles
      const REPEL = pt.active && p < 0.4 ? 0.8 : 0;
      for (let i = 0; i < N; i++) {
        let tx, ty, tz;
        if (p < 0.5) {
          const t = ease(p / 0.5);
          tx = unstr[i].x + (tform[i].x - unstr[i].x) * t;
          ty = unstr[i].y + (tform[i].y - unstr[i].y) * t;
          tz = unstr[i].z + (tform[i].z - unstr[i].z) * t;
        } else {
          const t = ease((p - 0.5) / 0.5);
          tx = tform[i].x + (struc[i].x - tform[i].x) * t;
          ty = tform[i].y + (struc[i].y - tform[i].y) * t;
          tz = tform[i].z + (struc[i].z - tform[i].z) * t;
        }
        if (p < 0.06) {
          tx += Math.sin(now * 0.0008 + i) * 0.25;
          ty += Math.cos(now * 0.001  + i) * 0.20;
        }
        // Mouse repulsion (only in chaos / transform phases)
        if (REPEL > 0) {
          const dx = pos[i*3]   - pointerWorld.x;
          const dy = pos[i*3+1] - pointerWorld.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < 9) {
            const f = REPEL / Math.max(0.5, d2);
            tx += dx * f * 0.3;
            ty += dy * f * 0.3;
          }
        }
        pos[i*3]   += (tx - pos[i*3])   * 0.10;
        pos[i*3+1] += (ty - pos[i*3+1]) * 0.10;
        pos[i*3+2] += (tz - pos[i*3+2]) * 0.10;
      }
      geo.attributes.position.needsUpdate = true;

      // Row lines fade in
      lineMat.opacity = Math.max(0, (p - 0.65) / 0.35) * 0.30;

      // Tokens — drift around, fade in/out
      // E phase: high visibility; T phase: medium; L phase: low (replaced by structure)
      const tokenOpacity = p < 0.2 ? 0.85
                         : p < 0.6 ? 0.55
                         : Math.max(0, 0.3 - (p - 0.6) * 1.0);
      tokenSprites.forEach((sp, i) => {
        const ud = sp.userData;
        ud.phase += 0.005;
        if (p < 0.6) {
          // Free drift
          sp.position.x = ud.base.x + Math.sin(ud.phase) * 1.2 + ud.drift.x;
          sp.position.y = ud.base.y + Math.cos(ud.phase * 0.7) * 0.8 + ud.drift.y;
          ud.drift.x += (Math.random() - 0.5) * 0.002;
          ud.drift.y += (Math.random() - 0.5) * 0.002;
        } else {
          // Move toward target column position
          const lerp = (p - 0.6) / 0.4;
          sp.position.x += (ud.target.x - sp.position.x) * 0.04 * lerp;
          sp.position.y += (ud.target.y - sp.position.y) * 0.04 * lerp;
        }
        sp.material.opacity = tokenOpacity;
      });

      // Pulses
      for (let i = PULSES.length - 1; i >= 0; i--) {
        const pu = PULSES[i];
        pu.t += pu.speed;
        if (pu.t >= 1) {
          scene.remove(pu.mesh);
          scene.remove(pu.tail);
          PULSES.splice(i, 1);
          continue;
        }
        const idx = pu.t * (pu.path.length - 1);
        const i0 = Math.floor(idx);
        const i1 = Math.min(i0 + 1, pu.path.length - 1);
        const frac = idx - i0;
        const a = pu.path[i0], b = pu.path[i1];
        pu.mesh.position.lerpVectors(a, b, frac);
        // Brightness fades in/out
        const lifeFade = Math.sin(pu.t * Math.PI);
        pu.mat.opacity = lifeFade * 0.95;
        pu.tailMat.opacity = lifeFade * 0.4;
        // Tail history
        pu.history.unshift(pu.mesh.position.clone());
        if (pu.history.length > 5) pu.history.pop();
        const tarr = pu.tail.geometry.attributes.position.array;
        for (let k = 0; k < 5; k++) {
          const h = pu.history[k] || pu.mesh.position;
          tarr[k*3]   = h.x;
          tarr[k*3+1] = h.y;
          tarr[k*3+2] = h.z;
        }
        pu.tail.geometry.attributes.position.needsUpdate = true;
      }
      while (PULSES.length < 12) spawnPulse();

      // Camera
      camera.position.z = 22 - p * 5;
      camera.position.y = p * 0.5;
      camera.lookAt(0, 0, 0);
      // Slight idle scene drift when chaotic
      points.rotation.z = (1 - p) * Math.sin(now * 0.0003) * 0.10;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);

    const onVis = () => { if (!document.hidden) raf = requestAnimationFrame(animate); };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} className="etl-bg">
      <canvas ref={canvasRef}></canvas>
      <div className="etl-labels" data-stage="e">
        <div className="etl-label e">
          <span className="k">E</span>
          <span className="w">Extract</span>
          <span className="d">Raw events, unstructured</span>
        </div>
        <div className="etl-label t">
          <span className="k">T</span>
          <span className="w">Transform</span>
          <span className="d">Schema, lineage, sort</span>
        </div>
        <div className="etl-label l">
          <span className="k">L</span>
          <span className="w">Load</span>
          <span className="d">Columnar · query-ready</span>
        </div>
      </div>
    </div>
  );
}

function HeroVideoOLD() {
  const aRef = useRef(null);
  const bRef = useRef(null);

  useEffect(() => {
    const a = aRef.current, b = bRef.current;
    if (!a || !b) return;

    const FADE = 0.8; // seconds of crossfade overlap at loop point

    let primary = a;
    let standby = b;
    let crossing = false;

    const ensurePlay = (v) => {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    };

    // A is visible initially, B is preloaded but paused at 0 and invisible
    a.style.opacity = '1';
    b.style.opacity = '0';
    b.pause();
    b.currentTime = 0;
    ensurePlay(a);

    const onTime = () => {
      if (crossing) return;
      const v = primary;
      if (!v.duration || isNaN(v.duration)) return;
      const remaining = v.duration - v.currentTime;
      if (remaining <= FADE) {
        // Start the standby and crossfade
        crossing = true;
        standby.currentTime = 0;
        ensurePlay(standby);
        standby.style.opacity = '1';
        primary.style.opacity = '0';
        // After fade, swap roles
        const swapDelay = FADE * 1000 + 80;
        setTimeout(() => {
          const oldPrimary = primary;
          primary = standby;
          standby = oldPrimary;
          // standby (was primary) keeps playing in background until it ends,
          // then we reset it for the next cycle.
          const onEnd = () => {
            oldPrimary.removeEventListener('ended', onEnd);
            oldPrimary.pause();
            oldPrimary.currentTime = 0;
          };
          if (oldPrimary.ended) onEnd();
          else oldPrimary.addEventListener('ended', onEnd);
          crossing = false;
        }, swapDelay);
      }
    };

    const onPauseA = () => { if (!a.ended && primary === a) ensurePlay(a); };
    const onPauseB = () => { if (!b.ended && primary === b) ensurePlay(b); };
    const onVis = () => {
      if (!document.hidden) ensurePlay(primary);
    };

    a.addEventListener('timeupdate', onTime);
    b.addEventListener('timeupdate', onTime);
    a.addEventListener('pause', onPauseA);
    b.addEventListener('pause', onPauseB);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      a.removeEventListener('timeupdate', onTime);
      b.removeEventListener('timeupdate', onTime);
      a.removeEventListener('pause', onPauseA);
      b.removeEventListener('pause', onPauseB);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <>
      <video
        ref={aRef}
        className="hero-video"
        src={HERO_VIDEO}
        muted playsInline preload="auto"
        style={{ opacity: 1, transition: 'opacity 0.8s linear' }}
      />
      <video
        ref={bRef}
        className="hero-video"
        src={HERO_VIDEO}
        muted playsInline preload="auto"
        style={{ opacity: 0, transition: 'opacity 0.8s linear' }}
      />
    </>
  );
}

// ── Tech stack — brand-icon wall via devicon CDN ──────────────────
const STACK = [
  // Languages
  { name: 'Python',     icon: 'python/python-original' },
  { name: 'SQL',        icon: 'mysql/mysql-original',  alt: 'SQL' },
  { name: 'Bash',       icon: 'bash/bash-original' },
  // Streaming + orchestration
  { name: 'Kafka',      icon: 'apachekafka/apachekafka-original' },
  { name: 'Airflow',    icon: 'apacheairflow/apacheairflow-original' },
  { name: 'Spark',      icon: 'apachespark/apachespark-original' },
  // Stores
  { name: 'ClickHouse', icon: null, glyph: 'CH', tone: '#FBC319' },
  { name: 'MariaDB',    icon: 'mariadb/mariadb-original' },
  { name: 'MySQL',      icon: 'mysql/mysql-original' },
  { name: 'SQL Server', icon: 'microsoftsqlserver/microsoftsqlserver-plain' },
  // Processing
  { name: 'Polars',     icon: null, glyph: 'PL', tone: '#3E82F0' },
  { name: 'DuckDB',     icon: null, glyph: 'DD', tone: '#FFF000' },
  // Cloud + infra
  { name: 'AWS',        icon: 'amazonwebservices/amazonwebservices-plain-wordmark', mono: true },
  { name: 'Docker',     icon: 'docker/docker-original' },
  { name: 'Linux',      icon: 'linux/linux-original' },
  { name: 'Redis',      icon: 'redis/redis-original' },
  // AI / observability / dataviz
  { name: 'Claude API', icon: null, glyph: 'C',  tone: '#D97757' },
  { name: 'Grafana',    icon: 'grafana/grafana-original' },
  { name: 'Tableau',    icon: null, glyph: 'T',  tone: '#E97627' },
  { name: 'Git',        icon: 'git/git-original' },
];
function StackChip({ s }) {
  const url = s.icon
    ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${s.icon}.svg`
    : null;
  return (
    <div className="chip" title={s.name}>
      <span className="chip-ic" style={s.tone ? { color: s.tone } : undefined}>
        {url
          ? <img src={url} alt={s.alt || s.name} loading="lazy" />
          : <span className="chip-glyph">{s.glyph}</span>}
      </span>
      <span className="chip-name">{s.name}</span>
    </div>
  );
}

// ── 3D Architecture Scene (Three.js) ─────────────────────────────
// Orbiting wireframe network of named pipeline nodes, mouse-reactive.
function ArchScene() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!window.THREE || !canvasRef.current || !wrapRef.current) return;
    const THREE = window.THREE;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // pipeline nodes — left-to-right data flow with branches
    const nodes = [
      // ingest cluster
      { p: [-5.0,  0.8, -0.4], label: 'edge-iad', accent: true },
      { p: [-5.0, -0.2,  0.4], label: 'edge-dfw', accent: true },
      { p: [-5.0, -1.2, -0.2], label: 'edge-lax', accent: true },
      // kafka brokers
      { p: [-2.8,  0.8,  0.0], label: 'kafka-01' },
      { p: [-2.8, -0.8,  0.0], label: 'kafka-02' },
      // orchestration / processing
      { p: [-0.4,  1.6,  0.3], label: 'airflow' },
      { p: [-0.4,  0.2, -0.4], label: 'polars' },
      { p: [-0.4, -1.4,  0.3], label: 'pyspark' },
      { p: [-0.4, -2.6, -0.2], label: 's3·raw' },
      // store layer
      { p: [ 2.2,  0.8,  0.0], label: 'ch·shard-1', store: true },
      { p: [ 2.2, -0.8,  0.0], label: 'ch·shard-2', store: true },
      // serve layer
      { p: [ 4.4,  1.6, -0.2], label: 'grafana' },
      { p: [ 4.4,  0.0,  0.3], label: 'api·dash' },
      { p: [ 4.4, -1.6, -0.2], label: 'alerts' },
      // client
      { p: [ 5.6,  0.0,  0.0], label: 'client', accent: true },
    ];
    const edges = [
      [0, 3], [1, 3], [1, 4], [2, 4],
      [3, 5], [3, 6], [4, 6], [4, 7], [4, 8],
      [5, 9], [6, 9], [6, 10], [7, 10], [8, 10],
      [9, 11], [9, 12], [10, 12], [10, 13],
      [11, 14], [12, 14], [13, 14],
    ];

    const group = new THREE.Group();
    scene.add(group);

    // edges as lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xa19b8c,
      transparent: true,
      opacity: 0.18,
    });
    edges.forEach(([a, b]) => {
      const g = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...nodes[a].p),
        new THREE.Vector3(...nodes[b].p),
      ]);
      group.add(new THREE.Line(g, lineMat));
    });
    lineMat.opacity = 0.35;

    // nodes as small spheres with glow ring
    const accentColor = new THREE.Color(0xe8c77a);
    const creamColor = new THREE.Color(0xe1e0cc);
    const storeColor = new THREE.Color(0xc9c4b1);
    const nodeMeshes = [];
    nodes.forEach((n) => {
      const color = n.accent ? accentColor : (n.store ? storeColor : creamColor);
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(n.accent ? 0.10 : 0.07, 16, 16),
        new THREE.MeshBasicMaterial({ color })
      );
      sphere.position.set(...n.p);
      group.add(sphere);
      // halo ring
      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.15, 0.22, 24),
        new THREE.MeshBasicMaterial({
          color, transparent: true, opacity: 0.18, side: THREE.DoubleSide
        })
      );
      halo.position.set(...n.p);
      halo.lookAt(camera.position);
      group.add(halo);
      nodeMeshes.push({ sphere, halo, base: n.p, accent: !!n.accent });
    });

    // floating packets along edges
    const packetGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const packetMat = new THREE.MeshBasicMaterial({ color: accentColor });
    const packets = [];
    const spawnPacket = () => {
      const [a, b] = edges[Math.floor(Math.random() * edges.length)];
      const m = new THREE.Mesh(packetGeo, packetMat);
      m.position.set(...nodes[a].p);
      group.add(m);
      packets.push({
        m,
        from: new THREE.Vector3(...nodes[a].p),
        to:   new THREE.Vector3(...nodes[b].p),
        t: 0,
        speed: 0.008 + Math.random() * 0.012,
      });
    };
    for (let i = 0; i < 4; i++) spawnPacket();

    // ── pointer ─
    let pointerX = 0, pointerY = 0;
    const onPointerMove = (e) => {
      const r = wrap.getBoundingClientRect();
      pointerX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointerY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    wrap.addEventListener('pointermove', onPointerMove);

    let raf = 0;
    let lastSpawn = 0;
    let lastTime = performance.now();
    const animate = (now) => {
      const dt = Math.min(40, now - lastTime);
      lastTime = now;

      // idle slow rotation + parallax toward pointer
      const targetRotY = pointerX * 0.35 + Math.sin(now * 0.00018) * 0.18;
      const targetRotX = -pointerY * 0.2 + Math.sin(now * 0.00012) * 0.06;
      group.rotation.y += (targetRotY - group.rotation.y) * 0.04;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.04;

      // halos face camera
      nodeMeshes.forEach((nm, i) => {
        nm.halo.lookAt(camera.position);
        if (nm.accent) {
          const pulse = 0.18 + Math.sin(now * 0.003 + i) * 0.12;
          nm.halo.material.opacity = pulse;
        }
      });

      // packets
      if (now - lastSpawn > 360) { spawnPacket(); lastSpawn = now; }
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += p.speed * (dt / 16);
        if (p.t >= 1) {
          group.remove(p.m);
          packets.splice(i, 1);
          continue;
        }
        p.m.position.lerpVectors(p.from, p.to, p.t);
        const fade = Math.sin(p.t * Math.PI);
        p.m.scale.setScalar(0.6 + fade * 0.8);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    // Force one synchronous render so a hidden iframe still shows the scene.
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);

    // If the page is hidden during init, RAF is paused — restart on focus.
    const onVis = () => { if (!document.hidden) { lastTime = performance.now(); raf = requestAnimationFrame(animate); } };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVis);
      renderer.dispose();
    };
  }, []);
  return (
    <div ref={wrapRef} className="arch-3d fade-up">
      <div className="arch-caption">/ Platform · data plane · in motion</div>
      <canvas ref={canvasRef}></canvas>
      <div className="arch-hint">move cursor</div>
      <div className="arch-legend">
        <span className="lg"><span className="pip a"></span>ingest · client</span>
        <span className="lg"><span className="pip b"></span>compute · store</span>
      </div>
    </div>
  );
}

// ── Mouse tilt hook — applies 3D tilt to any element ──────────────
function useTilt(maxDeg = 6, lift = 8) {
  return (el) => {
    if (!el || el.__tiltBound) return;
    el.__tiltBound = true;
    const reset = () => {
      el.classList.remove('tilt-active');
      el.style.removeProperty('--tilt');
      el.style.transform = '';
    };
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const rx = (-y * maxDeg).toFixed(2);
      const ry = (x * maxDeg).toFixed(2);
      const t = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${lift}px)`;
      el.classList.add('tilt-active');
      el.style.setProperty('--tilt', t);
      el.style.transform = t;
    });
    el.addEventListener('pointerleave', reset);
  };
}

function useApplyTilt() {
  const bind = useTilt(7, 10);
  useEffect(() => {
    const t = setTimeout(() => {
      document.querySelectorAll('.card, .twin-cta, .deep-item').forEach(bind);
    }, 400);
    return () => clearTimeout(t);
  }, []);
}

// ── R3A Tilted Poster Carousel ──────────────────────────────
const POSTERS = [
  {
    cls: 'p1',
    num: '01 / Streaming',
    tag: 'KAFKA · CDC',
    title: '500M\nEvents\na day',
    sub: 'Sub-minute freshness for 8 aviation accounts.',
    stat: '500',
    unit: 'M / day',
  },
  {
    cls: 'p2',
    num: '02 / Warehouse',
    tag: 'CLICKHOUSE',
    title: '100TB\nMigration\nzero-DT',
    sub: 'Dashboards 45s → 5s. $23K/mo saved.',
    stat: '100',
    unit: 'TB',
  },
  {
    cls: 'p3',
    num: '03 / Agents',
    tag: 'AGENT · CLAUDE',
    title: '48hr\nto 4hr\nreporting',
    sub: '8 airline accounts, weekly agent-run cycle.',
    stat: '12×',
    unit: 'faster',
  },
  {
    cls: 'p4',
    num: '04 / OSS',
    tag: 'OPEN SOURCE',
    title: 'Slim\nMargin\nplugin',
    sub: 'Token-budget discipline for Claude Code.',
    stat: 'MIT',
    unit: '',
  },
];
function PostersSection() {
  return (
    <section className="posters-section fade-up" id="posters">
      <div className="posters-head">
        <h2 className="posters-label">
          <span className="small">/ Selected work</span>
          Four pieces.<br/>One platform.
        </h2>
        <p className="posters-caption">
          Streaming, warehouse, agents and open source — the four faces of how I move data
          for aviation clients at Anuvu. Tap any tile.
        </p>
      </div>
      <div className="posters-stage">
        <div className="posters-grid">
          {[...POSTERS, ...POSTERS].map((p, i) => (
            <a key={i} className={`poster ${p.cls}`} href="#platform" aria-hidden={i >= POSTERS.length}>
              <div className="poster-meta">
                <span className="poster-num">{p.num}</span>
                <span className="poster-tag"><span className="dot"></span>{p.tag}</span>
              </div>
              <div>
                <div className="poster-title">{p.title.split('\n').map((l, j) => <React.Fragment key={j}>{l}<br/></React.Fragment>)}</div>
                <div className="poster-sub">{p.sub}</div>
              </div>
              <div className="poster-stat">{p.stat}<span className="unit">{p.unit && ' ' + p.unit}</span></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Inside the Platform — interactive prototype with 3 tabs ─────
function InsidePlatform() {
  const [tab, setTab] = useState('stream');
  return (
    <section className="platform fade-up" id="platform">
      <div className="platform-inner">
        <div className="platform-head">
          <div>
            <div className="platform-eyebrow">/ Inside the platform</div>
            <h2 className="platform-h">
              How it <span className="accent">actually</span> runs.
            </h2>
          </div>
          <div className="platform-tabs" role="tablist">
            <button className={`platform-tab ${tab === 'stream' ? 'active' : ''}`}    onClick={() => setTab('stream')}    role="tab">Streaming</button>
            <button className={`platform-tab ${tab === 'warehouse' ? 'active' : ''}`} onClick={() => setTab('warehouse')} role="tab">Warehouse</button>
            <button className={`platform-tab ${tab === 'agents' ? 'active' : ''}`}    onClick={() => setTab('agents')}    role="tab">Agents</button>
          </div>
        </div>

        <div className="platform-frame">
          <div className="platform-titlebar">
            <span className="tl-dot"></span><span className="tl-dot"></span><span className="tl-dot"></span>
            <span className="tl-path">
              {tab === 'stream'    && '~/anuvu/streaming · live'}
              {tab === 'warehouse' && '~/anuvu/warehouse · ClickHouse'}
              {tab === 'agents'    && '~/anuvu/agents · slim-margin'}
            </span>
            <span className="tl-status">
              {tab === 'stream'    && 'streaming'}
              {tab === 'warehouse' && 'connected'}
              {tab === 'agents'    && 'budget green'}
            </span>
          </div>
          <div className="platform-body">
            {tab === 'stream'    && <StreamTab key="s" />}
            {tab === 'warehouse' && <WarehouseTab key="w" />}
            {tab === 'agents'    && <AgentsTab key="a" />}
          </div>
        </div>
      </div>
    </section>
  );
}

// Live event ticker with rising counter + sparkline
const STREAM_TOPICS = [
  'flight.telemetry', 'cabin.iot', 'aircraft.position', 'crew.events',
  'pax.usage', 'wifi.session', 'engine.metrics', 'route.update',
];
function StreamTab() {
  const [events, setEvents] = useState(() => {
    const seed = [];
    for (let i = 0; i < 10; i++) seed.push(makeEvent(i));
    return seed;
  });
  const [count, setCount] = useState(347_241_022);
  const [rate, setRate] = useState(5803);
  const idRef = useRef(100);
  const sparkRef = useRef(null);
  const historyRef = useRef([]);

  function makeEvent(i) {
    const d = new Date();
    return {
      id: i,
      ts: d.toISOString().slice(11, 19),
      topic: STREAM_TOPICS[Math.floor(Math.random() * STREAM_TOPICS.length)],
      size: (Math.floor(Math.random() * 8000) + 400),
    };
  }

  useEffect(() => {
    const t = setInterval(() => {
      setEvents(prev => [makeEvent(idRef.current++), ...prev].slice(0, 8));
      const newRate = Math.round(5400 + Math.random() * 1200);
      setRate(newRate);
      setCount(c => c + Math.round(newRate * 0.55));
      historyRef.current.push(newRate);
      if (historyRef.current.length > 60) historyRef.current.shift();
    }, 550);
    return () => clearInterval(t);
  }, []);

  // sparkline
  useEffect(() => {
    const c = sparkRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let raf = 0;
    const draw = () => {
      const r = c.getBoundingClientRect();
      c.width = r.width * dpr; c.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, r.width, r.height);
      const data = historyRef.current.length ? historyRef.current : [0];
      const min = Math.min(...data, 0), max = Math.max(...data, 7000);
      const range = (max - min) || 1;
      ctx.strokeStyle = '#2BD58A';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      data.forEach((v, i) => {
        const x = (i / Math.max(data.length - 1, 1)) * r.width;
        const y = r.height - ((v - min) / range) * (r.height - 16) - 8;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      // fill below
      ctx.lineTo(r.width, r.height);
      ctx.lineTo(0, r.height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(43, 213, 138, 0.08)';
      ctx.fill();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="stream-view">
      <div>
        <div className="stream-stats">
          <div className="stream-stat">
            <div className="lbl">Events ingested · today</div>
            <div className="val">{count.toLocaleString()}</div>
            <div className="delta">↑ {rate.toLocaleString()} / sec</div>
          </div>
          <div className="stream-stat">
            <div className="lbl">P99 lag</div>
            <div className="val">{Math.round(120 + Math.sin(Date.now()/2000) * 30)}<span className="unit">ms</span></div>
            <div className="delta">healthy</div>
          </div>
          <div className="stream-stat">
            <div className="lbl">Topics</div>
            <div className="val">{STREAM_TOPICS.length}<span className="unit">live</span></div>
            <div className="delta">all green</div>
          </div>
          <div className="stream-stat">
            <div className="lbl">Brokers</div>
            <div className="val">5<span className="unit">/ 5</span></div>
            <div className="delta">no rebalance</div>
          </div>
        </div>
        <div className="stream-spark">
          <canvas ref={sparkRef}></canvas>
        </div>
      </div>
      <div className="stream-list-wrap">
        <div className="stream-list-head">
          <span>live · cdc.aviation</span>
          <span>{rate.toLocaleString()} / s</span>
        </div>
        {events.map(e => (
          <div key={e.id} className="stream-event">
            <span className="ts">{e.ts}</span>
            <span className="topic">{e.topic}</span>
            <span className="sz">+{(e.size / 1024).toFixed(1)} KB</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Warehouse: side-by-side MariaDB vs ClickHouse query bench
function WarehouseTab() {
  const [running, setRunning] = useState(false);
  const [doneA, setDoneA] = useState(false);
  const [doneB, setDoneB] = useState(false);

  const run = () => {
    setRunning(true);
    setDoneA(false); setDoneB(false);
    setTimeout(() => setDoneB(true), 600);    // ClickHouse — done at <5s
    setTimeout(() => setDoneA(true), 4400);   // MariaDB — done after ~45s scaled
    setTimeout(() => setRunning(false), 5000);
  };
  useEffect(() => { setTimeout(run, 300); }, []);

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, gap: 16, flexWrap: 'wrap'}}>
        <div style={{color: 'rgba(255,255,255,0.55)', fontSize: 14}}>
          Real query against <b style={{color: '#fff'}}>14 days of flight telemetry</b>, <b style={{color: '#fff'}}>10B rows</b>.
        </div>
        <button onClick={run} disabled={running}
          style={{
            padding: '10px 18px', borderRadius: 999, border: 'none',
            background: running ? 'rgba(255,255,255,0.1)' : '#fff',
            color: running ? 'rgba(255,255,255,0.5)' : '#000',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            letterSpacing: '0.12em', textTransform: 'uppercase', cursor: running ? 'default' : 'pointer'
          }}>{running ? 'Running…' : 'Re-run query'}</button>
      </div>

      <div className="warehouse-view">
        <div className="warehouse-pane">
          <div className="warehouse-pane-head">
            <span className="title">Before · MariaDB</span>
            <span className="bench">single shard · row store</span>
          </div>
          <div className="warehouse-bar">
            <div className="fill" style={{width: running && !doneA ? '95%' : doneA ? '100%' : '0%'}}></div>
            <div className="lbl"><span>SELECT · WHERE · GROUP BY</span><span>{doneA ? '44.8s' : running ? '…' : '—'}</span></div>
          </div>
          <div className="warehouse-query">
            <span className="kw">SELECT</span> aircraft_id, <span className="kw">avg</span>(altitude){'\n'}
            <span className="kw">FROM</span> telemetry{'\n'}
            <span className="kw">WHERE</span> ts {'>='} <span className="str">'2026-05-07'</span>{'\n'}
            <span className="kw">GROUP BY</span> aircraft_id{'\n'}
            <span className="kw">ORDER BY</span> <span className="num">2</span> <span className="kw">DESC</span>;
          </div>
          <div className="warehouse-result">
            {doneA ? <><span className="ok">✓ Done</span><span>1,420 rows scanned <span style={{color:'rgba(255,255,255,0.4)'}}>(9.8B rows)</span></span><span className="ms">44,820ms</span></> :
              running ? <><span>Scanning…</span><span className="ms">42% · row reads spiking</span></> :
              <><span>Idle</span></>}
          </div>
        </div>

        <div className="warehouse-pane">
          <div className="warehouse-pane-head">
            <span className="title">After · ClickHouse</span>
            <span className="bench">8 shards · column store</span>
          </div>
          <div className="warehouse-bar fast">
            <div className="fill" style={{width: running && !doneB ? '60%' : doneB ? '100%' : '0%'}}></div>
            <div className="lbl"><span>SELECT · WHERE · GROUP BY</span><span>{doneB ? '4.6s' : running ? '…' : '—'}</span></div>
          </div>
          <div className="warehouse-query">
            <span className="kw">SELECT</span> aircraft_id, <span className="kw">avg</span>(altitude){'\n'}
            <span className="kw">FROM</span> telemetry_ch{'\n'}
            <span className="kw">WHERE</span> ts {'>='} <span className="str">'2026-05-07'</span>{'\n'}
            <span className="kw">GROUP BY</span> aircraft_id{'\n'}
            <span className="kw">ORDER BY</span> <span className="num">2</span> <span className="kw">DESC</span>;
          </div>
          <div className="warehouse-result">
            {doneB ? <><span className="ok">✓ Done</span><span>1,420 rows · vectorised scan</span><span className="ms">4,580ms · <b style={{color:'#2BD58A'}}>9.8×</b> faster</span></> :
              running ? <><span>Vectorised scan…</span><span className="ms">Almost done</span></> :
              <><span>Idle</span></>}
          </div>
        </div>
      </div>
    </div>
  );
}

// Agents: tier routing budget
function AgentsTab() {
  const [task, setTask] = useState('analyze');
  const profiles = {
    analyze: { opus: 8, sonnet: 72, haiku: 20, total: 24, saved: 88 },
    refactor: { opus: 2, sonnet: 18, haiku: 80, total: 9, saved: 96 },
    plan: { opus: 28, sonnet: 60, haiku: 12, total: 56, saved: 74 },
  };
  const p = profiles[task];
  return (
    <div className="agents-view">
      <div>
        <div style={{display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap'}}>
          {Object.keys(profiles).map(k => (
            <button key={k} onClick={() => setTask(k)}
              style={{
                padding: '8px 14px', borderRadius: 999,
                border: '1px solid ' + (task === k ? '#fff' : 'rgba(255,255,255,0.12)'),
                background: task === k ? '#fff' : 'transparent',
                color: task === k ? '#000' : 'rgba(255,255,255,0.7)',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer'
              }}>{k} task</button>
          ))}
        </div>
        <div className="agents-budget">
          <div className="agents-budget-head">
            <div className="title">slim-margin · Tier routing</div>
            <div className="sub">{task} · long context</div>
          </div>
          <div className={`agents-tier opus`}>
            <span className="tier-name">Opus</span>
            <span className="tier-bar"><span className="tier-fill" key={'opus' + task} style={{width: p.opus + '%'}}></span></span>
            <span className="tier-tok">{p.opus}%</span>
          </div>
          <div className={`agents-tier sonnet`}>
            <span className="tier-name">Sonnet</span>
            <span className="tier-bar"><span className="tier-fill" key={'sonnet' + task} style={{width: p.sonnet + '%'}}></span></span>
            <span className="tier-tok">{p.sonnet}%</span>
          </div>
          <div className={`agents-tier haiku`}>
            <span className="tier-name">Haiku</span>
            <span className="tier-bar"><span className="tier-fill" key={'haiku' + task} style={{width: p.haiku + '%'}}></span></span>
            <span className="tier-tok">{p.haiku}%</span>
          </div>
        </div>
      </div>
      <div className="agents-callouts">
        <div className="agents-callout">
          <div className="num">{p.total}<span className="unit">K tokens</span></div>
          <div className="desc">Total budget for a <b>{task}</b> task. The plugin auto-routes by complexity instead of pinning to a single tier.</div>
        </div>
        <div className="agents-callout">
          <div className="num">−{p.saved}<span className="unit">% saved</span></div>
          <div className="desc">Compared to running the same task on Opus-only. <b>slim-margin</b> is MIT licensed and ships on GitHub.</div>
        </div>
        <div className="agents-callout">
          <div className="num">7<span className="unit">agents live</span></div>
          <div className="desc">Internal toolkit covering pipeline scaffolding, validation, and token budgeting — in active use across the engineering org.</div>
        </div>
      </div>
    </div>
  );
}

// ── Tech mini-chip used inside work cards ────────────────────────
const TECH_ICON = {
  kafka:     { icon: 'apachekafka/apachekafka-original', name: 'Kafka' },
  airflow:   { icon: 'apacheairflow/apacheairflow-original', name: 'Airflow' },
  clickhouse:{ icon: null, glyph: 'CH', name: 'ClickHouse' },
  python:    { icon: 'python/python-original', name: 'Python' },
  aws:       { icon: 'amazonwebservices/amazonwebservices-plain-wordmark', name: 'AWS' },
  mariadb:   { icon: 'mariadb/mariadb-original', name: 'MariaDB' },
  polars:    { icon: null, glyph: 'PL', name: 'Polars' },
  duckdb:    { icon: null, glyph: 'DD', name: 'DuckDB' },
  pyspark:   { icon: 'apachespark/apachespark-original', name: 'PySpark' },
  claude:    { icon: null, glyph: 'C',  name: 'Claude API' },
};
function CardTech({ techs }) {
  return (
    <div className="card-tech">
      {techs.map((k) => {
        const t = TECH_ICON[k];
        if (!t) return null;
        const url = t.icon ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${t.icon}.svg` : null;
        return (
          <span key={k} className="mini">
            <span className="mini-ic">
              {url ? <img src={url} alt={t.name} loading="lazy" /> : <span className="mini-glyph">{t.glyph}</span>}
            </span>
            {t.name}
          </span>
        );
      })}
    </div>
  );
}

// ── Collab banner + contact form ─────────────────────────────────
function ContactForm() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const form = e.target;
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();
    if (!name || !email || !message) { setStatus('error'); return; }
    // Open mailto with prefilled body — works without a backend.
    const body = encodeURIComponent(`Hi Vikram,\n\n${message}\n\n— ${name}\n${email}`);
    const subject = encodeURIComponent(`Portfolio · ${name}`);
    window.location.href = `mailto:parmar.vik25@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => setStatus('sent'), 400);
  };
  return (
    <form className="form-inner" onSubmit={onSubmit}>
      <div className="form-eyebrow">/ Contact form</div>
      <p className="form-lede">
        Reach me directly at <a href="mailto:parmar.vik25@gmail.com">parmar.vik25@gmail.com</a>, or drop your details below.
      </p>
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">Your message</label>
        <textarea id="message" name="message" rows="5" required></textarea>
      </div>
      <p className="form-promise">
        I'll never share your data with anyone else. Pinky promise.
      </p>
      <button type="submit" className="form-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Opening mail…' : 'Send message'}
        <ArrowRight size={16} />
      </button>
      {status === 'error' && <div className="form-status">Please fill in all fields.</div>}
      {status === 'sent'  && <div className="form-status">Mail draft opened — hit send in your client.</div>}
    </form>
  );
}

// ── Keyboard navigation + visible key hint ──────────────────────
function Keyboard() {
  const [flashKey, setFlashKey] = useState(null);
  const [pressedKey, setPressedKey] = useState(null);
  const [hidden, setHidden] = useState(false);
  const flashTimerRef = useRef(null);
  const pressTimerRef = useRef(null);

  const KEYS = [
    { k: 'W', to: '#posters',  label: 'Work' },
    { k: 'P', to: '#platform', label: 'Platform' },
    { k: 'S', to: '#stack',    label: 'Stack' },
    { k: 'C', to: '#contact',  label: 'Contact' },
    { k: 'T', to: '#about',    label: 'Top' },
  ];

  const trigger = (key) => {
    const upper = key.toUpperCase();
    const found = KEYS.find(x => x.k === upper);
    if (!found) return;
    const target = document.querySelector(found.to);
    if (target) {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 24, behavior: 'smooth' });
    }
    // Flash overlay
    setFlashKey(upper);
    clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => setFlashKey(null), 350);
    // Press state on the visible cap
    setPressedKey(upper);
    clearTimeout(pressTimerRef.current);
    pressTimerRef.current = setTimeout(() => setPressedKey(null), 180);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.matches('input, textarea')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      trigger(e.key);
    };
    window.addEventListener('keydown', onKey);
    // Auto-hide hint after user has navigated past hero
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 2.5) setHidden(true);
      else setHidden(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(flashTimerRef.current);
      clearTimeout(pressTimerRef.current);
    };
  }, []);

  return (
    <>
      <div className={`kbd-hint ${hidden ? 'hidden' : ''}`}>
        <span className="kbd-hint-label">Press a key</span>
        {KEYS.map(({ k, label }) => (
          <button
            key={k}
            className={`kbd-key ${pressedKey === k ? 'pressed' : ''}`}
            onClick={() => trigger(k)}
            aria-label={label}
          >
            <span className="kbd-cap">{k}</span>
            <span className="kbd-label">{label}</span>
          </button>
        ))}
      </div>
      <div className={`kbd-flash ${flashKey ? 'on' : ''}`}>{flashKey}</div>
    </>
  );
}

// ── Custom cursor — dot + tracking ring with hover states ────────
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    let dx = -100, dy = -100, rx = -100, ry = -100, mx = -100, my = -100;
    let isText = false, isHover = false;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    const TARGETS = 'a, button, .poster, .card, .twin-cta, .platform-tab, .nav-icon, .chip, .deep-item, .links a, .stack-row, .navbar a, .form-submit, .arch-node, .stat';
    const TEXT_TARGETS = 'h1, h2, h3, p, .hero-title, .platform-h, .poster-title, .collab-h, .about-h';
    const onOver = (e) => {
      const t = e.target;
      isHover = !!(t.closest && t.closest(TARGETS));
      isText  = !isHover && !!(t.closest && t.closest(TEXT_TARGETS));
      if (!ringRef.current) return;
      ringRef.current.classList.toggle('hover', isHover);
      ringRef.current.classList.toggle('text',  isText);
    };
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    let raf = 0;
    const tick = () => {
      dx += (mx - dx) * 0.55;
      dy += (my - dy) * 0.55;
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${dx - 3}px, ${dy - 3}px)`;
      if (ringRef.current) {
        const off = ringRef.current.offsetWidth / 2;
        ringRef.current.style.transform = `translate(${rx - off}px, ${ry - off}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
    };
  }, []);
  return (
    <>
      <div ref={ringRef} className="cursor-ring"></div>
      <div ref={dotRef}  className="cursor-dot"></div>
    </>
  );
}

// ── Scroll cue — bottom-center "Scroll" hint, fades on scroll ────
function ScrollCue() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className={`scroll-cue ${hidden ? 'hidden' : ''}`}>
      <span>Scroll</span>
      <span className="scroll-cue-line"></span>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────
function App() {
  useReveal();
  useActiveNav();
  useProgressBar();
  useApplyTilt();
  return (
    <>
      <CustomCursor />
      <div className="progress-bar"></div>

      <nav className="navbar">
        <a href="#about">About</a>
        <a href="#posters">Work</a>
        <a href="#platform">Platform</a>
        <a href="#stack">Stack</a>
        <a href="#contact">Contact</a>
        <span className="nav-sep"></span>
        <a className="nav-icon" href="https://linkedin.com/in/vikramparmar25" target="_blank" rel="noopener" aria-label="LinkedIn">
          <LinkedInIcon size={14} />
        </a>
        <a className="nav-icon" href="https://github.com/markiv25" target="_blank" rel="noopener" aria-label="GitHub">
          <GitHubIcon size={14} />
        </a>
      </nav>
      {/* HERO */}
      <section className="hero">
        <div className="hero-frame">
          <HeroETL />
          <div className="hero-noise noise-overlay"></div>
          <div className="hero-gradient"></div>

          <ScrollCue />

          <div className="top-right">
            <span className="dot"></span>
            <span className="quiet">Austin, TX</span>
          </div>

          <div className="hero-content">
            <div>
              <div className="hero-prefix">I am</div>
              <h1 className="hero-title">
                <WordsPullUp text="Vikram" />
              </h1>
            </div>
            <div className="hero-text-col">
              <p>
                <em>Data engineer</em> running a real-time analytics platform for aviation
                clients at Anuvu — on Kafka, Airflow, and ClickHouse. Open-source maintainer;
                driving AI workflow adoption across engineering.
              </p>
              <a className="cta" href="#contact">
                Get in touch
                <span className="cta-circle"><ArrowRight size={16} /></span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="about-card">
          <div className="about-eyebrow">Data Engineering</div>
          <WordsPullUpInView
            segments={[
              { text: 'I am Vikram Parmar,', className: '' },
              { text: ' a data engineer.', className: 'serif' },
              { text: ' I build streaming pipelines, run the platform, and ship the tooling that keeps eight airline accounts in sub-minute data freshness.', className: '' },
            ]}
            perWord={0.07}
          />

          <ScrollLitText
            className="about-body"
            text={"Over three years at Anuvu I designed the Kafka-based CDC pipeline behind the platform, led the 100TB migration off MariaDB to ClickHouse, and built the data-quality framework now governing 10 production DAGs across the team. Past work at RIT and Ascension Health, where I built ETL and ingestion pipelines across departmental warehouses."}
          />
        </div>
      </section>

      {/* R3A TILTED POSTERS */}
      <PostersSection />

      {/* INSIDE THE PLATFORM — interactive prototype */}
      <InsidePlatform />

      {/* META — stack + contact */}
        <div className="prev fade-up" style={{maxWidth: 1280, margin: '0 auto', padding: '100px 24px 80px'}}>
          <div className="prev-eyebrow">/ Previously</div>
          <div className="prev-list">
            <div className="prev-row">
              <span className="prev-yr">2022</span>
              <span className="prev-role">Data Engineer Intern</span>
              <span className="prev-org">Rochester Institute of Technology · Rochester, NY</span>
            </div>
            <div className="prev-row">
              <span className="prev-yr">2022</span>
              <span className="prev-role">Master Data Management Intern</span>
              <span className="prev-org">Ascension Health · Remote</span>
            </div>
            <div className="prev-row">
              <span className="prev-yr">2020 – 2023</span>
              <span className="prev-role">M.S. Information Technology &amp; Analytics</span>
              <span className="prev-org">Rochester Institute of Technology</span>
            </div>
            <div className="prev-row">
              <span className="prev-yr">2019 – 2020</span>
              <span className="prev-role">Embedded Engineer</span>
              <span className="prev-org">AutoNxt Automation</span>
            </div>
            <div className="prev-row">
              <span className="prev-yr">2015 – 2019</span>
              <span className="prev-role">B.E. Electronics Engineering</span>
              <span className="prev-org">University of Mumbai</span>
            </div>
          </div>
        </div>

      {/* META — stack + contact */}
      <section className="meta" id="stack">
        <div className="meta-inner">
          <div className="meta-block fade-up">
            <div className="meta-eyebrow">Stack</div>
            <div className="chip-grid">
              {STACK.map((s) => <StackChip key={s.name} s={s} />)}
            </div>
          </div>
          <div className="meta-block reveal" id="contact">
            <div className="meta-eyebrow">Contact</div>
            <div className="links">
              <a href="mailto:parmar.vik25@gmail.com">
                <span className="link-l"><span className="link-ic"><MailIcon /></span>parmar.vik25@gmail.com</span>
                <span className="arrow"><ArrowRight /></span>
              </a>
              <a href="https://github.com/markiv25" target="_blank" rel="noopener">
                <span className="link-l"><span className="link-ic"><GitHubIcon /></span>github.com/markiv25</span>
                <span className="arrow"><ArrowRight /></span>
              </a>
              <a href="https://linkedin.com/in/vikramparmar25" target="_blank" rel="noopener">
                <span className="link-l"><span className="link-ic"><LinkedInIcon /></span>linkedin.com/in/vikramparmar25</span>
                <span className="arrow"><ArrowRight /></span>
              </a>
              <a href="VikramParmar_Resume.pdf" target="_blank" rel="noopener">
                <span className="link-l"><span className="link-ic"><FileIcon /></span>Résumé · PDF</span>
                <span className="arrow"><ArrowRight /></span>
              </a>
              <a href="https://github.com/markiv25/slim-margin" target="_blank" rel="noopener" id="open-source">
                <span className="link-l"><span className="link-ic"><CodeIcon /></span>slim-margin · open source</span>
                <span className="arrow"><ArrowRight /></span>
              </a>
              <a href="https://ieeexplore.ieee.org/document/10833898" target="_blank" rel="noopener">
                <span className="link-l"><span className="link-ic"><BookIcon /></span>IEEE · Anomaly Detection for Smart Home (2021)</span>
                <span className="arrow"><ArrowRight /></span>
              </a>
            </div>
          </div>
        </div>

        {/* COLLAB BANNER */}
        <section className="collab fade-up" id="collab">
          <div className="collab-eyebrow">/ Let's work together</div>
          <h2 className="collab-h">
            Let's build<br/>
            <span className="serif">something durable.</span>
          </h2>
          <p className="collab-sub">
            Hiring, collaborating, or just curious about how the platform runs?
            Drop a line below.
          </p>
        </section>

        {/* CONTACT FORM */}
        <section className="form-wrap" id="form">
          <ContactForm />
        </section>

        <footer>
          <span>© 2026 Vikram Kumar Parmar</span>
          <span>Built in HTML · Austin, TX</span>
        </footer>
      </section>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
