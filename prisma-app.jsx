const { useState, useEffect, useRef } = React;

const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4';
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
    const els = document.querySelectorAll('.reveal, .card');
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.85) el.classList.add('in');
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          // staggered for cards in same parent
          if (e.target.classList.contains('card') && e.target.dataset.idx) {
            setTimeout(() => e.target.classList.add('in'), parseInt(e.target.dataset.idx) * 120);
          } else {
            e.target.classList.add('in');
          }
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
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
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-frame">
          <HeroVideo />
          <div className="hero-noise noise-overlay"></div>
          <div className="hero-gradient"></div>

          <div className="brand">Vikram Parmar</div>
          <div className="top-right">
            <span className="dot"></span>
            <span>Available</span>
            <span className="sep">·</span>
            <span className="stat">UTC<b>−6</b></span>
            <span className="sep">·</span>
            <span className="quiet">Austin, TX</span>
          </div>

          <nav className="navbar">
            <a href="#about">About</a>
            <a href="#work">Work</a>
            <a href="#stack">Stack</a>
            <a href="#open-source">Open source</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="hero-content">
            <div>
              <h1 className="hero-title">
                <WordsPullUp text="Vikram" asterisk />
              </h1>
              <div className="hero-spec">
                <span>v3.0 · since 2023</span>
                <span className="sep"></span>
                <span><b>500M</b> events/day</span>
                <span className="sep"></span>
                <span>kafka · airflow · clickhouse</span>
              </div>
            </div>
            <div className="hero-text-col">
              <p>
                <em>Data engineer</em> running a real-time analytics platform that processes
                500M events/day for aviation clients at Anuvu — on Kafka, Airflow,
                and ClickHouse. Open-source maintainer; driving AI workflow adoption
                across engineering.
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
        </div>
      </section>

      {/* WORK CARDS */}
      <section className="work" id="work">
        <div className="work-noise bg-noise"></div>
        <div className="work-header reveal">
          <h2>
            Streaming platforms for real‑time analytics.
            <span className="quiet">Built for scale. Wired for clarity.</span>
          </h2>
        </div>
        <div className="work-grid">
          <div className="card card-hero" data-idx="0">
            <video src={CARD_VIDEO} autoPlay loop muted playsInline />
            <div className="cap">A platform that ships data fast.</div>
          </div>
          <div className="card" data-idx="1">
            <div className="card-num">01 · Streaming</div>
            <h3>Kafka CDC pipeline.</h3>
            <ul>
              <li><Check /> <span><b>500M events/day</b> across aviation clients on production Kafka.</span></li>
              <li><Check /> Hourly batch → <b>sub-minute</b> data freshness end-to-end.</li>
              <li><Check /> Schema validation, lineage tracking and alerting built into Airflow.</li>
              <li><Check /> Operational dashboards and customer-facing analytics downstream.</li>
            </ul>
            <a className="card-foot" href="#contact">Learn more <span className="arrow"><ArrowRight size={16}/></span></a>
          </div>
          <div className="card" data-idx="2">
            <div className="card-num">02 · Warehouse</div>
            <h3>MariaDB → ClickHouse.</h3>
            <ul>
              <li><Check /> Led a 3-person team on a <b>100TB, 200-table</b> migration.</li>
              <li><Check /> Dashboard latency <b>45s → under 5s</b>; write throughput up <b>3×</b>.</li>
              <li><Check /> Cut MariaDB infra spend by <b>~$23K/month</b> post-decommission.</li>
            </ul>
            <a className="card-foot" href="#contact">Learn more <span className="arrow"><ArrowRight size={16}/></span></a>
          </div>
          <div className="card" data-idx="3">
            <div className="card-num">03 · AI tooling</div>
            <h3>Agent-driven workflows.</h3>
            <ul>
              <li><Check /> Client reporting <b>48 hrs → under 4 hrs</b> across 8 airline accounts.</li>
              <li><Check /> Internal Claude-based toolkit — <b>7 skills and agents</b> in active use.</li>
              <li><Check /> Drove adoption across a <b>32-person</b> engineering org.</li>
            </ul>
            <a className="card-foot" href="#contact">Learn more <span className="arrow"><ArrowRight size={16}/></span></a>
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
                <span>parmar.vik25@gmail.com</span>
                <span className="arrow"><ArrowRight /></span>
              </a>
              <a href="https://github.com/markiv25" target="_blank" rel="noopener">
                <span>github.com/markiv25</span>
                <span className="arrow"><ArrowRight /></span>
              </a>
              <a href="https://linkedin.com/in/vikramparmar25" target="_blank" rel="noopener">
                <span>linkedin.com/in/vikramparmar25</span>
                <span className="arrow"><ArrowRight /></span>
              </a>
              <a href="https://github.com/markiv25/slim-margin" target="_blank" rel="noopener" id="open-source">
                <span>slim-margin · open source</span>
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
