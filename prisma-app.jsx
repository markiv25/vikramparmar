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

// ── Theme toggle ────────────────────────────────────────────────
function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'dark';
    return document.documentElement.getAttribute('data-theme') || 'dark';
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('vp-theme', theme); } catch (e) {}
  }, [theme]);
  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  return (
    <button className={`theme-toggle ${theme}`} onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
      <svg className="ic-sun" width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg className="ic-moon" width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}

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

// ── HeroETL — PARTICLE CONSTELLATION (creative hero)
//    Particles drift, connect to near neighbors with thin lines, and
//    are magnetically pulled toward the cursor. Click anywhere to
//    drop an expanding shockwave. Gold "data packets" occasionally
//    travel along edges like signals.
function HeroETL() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');

    // Theme-aware palette (re-read each frame so toggling works live)
    const C = {
      get isLight() { return document.documentElement.getAttribute('data-theme') === 'light'; },
      get fadeFill()      { return this.isLight ? 'rgba(241, 240, 236, 0.34)' : 'rgba(8, 7, 5, 0.32)'; },
      get particle()      { return this.isLight ? 'rgba(26, 24, 20, 0.78)' : 'rgba(225, 224, 204, 0.85)'; },
      get line()          { return this.isLight ? '26, 24, 20' : '225, 224, 204'; },   // returns "r, g, b"
      get trail()         { return this.isLight ? 'rgba(26, 24, 20, 0.55)' : 'rgba(225, 224, 204, 0.55)'; },
      // gold stays gold in both themes
      gold:               'rgba(232, 199, 122, 0.95)',
      goldGlow:           'rgba(232, 199, 122, 0.18)',
    };

    let W = 0, H = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = wrap.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width  = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // ── particles
    const N = 220;
    const particles = [];
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        accent: Math.random() < 0.06,
        r: 0.9 + Math.random() * 1.3,
      });
    }

    // ── pointer (listen on window so overlay content doesn't block events)
    const pointer = { x: -9999, y: -9999, active: false, vx: 0, vy: 0, lastX: -9999, lastY: -9999 };
    const trail = [];
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const nx = e.clientX - r.left, ny = e.clientY - r.top;
      // Only count it as "active" if pointer is over the hero frame
      const insideX = nx >= 0 && nx <= r.width;
      const insideY = ny >= 0 && ny <= r.height;
      if (insideX && insideY) {
        if (pointer.active) { pointer.vx = nx - pointer.lastX; pointer.vy = ny - pointer.lastY; }
        pointer.x = nx; pointer.y = ny;
        pointer.lastX = nx; pointer.lastY = ny;
        pointer.active = true;
        trail.push({ x: nx, y: ny, t: 0 });
        if (trail.length > 30) trail.shift();
      } else {
        pointer.active = false;
      }
    };
    const onLeave = () => { pointer.active = false; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);

    // ── shockwave ripples — click anywhere in the hero
    const ripples = [];
    const onClick = (e) => {
      const r = wrap.getBoundingClientRect();
      const cx = e.clientX - r.left;
      const cy = e.clientY - r.top;
      if (cx < 0 || cy < 0 || cx > r.width || cy > r.height) return;
      ripples.push({ x: cx, y: cy, t: 0, life: 1.4 });
    };
    window.addEventListener('click', onClick);

    // ── data packets travelling along random connections
    const packets = [];
    const spawnPacket = () => {
      const a = Math.floor(Math.random() * particles.length);
      // Find a near neighbor
      let bestIdx = -1, bestDist = 9999;
      for (let i = 0; i < particles.length; i++) {
        if (i === a) continue;
        const dx = particles[i].x - particles[a].x;
        const dy = particles[i].y - particles[a].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160 && d < bestDist) { bestDist = d; bestIdx = i; }
      }
      if (bestIdx < 0) return;
      packets.push({ from: a, to: bestIdx, t: 0, speed: 0.012 + Math.random() * 0.018 });
    };

    // ── animate
    const CONN_DIST = 140;
    const CONN_DIST2 = CONN_DIST * CONN_DIST;
    const PULL_R = 360;
    const PULL_R2 = PULL_R * PULL_R;
    let raf = 0;
    let lastSpawn = 0;
    let t0 = performance.now();

    const tick = (now) => {
      const dt = Math.min(0.05, (now - t0) / 1000);
      t0 = now;

      // Background — slight fade for motion trails on the trail dots
      ctx.fillStyle = C.fadeFill;
      ctx.fillRect(0, 0, W, H);

      // Spawn packets occasionally
      if (now - lastSpawn > 320 && packets.length < 6) {
        spawnPacket();
        lastSpawn = now;
      }

      // Update particles
      for (let i = 0; i < N; i++) {
        const p = particles[i];

        // Subtle Brownian drift
        p.vx += (Math.random() - 0.5) * 0.018;
        p.vy += (Math.random() - 0.5) * 0.018;

        // Cursor attraction (much stronger pull — visibly drags particles)
        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < PULL_R2 && d2 > 16) {
            const d = Math.sqrt(d2);
            const f = (1 - d2 / PULL_R2) * 2.4;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }

        // Shockwave push
        for (let k = 0; k < ripples.length; k++) {
          const rp = ripples[k];
          const rdx = p.x - rp.x;
          const rdy = p.y - rp.y;
          const rd = Math.sqrt(rdx * rdx + rdy * rdy);
          const ringR = rp.t * 700;
          const distFromRing = Math.abs(rd - ringR);
          if (distFromRing < 80) {
            const punch = (1 - distFromRing / 80) * (1 - rp.t / rp.life) * 6;
            p.vx += (rdx / Math.max(rd, 0.01)) * punch;
            p.vy += (rdy / Math.max(rd, 0.01)) * punch;
          }
        }

        // Damping + integrate
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges (toroidal)
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
      }

      // Draw connection lines first (under particles)
      for (let i = 0; i < N; i++) {
        const a = particles[i];
        for (let j = i + 1; j < N; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < CONN_DIST2) {
            const alpha = (1 - d2 / CONN_DIST2) * 0.22;
            ctx.strokeStyle = `rgba(${C.line}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw shockwave rings
      for (let k = ripples.length - 1; k >= 0; k--) {
        const rp = ripples[k];
        rp.t += dt;
        const ringR = rp.t * 700;
        const alpha = Math.max(0, (1 - rp.t / rp.life)) * 0.6;
        ctx.strokeStyle = `rgba(232, 199, 122, ${alpha})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, ringR, 0, Math.PI * 2);
        ctx.stroke();
        // Soft secondary ring
        ctx.strokeStyle = `rgba(${C.line}, ${alpha * 0.4})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, ringR * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        if (rp.t > rp.life) ripples.splice(k, 1);
      }

      // Draw particles
      for (let i = 0; i < N; i++) {
        const p = particles[i];
        if (p.accent) {
          // glowing gold accent
          ctx.fillStyle = 'rgba(232, 199, 122, 0.95)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 1.7, 0, Math.PI * 2);
          ctx.fill();
          // halo
          ctx.fillStyle = 'rgba(232, 199, 122, 0.15)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = C.particle;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw data packets travelling along connections
      for (let k = packets.length - 1; k >= 0; k--) {
        const pk = packets[k];
        pk.t += pk.speed;
        if (pk.t >= 1) { packets.splice(k, 1); continue; }
        const from = particles[pk.from];
        const to   = particles[pk.to];
        if (!from || !to) { packets.splice(k, 1); continue; }
        const x = from.x + (to.x - from.x) * pk.t;
        const y = from.y + (to.y - from.y) * pk.t;
        const fade = Math.sin(pk.t * Math.PI);
        ctx.fillStyle = `rgba(232, 199, 122, ${fade * 0.95})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        // glow
        ctx.fillStyle = `rgba(232, 199, 122, ${fade * 0.2})`;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw cursor trail
      for (let i = trail.length - 1; i >= 0; i--) {
        const t = trail[i];
        t.t += dt;
        const fade = Math.max(0, 1 - t.t / 0.9);
        if (fade <= 0) { trail.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(${C.line}, ${fade * 0.55})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2 * fade + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw cursor — just the small inner dot
      if (pointer.active) {
        ctx.fillStyle = 'rgba(232, 199, 122, 0.95)';
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => { if (!document.hidden) { t0 = performance.now(); raf = requestAnimationFrame(tick); } };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div ref={wrapRef} className="etl-bg">
      <canvas ref={canvasRef}></canvas>
      <div className="hero-creative-hint">click anywhere · cursor pulls particles</div>
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

// ── Tech stack — pixel-shimmer grid w/ center heading ─────────────
// Each cell paints a brand-colored pixel field on hover (rippling in
// from the cell center), and the logo flips from grayscale to color.
const STACK = [
  // Row 1
  { name: 'Python',     icon: 'python/python-original',                          brand: '#3776AB', pixels: ['#3776AB', '#FFD43B', '#5A9FD4'],           row: 1, col: 1 },
  { name: 'SQL',        icon: 'mysql/mysql-original',                            brand: '#00758F', pixels: ['#00758F', '#F29111', '#5BB1C9'],           row: 1, col: 2, boost: 'bright' },
  { name: 'Bash',       icon: 'bash/bash-original',                              brand: '#4EAA25', pixels: ['#4EAA25', '#A8D154', '#293032'],           row: 1, col: 3, boost: 'bright' },
  { name: 'Kafka',      icon: 'apachekafka/apachekafka-original', mono: true,    brand: '#E1E0CC', pixels: ['#E1E0CC', '#E8C77A', '#6B6B6B'],           row: 1, col: 4, boost: 'invert' },
  { name: 'Airflow',    icon: 'apacheairflow/apacheairflow-original',            brand: '#017CEE', pixels: ['#017CEE', '#00AD46', '#FF7900'],           row: 1, col: 5 },
  // Row 2 — outer cells only (center heading block fills cols 2-4)
  { name: 'Spark',      icon: 'apachespark/apachespark-original',                brand: '#E25A1C', pixels: ['#E25A1C', '#FFB78B', '#1E2C36'],           row: 2, col: 1 },
  { name: 'ClickHouse', glyph: 'CH',                                             brand: '#FBC319', pixels: ['#FBC319', '#FAFF69', '#FFE066'],           row: 2, col: 5 },
  // Row 3 — outer cells only
  { name: 'Polars',     glyph: 'PL',                                             brand: '#3E82F0', pixels: ['#3E82F0', '#7BAEF7', '#A7CDFB'],           row: 3, col: 1 },
  { name: 'MariaDB',    icon: 'mariadb/mariadb-original',                        brand: '#5C9DBD', pixels: ['#5C9DBD', '#88B7CD', '#003545'],           row: 3, col: 5, boost: 'bright' },
  // Row 4
  { name: 'AWS',        icon: 'amazonwebservices/amazonwebservices-plain-wordmark', mono: true, brand: '#FF9900', pixels: ['#FF9900', '#FFCC80', '#232F3E'], row: 4, col: 1 },
  { name: 'Docker',     icon: 'docker/docker-original',                          brand: '#2496ED', pixels: ['#2496ED', '#79C6FA', '#0DB7ED'],           row: 4, col: 2 },
  { name: 'Claude',     glyph: 'C',                                              brand: '#D97757', pixels: ['#D97757', '#E89B83', '#F2C5B0'],           row: 4, col: 3 },
  { name: 'Grafana',    icon: 'grafana/grafana-original',                        brand: '#F46800', pixels: ['#F46800', '#FFC107', '#FF8800'],           row: 4, col: 4 },
  { name: 'Git',        icon: 'git/git-original',                                brand: '#F05032', pixels: ['#F05032', '#F8918C', '#FBC4C0'],           row: 4, col: 5 },
];

// PixelCanvas — animated grid of pixels that ripples in from center on
// hover and fades out on leave. Pure 2D canvas, no extra deps.
function PixelCanvas({ colors, gap = 5, speed = 30, parentRef }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const pixelsRef = useRef([]);
  const rafRef = useRef(0);
  const lastFrameRef = useRef(performance.now());

  const init = () => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = wrap.getBoundingClientRect();
    const w = Math.floor(width), h = Math.floor(height);
    canvas.width = w; canvas.height = h;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';

    const effectiveSpeed = Math.min(speed, 100) * 0.001;
    const rand = (a, b) => Math.random() * (b - a) + a;
    const pixels = [];
    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dx = x - w / 2, dy = y - h / 2;
        const delay = Math.sqrt(dx * dx + dy * dy);
        const p = {
          x, y, color,
          speed: rand(0.1, 0.9) * effectiveSpeed,
          size: 0, sizeStep: Math.random() * 0.4,
          minSize: 0.5, maxSizeInt: 2,
          maxSize: rand(0.5, 2),
          delay, counter: 0,
          counterStep: Math.random() * 4 + (w + h) * 0.01,
          isIdle: false, isReverse: false, isShimmer: false,
        };
        p.draw = () => {
          const offset = p.maxSizeInt * 0.5 - p.size * 0.5;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x + offset, p.y + offset, p.size, p.size);
        };
        p.appear = () => {
          p.isIdle = false;
          if (p.counter <= p.delay) { p.counter += p.counterStep; return; }
          if (p.size >= p.maxSize) p.isShimmer = true;
          if (p.isShimmer) {
            if (p.size >= p.maxSize) p.isReverse = true;
            else if (p.size <= p.minSize) p.isReverse = false;
            p.size += p.isReverse ? -p.speed : p.speed;
          } else {
            p.size += p.sizeStep;
          }
          p.draw();
        };
        p.disappear = () => {
          p.isShimmer = false; p.counter = 0;
          if (p.size <= 0) { p.isIdle = true; return; }
          p.size -= 0.1;
          p.draw();
        };
        pixels.push(p);
      }
    }
    pixelsRef.current = pixels;
  };

  const animate = (mode) => {
    cancelAnimationFrame(rafRef.current);
    const frameInterval = 1000 / 60;
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const now = performance.now();
      const elapsed = now - lastFrameRef.current;
      if (elapsed < frameInterval) return;
      lastFrameRef.current = now - (elapsed % frameInterval);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pixels = pixelsRef.current;
      for (const px of pixels) px[mode]();
      if (pixels.every((p) => p.isIdle)) cancelAnimationFrame(rafRef.current);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    init();
    const ro = new ResizeObserver(() => init());
    if (wrapRef.current) ro.observe(wrapRef.current);
    const card = parentRef?.current || wrapRef.current?.parentElement;
    const onEnter = () => animate('appear');
    const onLeave = () => animate('disappear');
    card?.addEventListener('mouseenter', onEnter);
    card?.addEventListener('mouseleave', onLeave);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      card?.removeEventListener('mouseenter', onEnter);
      card?.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="pix-wrap">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

function StackCell({ s }) {
  const cardRef = useRef(null);
  const url = s.icon
    ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${s.icon}.svg`
    : null;
  return (
    <div
      ref={cardRef}
      className={`stack-cell ${s.mono ? 'mono' : ''}`}
      data-boost={s.boost || null}
      style={{ gridRow: s.row, gridColumn: s.col, '--brand': s.brand }}
      title={s.name}
    >
      <PixelCanvas colors={s.pixels} gap={5} speed={30} parentRef={cardRef} />
      <span className="stack-ic">
        {url
          ? <img src={url} alt={s.name} loading="lazy" />
          : <span className="stack-glyph">{s.glyph}</span>}
      </span>
      <span className="stack-name">{s.name}</span>
    </div>
  );
}

function StackGrid() {
  return (
    <div className="stack-grid">
      {STACK.map((s) => <StackCell key={s.name} s={s} />)}
      <div className="stack-center">
        <span className="stack-badge">/ Stack</span>
        <h3>
          The tools I reach for &mdash; <em>every day,</em><br/>
          across <em>500M events</em>.
        </h3>
      </div>
    </div>
  );
}

// ── 3D Architecture Scene (Three.js) ─────────────────────────────
// Orbiting wireframe network of named pipeline nodes, mouse-reactive.
function ArchScene() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
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
    const isLight = theme === 'light';
    const lineMat = new THREE.LineBasicMaterial({
      color: isLight ? 0x4a4540 : 0xa19b8c,
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
    const creamColor = new THREE.Color(isLight ? 0x1a1814 : 0xe1e0cc);
    const storeColor = new THREE.Color(isLight ? 0x5a5550 : 0xc9c4b1);
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
  }, [theme]);
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

// ── Animated characters + contact form ──────────────────────────
// Four cartoon characters live behind the form; eyes track mouse, bodies
// lean toward it, occasional blinks, and they glance at each other when
// any field is focused.

// ── Contact link cards — gradient-glow grid ──────────────────────
const ArrowSmall = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CONTACTS = [
  {
    name: 'Email', desc: 'parmar.vik25@gmail.com', cta: 'Drop a message',
    href: 'mailto:parmar.vik25@gmail.com',
    icon: <MailIcon size={22} />,
    grad: ['#E8C77A', '#D9A38B'], shadow: 'rgba(232, 199, 122, 0.45)',
  },
  {
    name: 'GitHub', desc: 'github.com/markiv25', cta: 'See repos',
    href: 'https://github.com/markiv25', target: '_blank',
    icon: <GitHubIcon size={22} />,
    grad: ['#9b9b9b', '#3a3a3a'], shadow: 'rgba(180, 180, 180, 0.35)',
  },
  {
    name: 'LinkedIn', desc: 'in/vikramparmar25', cta: 'Connect',
    href: 'https://linkedin.com/in/vikramparmar25', target: '_blank',
    icon: <LinkedInIcon size={22} />,
    grad: ['#5C9DBD', '#0A66C2'], shadow: 'rgba(92, 157, 189, 0.45)',
  },
  {
    name: 'Résumé', desc: 'PDF · full background', cta: 'Download',
    href: 'VikramParmar_Resume.pdf', target: '_blank',
    icon: <FileIcon size={22} />,
    grad: ['#E8C77A', '#a17c20'], shadow: 'rgba(232, 199, 122, 0.4)',
  },
  {
    name: 'slim-margin', desc: 'OSS · Claude plugin', cta: 'View repo',
    href: 'https://github.com/markiv25/slim-margin', target: '_blank', id: 'open-source',
    icon: <CodeIcon size={22} />,
    grad: ['#9FD9A8', '#5C7C5F'], shadow: 'rgba(159, 217, 168, 0.45)',
  },
  {
    name: 'IEEE Paper', desc: 'Anomaly Detection · 2021', cta: 'Read paper',
    href: 'https://ieeexplore.ieee.org/document/10833898', target: '_blank',
    icon: <BookIcon size={22} />,
    grad: ['#D9A38B', '#8C5E4F'], shadow: 'rgba(217, 163, 139, 0.45)',
  },
];

function ContactLinks() {
  return (
    <div className="contact-grid">
      {CONTACTS.map((c) => (
        <a
          key={c.name}
          href={c.href}
          target={c.target}
          rel={c.target ? 'noopener' : undefined}
          id={c.id}
          className="contact-card"
          style={{
            '--cc-from': c.grad[0],
            '--cc-to': c.grad[1],
            '--cc-shadow': c.shadow,
          }}
        >
          <span className="cc-shimmer"></span>
          <span className="cc-icon">{c.icon}</span>
          <div className="cc-name">{c.name}</div>
          <div className="cc-desc">{c.desc}</div>
          <div className="cc-cta">
            <span>{c.cta}</span>
            <ArrowSmall size={14} />
          </div>
        </a>
      ))}
    </div>
  );
}

function Pupil({ size = 12, maxDistance = 5, pupilColor = '#2D2D2D', forceLookX, forceLookY, mouseRef }) {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (ref.current) {
        let x, y;
        if (forceLookX !== undefined && forceLookY !== undefined) {
          x = forceLookX; y = forceLookY;
        } else if (mouseRef && mouseRef.current) {
          const r = ref.current.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = mouseRef.current.x - cx;
          const dy = mouseRef.current.y - cy;
          const d = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
          const ang = Math.atan2(dy, dx);
          x = Math.cos(ang) * d;
          y = Math.sin(ang) * d;
        } else { x = 0; y = 0; }
        ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [forceLookX, forceLookY, maxDistance]);
  return (
    <div ref={ref} style={{
      width: size, height: size, backgroundColor: pupilColor,
      borderRadius: '50%', transition: 'transform 0.1s ease-out',
    }} />
  );
}

function EyeBall({
  size = 18, pupilSize = 7, maxDistance = 5,
  eyeColor = 'white', pupilColor = '#2D2D2D',
  isBlinking, forceLookX, forceLookY, mouseRef,
}) {
  const eyeRef = useRef(null);
  const pupilRef = useRef(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (eyeRef.current && pupilRef.current) {
        let x, y;
        if (forceLookX !== undefined && forceLookY !== undefined) {
          x = forceLookX; y = forceLookY;
        } else if (mouseRef && mouseRef.current) {
          const r = eyeRef.current.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = mouseRef.current.x - cx;
          const dy = mouseRef.current.y - cy;
          const d = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
          const ang = Math.atan2(dy, dx);
          x = Math.cos(ang) * d;
          y = Math.sin(ang) * d;
        } else { x = 0; y = 0; }
        pupilRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [forceLookX, forceLookY, maxDistance]);
  return (
    <div ref={eyeRef} style={{
      width: size, height: isBlinking ? 2 : size,
      backgroundColor: eyeColor, borderRadius: '50%',
      overflow: 'hidden', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      transition: 'height 0.15s ease',
    }}>
      {!isBlinking && (
        <div ref={pupilRef} style={{
          width: pupilSize, height: pupilSize,
          backgroundColor: pupilColor, borderRadius: '50%',
          transition: 'transform 0.1s ease-out',
        }} />
      )}
    </div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState('idle');
  const [typing, setTyping] = useState(false);
  const [purpleBlink, setPurpleBlink] = useState(false);
  const [blackBlink, setBlackBlink] = useState(false);
  const [lookAtEachOther, setLookAtEachOther] = useState(false);

  const mouseRef = useRef({ x: -9999, y: -9999 });
  const purpleRef = useRef(null);
  const blackRef = useRef(null);
  const orangeRef = useRef(null);
  const yellowRef = useRef(null);

  // Track global mouse
  useEffect(() => {
    const onMove = (e) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Random blinks for purple + black (3–7s intervals, 150ms blink)
  useEffect(() => {
    let tA, tB, alive = true;
    const sched = (setter) => {
      const ms = Math.random() * 4000 + 3000;
      return setTimeout(() => {
        if (!alive) return;
        setter(true);
        setTimeout(() => {
          if (!alive) return;
          setter(false);
          if (setter === setPurpleBlink) tA = sched(setter);
          else                            tB = sched(setter);
        }, 150);
      }, ms);
    };
    tA = sched(setPurpleBlink);
    tB = sched(setBlackBlink);
    return () => { alive = false; clearTimeout(tA); clearTimeout(tB); };
  }, []);

  // Glance at each other briefly when typing starts
  useEffect(() => {
    if (!typing) { setLookAtEachOther(false); return; }
    setLookAtEachOther(true);
    const t = setTimeout(() => setLookAtEachOther(false), 900);
    return () => clearTimeout(t);
  }, [typing]);

  // Body skew loop — each character leans toward the cursor
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const refs = [
        { ref: purpleRef, divisor: 120, isBlack: false },
        { ref: blackRef,  divisor: 80,  isBlack: true  },
        { ref: orangeRef, divisor: 120, isBlack: false },
        { ref: yellowRef, divisor: 120, isBlack: false },
      ];
      refs.forEach(({ ref, divisor, isBlack }) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const dx = mouseRef.current.x - cx;
        const skew = Math.max(-6, Math.min(6, -dx / divisor));
        if (isBlack && lookAtEachOther) {
          ref.current.style.transform = `skewX(${skew * 1.5 + 10}deg) translateX(20px)`;
        } else {
          ref.current.style.transform = `skewX(${skew}deg)`;
        }
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [lookAtEachOther]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const form = e.target;
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();
    if (!name || !email || !message) { setStatus('error'); return; }
    const body = encodeURIComponent(`Hi Vikram,\n\n${message}\n\n— ${name}\n${email}`);
    const subject = encodeURIComponent(`Portfolio · ${name}`);
    window.location.href = `mailto:parmar.vik25@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => setStatus('sent'), 400);
  };

  const onFieldFocus = () => setTyping(true);
  const onFieldBlur  = () => setTyping(false);

  return (
    <div className="contact-shell">
      {/* Animated characters — lg+ only */}
      <div className="characters-stage" aria-hidden="true">
        <div className="characters">

          {/* Purple — back tall */}
          <div ref={purpleRef} className="character" style={{
            left: 70, width: 180,
            height: typing ? 440 : 400,
            backgroundColor: '#6C3FF5',
            borderRadius: '10px 10px 0 0',
            zIndex: 1,
          }}>
            <div className="char-eyes" style={{
              left: lookAtEachOther ? 55 : 45,
              top:  lookAtEachOther ? 65 : 40,
              gap: 32,
            }}>
              <EyeBall mouseRef={mouseRef} size={18} pupilSize={7} maxDistance={5}
                isBlinking={purpleBlink}
                forceLookX={lookAtEachOther ? 3 : undefined}
                forceLookY={lookAtEachOther ? 4 : undefined} />
              <EyeBall mouseRef={mouseRef} size={18} pupilSize={7} maxDistance={5}
                isBlinking={purpleBlink}
                forceLookX={lookAtEachOther ? 3 : undefined}
                forceLookY={lookAtEachOther ? 4 : undefined} />
            </div>
          </div>

          {/* Black — middle tall */}
          <div ref={blackRef} className="character" style={{
            left: 240, width: 120, height: 310,
            backgroundColor: '#1F1D19',
            borderRadius: '8px 8px 0 0',
            zIndex: 2,
          }}>
            <div className="char-eyes" style={{
              left: lookAtEachOther ? 32 : 26,
              top:  lookAtEachOther ? 12 : 32,
              gap: 24,
            }}>
              <EyeBall mouseRef={mouseRef} size={16} pupilSize={6} maxDistance={4}
                isBlinking={blackBlink}
                forceLookX={lookAtEachOther ? 0 : undefined}
                forceLookY={lookAtEachOther ? -4 : undefined} />
              <EyeBall mouseRef={mouseRef} size={16} pupilSize={6} maxDistance={4}
                isBlinking={blackBlink}
                forceLookX={lookAtEachOther ? 0 : undefined}
                forceLookY={lookAtEachOther ? -4 : undefined} />
            </div>
          </div>

          {/* Orange — front-left semi-circle */}
          <div ref={orangeRef} className="character" style={{
            left: 0, width: 240, height: 200,
            backgroundColor: '#FF9B6B',
            borderRadius: '120px 120px 0 0',
            zIndex: 3,
          }}>
            <div className="char-eyes" style={{ left: 82, top: 90, gap: 32 }}>
              <Pupil mouseRef={mouseRef} size={12} maxDistance={5} pupilColor="#1F1D19" />
              <Pupil mouseRef={mouseRef} size={12} maxDistance={5} pupilColor="#1F1D19" />
            </div>
          </div>

          {/* Yellow — front-right with mouth */}
          <div ref={yellowRef} className="character" style={{
            left: 310, width: 140, height: 230,
            backgroundColor: '#E8D754',
            borderRadius: '70px 70px 0 0',
            zIndex: 4,
          }}>
            <div className="char-eyes" style={{ left: 52, top: 40, gap: 24 }}>
              <Pupil mouseRef={mouseRef} size={12} maxDistance={5} pupilColor="#1F1D19" />
              <Pupil mouseRef={mouseRef} size={12} maxDistance={5} pupilColor="#1F1D19" />
            </div>
            <div style={{
              position: 'absolute', left: 40, top: 88,
              width: 80, height: 4, borderRadius: 999,
              backgroundColor: '#1F1D19',
            }} />
          </div>
        </div>
      </div>

      {/* Form — right column on lg+, full width on mobile */}
      <form className="form-inner" onSubmit={onSubmit}>
        <div className="form-eyebrow">/ Contact form</div>
        <p className="form-lede">
          Reach me directly at <a href="mailto:parmar.vik25@gmail.com">parmar.vik25@gmail.com</a>, or drop your details below.
        </p>
        <div className="form-row">
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" type="text" required autoComplete="name"
              onFocus={onFieldFocus} onBlur={onFieldBlur} />
          </div>
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" required autoComplete="email"
              onFocus={onFieldFocus} onBlur={onFieldBlur} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="message">Your message</label>
          <textarea id="message" name="message" rows="5" required
            onFocus={onFieldFocus} onBlur={onFieldBlur}></textarea>
        </div>
        <p className="form-promise">
          I'll never share your data with anyone else. Pinky promise. 🤙
        </p>
        <button type="submit" className="form-submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Opening mail…' : 'Send message'}
          <ArrowRight size={16} />
        </button>
        {status === 'error' && <div className="form-status">Please fill in all fields.</div>}
        {status === 'sent'  && <div className="form-status">Mail draft opened — hit send in your client.</div>}
      </form>
    </div>
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
        <ThemeToggle />
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
            <span className="stat"><b>Open</b> to Data Engineer roles</span>
            <span className="sep">·</span>
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
                <em>Data engineer</em> with <b style={{color:'var(--cream)',fontWeight:500}}>3.5+ years</b> of experience.
                I build streaming pipelines, run the platform, and ship the tooling that keeps
                <b style={{color:'var(--cream)',fontWeight:500}}> eight airline accounts</b> in sub-minute data freshness.
              </p>
              <div className="hero-stats">
                <div className="hs">
                  <span className="hs-num">500<span className="hs-unit">M</span></span>
                  <span className="hs-lbl">events / day</span>
                </div>
                <div className="hs-sep"></div>
                <div className="hs">
                  <span className="hs-num">8</span>
                  <span className="hs-lbl">airline accounts</span>
                </div>
                <div className="hs-sep"></div>
                <div className="hs">
                  <span className="hs-num">142<span className="hs-unit">ms</span></span>
                  <span className="hs-lbl">p99 latency</span>
                </div>
              </div>
              <div className="hero-ctas">
                <a className="cta" href="#contact">
                  Get in touch
                  <span className="cta-circle"><ArrowRight size={16} /></span>
                </a>
                <a className="cta-ghost" href="VikramParmar_Resume.pdf" target="_blank" rel="noopener">
                  <FileIcon size={14} />
                  Résumé
                </a>
              </div>
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
              <span className="prev-yr">2023 — Now</span>
              <span className="prev-role">Data Engineer</span>
              <span className="prev-org">Anuvu · Austin, TX</span>
            </div>
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
            <StackGrid />
          </div>
          <div className="meta-block reveal" id="contact">
            <div className="meta-eyebrow">Contact</div>
            <ContactLinks />
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
            <b style={{color:'inherit',fontWeight:500}}>Looking for senior data engineering roles</b> where I can own a streaming
            platform end-to-end. Hiring, collaborating, or just curious how it runs? Drop a line below.
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
