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

function HeroVideo() {
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

// ── App ────────────────────────────────────────────────────────────
function App() {
  useReveal();
  useActiveNav();
  useProgressBar();
  return (
    <>
      <div className="progress-bar"></div>

      <nav className="navbar">
        <a href="#about">About</a>
        <a href="#work">Work</a>
        <a href="#deep-dives">Deep dives</a>
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
          <HeroVideo />
          <div className="hero-noise noise-overlay"></div>
          <div className="hero-gradient"></div>

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

          <div className="terminal fade-up">
            <div className="terminal-head">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
              <span className="title">~ /vikram · zsh</span>
            </div>
            <div className="terminal-body">
              <div><span className="prompt">$</span><span className="cmd">whoami</span></div>
              <div className="out">vikram.parmar · data-engineer @ anuvu</div>
              <div><span className="prompt">$</span><span className="cmd">cat focus.md</span></div>
              <div className="out">real-time data infra · streaming · ai workflows</div>
              <div><span className="prompt">$</span><span className="cmd">uptime</span></div>
              <div className="out">3 yrs · streaming · sub-minute freshness<span className="cursor"></span></div>
            </div>
          </div>

          <ScrollLitText
            className="about-body"
            text={"Over three years at Anuvu I designed the Kafka-based CDC pipeline behind the platform, led the 100TB migration off MariaDB to ClickHouse, and built the data-quality framework now governing 10 production DAGs across the team. Past work at RIT and Ascension Health, where I built ETL and ingestion pipelines across departmental warehouses."}
          />
          <div className="currently">
            <div className="label">Currently</div>
            <div className="body">
              Making airline data show up <em>faster</em>. Most days that looks like Kafka,
              Airflow and a lot of querying ClickHouse; some days it's writing Claude
              skills so my team stops doing the same thing twice.
            </div>
            <div className="label">Lately</div>
            <div className="body">
              Open-sourced <em>slim-margin</em> — a Claude Code plugin that enforces token
              budgets and tier-routing on long-context tasks. Built it for myself; turns
              out other people wanted it too.
            </div>
          </div>

          <div className="philosophy fade-up">
            <div className="philosophy-eyebrow">/ Engineering philosophy</div>
            <ol>
              <li>
                <p>
                  <em>Ship the slowest part first.</em> The other 80% of the system reveals
                  itself once data is actually moving.
                </p>
              </li>
              <li>
                <p>
                  <em>Cost is a feature.</em> A pipeline that runs <b>3×</b> faster and costs
                  <b> 1/10</b> as much is a different product, not a tuning.
                </p>
              </li>
              <li>
                <p>
                  <em>Make boring things boring.</em> Schema contracts, alerting, lineage —
                  cheap to add, expensive to skip.
                </p>
              </li>
              <li>
                <p>
                  <em>Lean into agents for repetition</em>, not for taste. The 48-hour
                  reporting cycle wasn't hard; it was just hand work no human should do.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* WORK CARDS */}
      <section className="work" id="work">
        <div className="work-noise bg-noise"></div>
        <div className="work-header fade-up">
          <h2>
            Streaming platforms for real‑time analytics.
            <span className="quiet">Built for scale. Wired for clarity.</span>
          </h2>
        </div>

        <ArchFlow />

        <div className="stat-row fade-up">
          <div className="stat">
            <div className="stat-num">
              <Counter to={500} suffix="M" />
            </div>
            <div className="stat-label">Events / day on Kafka</div>
          </div>
          <div className="stat">
            <div className="stat-num">
              <Counter to={100} suffix="TB" />
            </div>
            <div className="stat-label">Migrated to ClickHouse</div>
          </div>
          <div className="stat">
            <div className="stat-num">
              <Counter to={45} duration={1200} /><span className="sep">→</span><Counter to={5} duration={1500} /><span className="unit">s</span>
            </div>
            <div className="stat-label">Dashboard latency</div>
          </div>
          <div className="stat">
            <div className="stat-num">
              <Counter to={48} duration={1200} /><span className="sep">→</span><Counter to={4} duration={1500} /><span className="unit">hr</span>
            </div>
            <div className="stat-label">Client reporting cycle</div>
          </div>
        </div>

        <div className="work-grid">
          <div className="card card-hero" data-idx="0">
            <video src={CARD_VIDEO} autoPlay loop muted playsInline />
            <div className="cap">A platform that ships data fast.</div>
          </div>
          <div className="card" data-idx="1">
            <div className="card-badge"><b>500M+</b> events / day</div>
            <h3>Kafka CDC pipeline.</h3>
            <div className="card-story">
              <div className="card-row">
                <span className="l">Problem</span>
                <span className="v">Hourly batch reporting too stale for aviation ops — operators needed <em>sub-minute</em> visibility on every flight.</span>
              </div>
              <div className="card-row">
                <span className="l">Scale</span>
                <span className="v">8 airline accounts, sub-minute end-to-end freshness.</span>
              </div>
              <div className="card-row stack">
                <span className="l">Stack</span>
                <span className="v">Kafka · CDC · Airflow · ClickHouse</span>
              </div>
              <div className="card-row">
                <span className="l">Impact</span>
                <span className="v">Real-time dashboards live; data contracts cut ad-hoc requests <b>~35%</b>.</span>
              </div>
            </div>
            <a className="card-foot" href="#contact">Learn more <span className="arrow"><ArrowRight size={16}/></span></a>
          </div>
          <div className="card" data-idx="2">
            <div className="card-badge"><b>100 TB</b> migrated</div>
            <h3>MariaDB → ClickHouse.</h3>
            <div className="card-story">
              <div className="card-row">
                <span className="l">Problem</span>
                <span className="v">Analytics dashboards crawling at <b>45s</b>; MariaDB infra cost <em>spiraling</em>.</span>
              </div>
              <div className="card-row">
                <span className="l">Scale</span>
                <span className="v"><b>100 TB · 200 tables</b>, zero-downtime cutover led by a 3-person team.</span>
              </div>
              <div className="card-row stack">
                <span className="l">Stack</span>
                <span className="v">ClickHouse · Polars · DuckDB · PySpark</span>
              </div>
              <div className="card-row">
                <span className="l">Impact</span>
                <span className="v">Latency <b>45s → under 5s</b>, write throughput <b>3×</b>, infra <b>−$23K/mo</b>.</span>
              </div>
            </div>
            <a className="card-foot" href="#contact">Learn more <span className="arrow"><ArrowRight size={16}/></span></a>
          </div>
          <div className="card" data-idx="3">
            <div className="card-badge"><b>48 hr → 4 hr</b> reporting</div>
            <h3>Agent-driven workflows.</h3>
            <div className="card-story">
              <div className="card-row">
                <span className="l">Problem</span>
                <span className="v">Client reporting cycle was <b>48 hours</b> of manual work — copy, validate, format, send.</span>
              </div>
              <div className="card-row">
                <span className="l">Scale</span>
                <span className="v"><b>8 airline accounts</b>, weekly cycle, run by an agent pipeline I built.</span>
              </div>
              <div className="card-row stack">
                <span className="l">Stack</span>
                <span className="v">Claude API · Skills · Agent workflows · Python</span>
              </div>
              <div className="card-row">
                <span className="l">Impact</span>
                <span className="v">Cycle <b>48 hr → under 4 hr</b>; <b>7 skills/agents</b> in active use across the org.</span>
              </div>
            </div>
            <a className="card-foot" href="#contact">Learn more <span className="arrow"><ArrowRight size={16}/></span></a>
          </div>
        </div>

        <div className="prev fade-up">
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
      </section>

      {/* DEEP DIVES */}
      <section className="deep" id="deep-dives">
        <div className="deep-inner">
          <div className="deep-eyebrow fade-up">/ Deep dives</div>
          <h2 className="deep-h fade-up">
            Engineering notes on streaming, storage, <em>and getting Claude to do useful work.</em>
          </h2>
          <div className="deep-list fade-up">
            <a className="deep-item" href="#contact">
              <div className="deep-num">001</div>
              <div>
                <div className="deep-title">From 45s to 5s — what actually moved the needle on ClickHouse dashboard latency.</div>
              </div>
              <div className="deep-meta">
                <span>warehouse</span><span className="pip"></span><span>~12 min read</span>
              </div>
            </a>
            <a className="deep-item" href="#contact">
              <div className="deep-num">002</div>
              <div>
                <div className="deep-title">Kafka CDC for aviation telemetry — schema contracts, lineage, and the parts you can't outsource.</div>
              </div>
              <div className="deep-meta">
                <span>streaming</span><span className="pip"></span><span>~15 min read</span>
              </div>
            </a>
            <a className="deep-item" href="#contact">
              <div className="deep-num">003</div>
              <div>
                <div className="deep-title">slim-margin — enforcing token discipline on long-context Claude Code tasks.</div>
              </div>
              <div className="deep-meta">
                <span>ai · open source</span><span className="pip live"></span><span>shipping</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* META — stack + contact */}
      <section className="meta" id="stack">
        <div className="meta-inner">
          <div className="meta-block reveal">
            <div className="meta-eyebrow">Stack</div>
            <div className="meta-stack">
              <div className="meta-stack-row"><span className="label">Languages</span>Python · SQL · Bash</div>
              <div className="meta-stack-row"><span className="label">Streaming</span>Apache Kafka · CDC · Schema contracts</div>
              <div className="meta-stack-row"><span className="label">Orchestration</span>Apache Airflow · 10 production DAGs · 1–5 TB/day</div>
              <div className="meta-stack-row"><span className="label">Processing</span>PySpark · Polars · DuckDB · Parquet</div>
              <div className="meta-stack-row"><span className="label">Stores</span>ClickHouse · MariaDB · MySQL · SQL Server</div>
              <div className="meta-stack-row"><span className="label">Cloud</span>AWS S3 · RDS · EC2 · SQS · Redis</div>
              <div className="meta-stack-row"><span className="label">AI/LLM</span>Claude API · Agentic workflows · LLM-assisted validation</div>
              <div className="meta-stack-row"><span className="label">Observability</span>Grafana · Tableau</div>
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
        <footer>
          <span>© 2026 Vikram Kumar Parmar</span>
          <span>Built in HTML · Austin, TX</span>
        </footer>
      </section>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
