const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "#E8A861",
  "heroVariant": "topology",
  "showDotGrid": false,
  "showBlobs": false
}/*EDITMODE-END*/;

const ACCENTS = {
  '#E8A861': { c: 'oklch(0.78 0.14 65)',   soft: 'oklch(0.78 0.14 65 / 0.12)',   line: 'oklch(0.78 0.14 65 / 0.35)' },
  '#7BC481': { c: 'oklch(0.78 0.14 150)',  soft: 'oklch(0.78 0.14 150 / 0.12)',  line: 'oklch(0.78 0.14 150 / 0.35)' },
  '#6BB6CE': { c: 'oklch(0.78 0.12 210)',  soft: 'oklch(0.78 0.12 210 / 0.12)',  line: 'oklch(0.78 0.12 210 / 0.35)' },
  '#B68DD8': { c: 'oklch(0.78 0.14 295)',  soft: 'oklch(0.78 0.14 295 / 0.12)',  line: 'oklch(0.78 0.14 295 / 0.35)' },
};

// ---------- METRICS ----------
const METRICS = [
  { value: 500, suffix: 'M', label: 'Events / day on Kafka CDC pipeline', spark: [4,5,6,5,7,8,7,9,10,9,11,12,11,13,14] },
  { value: 100, suffix: 'TB', label: 'Migrated MariaDB → ClickHouse', spark: [1,2,3,4,6,8,11,14,18,22,28,35,48,72,100] },
  { value: 9,   prefix: '45→', suffix: 's', display: '45→5', label: 'Dashboard latency, before → after', spark: [45,44,42,40,38,30,28,22,18,14,12,9,7,6,5] },
  { value: 4,   prefix: '48→', suffix: 'hr', display: '48→4', label: 'Client reporting cycle, via AI agents', spark: [48,46,42,40,35,28,22,18,14,11,9,7,6,5,4] },
];

const MARQUEE_ITEMS = [
  'Apache Kafka', 'Apache Airflow', 'ClickHouse', 'PySpark', 'Polars',
  'DuckDB', 'Python', 'AWS S3', 'AWS RDS', 'Redis',
  'MariaDB', 'SQL Server', 'Tableau', 'Grafana', 'Claude API',
  'Parquet', 'CDC', 'Data Contracts',
];

// ---------- EXPERIENCE ----------
const EXPERIENCE = [
  {
    company: 'Anuvu',
    role: 'Data Engineer · Streaming Platform',
    location: 'Remote',
    period: 'Jan 2023 – Present',
    active: true,
    bullets: [
      <>Designed and built the <b>Kafka-based CDC pipeline</b> powering a real-time analytics platform processing <b>500M events/day</b> for aviation clients; moved data freshness from hourly batch to sub-minute.</>,
      <>Led a 3-person team on a <b>100TB, 200-table migration</b> from MariaDB to ClickHouse; dashboard latency 45s → under 5s, write throughput 3×, infra spend cut by <b>~$23K/month</b>.</>,
      <>Redesigned per-flight processing path from SQS + RDS to an in-process <b>Polars + DuckDB</b> pipeline; runtime 2.5min → 1.5min (25–30% faster).</>,
      <>Platform owner for Apache Airflow and Kafka — 10 production DAGs processing 1–5 TB/day on AWS (S3, RDS, EC2, SQS, Redis).</>,
      <>Built a data quality and contracts framework integrated into Airflow; cut ad-hoc stakeholder data requests by <b>~35%</b>.</>,
      <>Drive AI adoption across a 32-person engineering org — internal Claude-based toolkit (7 skills and agents) actively used by most of engineering.</>,
    ],
  },
  {
    company: 'Rochester Institute of Technology',
    role: 'Data Engineer Intern',
    location: 'Rochester, NY',
    period: 'Aug 2022 – Dec 2022',
    bullets: [
      <>Built ETL workflows (Informatica, SQL Server, Azure) feeding a departmental warehouse used across <b>5 departments</b>; data retrieval time cut <b>~30%</b> across pipelines covering 15K student records.</>,
    ],
  },
  {
    company: 'Ascension Health',
    role: 'Master Data Management Intern',
    location: 'Remote',
    period: 'May 2022 – Aug 2022',
    bullets: [
      <>Designed Python ingestion pipelines processing <b>500K records/week</b>; delivered KPI reporting across 3 departments and improved inventory forecast accuracy, reducing overstock <b>~15%</b>.</>,
    ],
  },
];

// ---------- SKILLS ----------
const SKILLS = [
  {
    title: 'Languages',
    items: ['Python', 'SQL', 'Bash'],
  },
  {
    title: 'Data Engineering',
    items: ['Apache Kafka', 'Apache Airflow', 'Apache Spark / PySpark', 'Polars', 'Parquet', 'CDC · ETL · ELT', 'Dimensional modeling', 'Data contracts & lineage'],
  },
  {
    title: 'Stores & Cloud',
    items: ['ClickHouse', 'MariaDB · MySQL', 'SQL Server', 'AWS (S3, RDS, EC2, SQS)', 'Redis', 'Linux · Git · CI/CD'],
  },
  {
    title: 'AI & Observability',
    items: ['Claude API', 'Agentic workflow design', 'LLM-assisted validation', 'Grafana', 'Tableau'],
  },
];

// ---------- STREAM SIMULATION ----------
const TOPICS = [
  'flight.telemetry',
  'cabin.iot',
  'aircraft.position',
  'crew.events',
  'pax.usage',
  'wifi.session',
  'engine.metrics',
  'route.update',
];
const HOSTS = ['kfk-01', 'kfk-02', 'kfk-03', 'kfk-04', 'kfk-05'];

function makeEvent(i) {
  const now = new Date();
  const ts = now.toISOString().slice(11, 23);
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  const host = HOSTS[Math.floor(Math.random() * HOSTS.length)];
  const offset = (Math.floor(Math.random() * 9_000_000) + 1_000_000).toString();
  const bytes = (Math.floor(Math.random() * 1800) + 200) + 'B';
  return { id: i, ts, topic, host, offset, bytes };
}

function StreamPanel() {
  const [events, setEvents] = useState(() => Array.from({ length: 10 }, (_, i) => makeEvent(i)));
  const idRef = useRef(10);
  useEffect(() => {
    const t = setInterval(() => {
      setEvents(prev => {
        const next = makeEvent(idRef.current++);
        const out = [next, ...prev];
        return out.slice(0, 12);
      });
    }, 650);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="stream">
      <div className="stream-head">
        <div className="stream-head-left">
          <span>kafka · cdc.aviation.live</span>
        </div>
        <span className="stream-status"><span className="dot"></span>STREAMING</span>
      </div>
      <div className="stream-body">
        <div className="stream-list">
          {events.map(ev => (
            <div key={ev.id} className="stream-row">
              <span className="ts">{ev.ts}</span>
              <span className="status">{ev.host}</span>
              <span className="topic">{ev.topic}</span>
              <span className="payload">+{ev.bytes}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- TOPOLOGY (canvas data-flow animation) ----------
const NODES = [
  { id: 'src',  x: 0.10, y: 0.50, label: 'edge',       kind: 'src',  shape: 'circle' },
  { id: 'kfk',  x: 0.32, y: 0.30, label: 'kafka',      kind: 'broker' },
  { id: 'kfk2', x: 0.32, y: 0.70, label: 'kafka',      kind: 'broker' },
  { id: 'air',  x: 0.55, y: 0.20, label: 'airflow',    kind: 'proc' },
  { id: 'pol',  x: 0.55, y: 0.50, label: 'polars',     kind: 'proc' },
  { id: 's3',   x: 0.55, y: 0.80, label: 's3',         kind: 'store' },
  { id: 'ch',   x: 0.80, y: 0.35, label: 'clickhouse', kind: 'store' },
  { id: 'dash', x: 0.92, y: 0.65, label: 'dash',       kind: 'sink', shape: 'circle' },
];
const EDGES = [
  ['src','kfk'], ['src','kfk2'],
  ['kfk','air'], ['kfk','pol'],
  ['kfk2','pol'], ['kfk2','s3'],
  ['air','ch'], ['pol','ch'], ['s3','ch'],
  ['ch','dash'],
];

function Topology() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const eventsRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const r = wrapRef.current.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapRef.current);

    const nodePos = (n) => ({ x: n.x * W, y: n.y * H });

    // Static initial render so the topology is visible even before RAF starts
    const drawStatic = () => {
      const cs = getComputedStyle(document.documentElement);
      const accent = cs.getPropertyValue('--accent').trim() || '#E8A861';
      const lineStrong = cs.getPropertyValue('--line-strong').trim() || '#34322B';
      const fgDim = cs.getPropertyValue('--fg-dim').trim() || '#A29E94';
      const bg = cs.getPropertyValue('--bg').trim() || '#0E0E0C';
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = lineStrong;
      ctx.lineWidth = 1;
      EDGES.forEach(([a, b]) => {
        const A = nodePos(NODES.find(n => n.id === a));
        const B = nodePos(NODES.find(n => n.id === b));
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
      });
      NODES.forEach(n => {
        const p = nodePos(n);
        if (n.shape === 'circle') {
          ctx.fillStyle = bg;
          ctx.strokeStyle = accent;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = fgDim;
          ctx.font = '500 10px JetBrains Mono, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(n.label, p.x, p.y + 12);
        } else {
          const w = 56, h = 22;
          ctx.fillStyle = bg;
          ctx.strokeStyle = lineStrong;
          ctx.lineWidth = 1;
          roundRect(ctx, p.x - w/2, p.y - h/2, w, h, 3);
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = fgDim;
          ctx.font = '500 10px JetBrains Mono, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(n.label, p.x, p.y);
        }
      });
    };
    drawStatic();

    // packets travelling along edges
    const packets = [];
    const spawn = () => {
      const [a, b] = EDGES[Math.floor(Math.random() * EDGES.length)];
      const from = NODES.find(n => n.id === a);
      const to   = NODES.find(n => n.id === b);
      packets.push({ from, to, t: 0, speed: 0.005 + Math.random() * 0.008 });
      eventsRef.current++;
    };

    let lastSpawn = 0;
    const SPAWN_INTERVAL = 110; // ms

    const draw = (now) => {
      try {
      // resolve accent dynamically
      const cs = getComputedStyle(document.documentElement);
      const accent = cs.getPropertyValue('--accent').trim() || '#E8A861';
      const accentSoft = cs.getPropertyValue('--accent-soft').trim() || 'rgba(232,168,97,0.12)';
      const lineCol = cs.getPropertyValue('--line').trim() || '#25241F';
      const lineStrong = cs.getPropertyValue('--line-strong').trim() || '#34322B';
      const fg = cs.getPropertyValue('--fg').trim() || '#F4F1EA';
      const fgDim = cs.getPropertyValue('--fg-dim').trim() || '#A29E94';
      const bg = cs.getPropertyValue('--bg').trim() || '#0E0E0C';

      ctx.clearRect(0, 0, W, H);

      // edges
      ctx.strokeStyle = lineStrong;
      ctx.lineWidth = 1;
      EDGES.forEach(([a, b]) => {
        const A = nodePos(NODES.find(n => n.id === a));
        const B = nodePos(NODES.find(n => n.id === b));
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
      });

      // packets along edges
      if (now - lastSpawn > SPAWN_INTERVAL) {
        spawn();
        lastSpawn = now;
      }
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += p.speed;
        if (p.t >= 1) { packets.splice(i, 1); continue; }
        const A = nodePos(p.from);
        const B = nodePos(p.to);
        const x = A.x + (B.x - A.x) * p.t;
        const y = A.y + (B.y - A.y) * p.t;
        // trail
        const trailLen = 0.08;
        const t0 = Math.max(0, p.t - trailLen);
        const tx = A.x + (B.x - A.x) * t0;
        const ty = A.y + (B.y - A.y) * t0;
        const grad = ctx.createLinearGradient(tx, ty, x, y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, accent);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();
        // dot
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // nodes
      NODES.forEach(n => {
        const p = nodePos(n);
        const r = n.shape === 'circle' ? 8 : 0;
        if (n.shape === 'circle') {
          ctx.fillStyle = bg;
          ctx.strokeStyle = accent;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // pulse
          const pulse = (Math.sin(now / 600 + n.x * 6) + 1) / 2;
          ctx.strokeStyle = accent;
          ctx.globalAlpha = 0.3 * (1 - pulse);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 7 + pulse * 10, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        } else {
          // rect node
          const w = 56, h = 22;
          ctx.fillStyle = bg;
          ctx.strokeStyle = lineStrong;
          ctx.lineWidth = 1;
          roundRect(ctx, p.x - w/2, p.y - h/2, w, h, 3);
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = fgDim;
          ctx.font = '500 10px JetBrains Mono, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(n.label, p.x, p.y);
        }
        if (n.shape === 'circle') {
          ctx.fillStyle = fgDim;
          ctx.font = '500 10px JetBrains Mono, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(n.label, p.x, p.y + 12);
        }
      });

      rafRef.current = requestAnimationFrame(draw);
      } catch (err) { console.error('draw err', err); }
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  // event counter ui
  const [count, setCount] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCount(eventsRef.current), 200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="topology" ref={wrapRef}>
      <div className="topology-head">
        <span>topology · live</span>
        <span className="live"><span className="dot"></span>STREAMING</span>
      </div>
      <canvas ref={canvasRef} />
      <div className="topology-foot">
        <span>events routed: <b>{count.toLocaleString()}</b></span>
        <span>p99 lag: <b>142ms</b></span>
      </div>
    </div>
  );
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ---------- TOPOLOGY BG (full-bleed hero background) ----------
const BG_NODES = [
  { id: 'src1', x: 0.05, y: 0.20, label: 'edge·iad',  shape: 'circle' },
  { id: 'src2', x: 0.05, y: 0.55, label: 'edge·dfw',  shape: 'circle' },
  { id: 'src3', x: 0.05, y: 0.82, label: 'edge·lax',  shape: 'circle' },
  { id: 'kfk1', x: 0.22, y: 0.30, label: 'kafka-01' },
  { id: 'kfk2', x: 0.22, y: 0.70, label: 'kafka-02' },
  { id: 'air',  x: 0.40, y: 0.18, label: 'airflow' },
  { id: 'pol',  x: 0.40, y: 0.45, label: 'polars' },
  { id: 'spk',  x: 0.40, y: 0.72, label: 'pyspark' },
  { id: 's3',   x: 0.58, y: 0.88, label: 's3·raw' },
  { id: 'ch1',  x: 0.62, y: 0.30, label: 'clickhouse·shard-1' },
  { id: 'ch2',  x: 0.62, y: 0.60, label: 'clickhouse·shard-2' },
  { id: 'graf', x: 0.82, y: 0.22, label: 'grafana' },
  { id: 'dash', x: 0.82, y: 0.50, label: 'analytics·api' },
  { id: 'alrt', x: 0.82, y: 0.78, label: 'alerts' },
  { id: 'cli',  x: 0.95, y: 0.50, label: 'client',  shape: 'circle' },
];
const BG_EDGES = [
  ['src1','kfk1'], ['src2','kfk1'], ['src2','kfk2'], ['src3','kfk2'],
  ['kfk1','air'], ['kfk1','pol'], ['kfk2','pol'], ['kfk2','spk'], ['kfk2','s3'],
  ['air','ch1'], ['pol','ch1'], ['pol','ch2'], ['spk','ch2'], ['s3','ch2'],
  ['ch1','graf'], ['ch1','dash'], ['ch2','dash'], ['ch2','alrt'],
  ['graf','cli'], ['dash','cli'], ['alrt','cli'],
];

function TopologyBg() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0; const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const r = wrapRef.current.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapRef.current);

    const pos = (n) => ({ x: n.x * W, y: n.y * H });

    const packets = [];
    let lastSpawn = 0;


    const drawAll = (now) => {
      const cs = getComputedStyle(document.documentElement);
      const accent = cs.getPropertyValue('--accent').trim() || '#E8A861';
      const lineCol = cs.getPropertyValue('--line').trim() || '#25241F';
      const lineStrong = cs.getPropertyValue('--line-strong').trim() || '#34322B';
      const fgDim = cs.getPropertyValue('--fg-dim').trim() || '#A29E94';
      const fgMute = cs.getPropertyValue('--fg-mute').trim() || '#5E5B53';
      const bg = cs.getPropertyValue('--bg').trim() || '#0E0E0C';

      ctx.clearRect(0, 0, W, H);

      // edges
      ctx.strokeStyle = lineStrong;
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = 1;
      BG_EDGES.forEach(([a, b]) => {
        const A = pos(BG_NODES.find(n => n.id === a));
        const B = pos(BG_NODES.find(n => n.id === b));
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // spawn
      if (!lastSpawn || now - lastSpawn > SPAWN_INTERVAL) {
        const [a, b] = BG_EDGES[Math.floor(Math.random() * BG_EDGES.length)];
        packets.push({
          from: BG_NODES.find(n => n.id === a),
          to:   BG_NODES.find(n => n.id === b),
          t: 0,
          speed: 0.006 + Math.random() * 0.01,
        });
        lastSpawn = now;
      }

      // packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += p.speed;
        if (p.t >= 1) { packets.splice(i, 1); continue; }
        const A = pos(p.from), B = pos(p.to);
        const x = A.x + (B.x - A.x) * p.t;
        const y = A.y + (B.y - A.y) * p.t;
        const trailLen = 0.10;
        const t0 = Math.max(0, p.t - trailLen);
        const tx = A.x + (B.x - A.x) * t0;
        const ty = A.y + (B.y - A.y) * t0;
        const grad = ctx.createLinearGradient(tx, ty, x, y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, accent);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // nodes — abstract dots only, no labels (those competed with the type)
      BG_NODES.forEach(n => {
        const p = pos(n);
        ctx.fillStyle = fgDim;
        ctx.globalAlpha = 0.65;
        ctx.beginPath();
        ctx.arc(p.x, p.y, n.shape === 'circle' ? 4 : 3, 0, Math.PI * 2);
        ctx.fill();
        if (n.shape === 'circle') {
          const pulse = (Math.sin(now / 700 + n.x * 7) + 1) / 2;
          ctx.strokeStyle = accent;
          ctx.globalAlpha = 0.25 * (1 - pulse);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4 + pulse * 14, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      });

      rafRef.current = requestAnimationFrame(drawAll);
    };
    rafRef.current = requestAnimationFrame(drawAll);
    // Ensure static structure visible immediately even if RAF is throttled
    drawAll(performance.now());

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);
  return (
    <div ref={wrapRef} style={{position:'absolute', inset:0}}>
      <canvas ref={canvasRef} />
    </div>
  );
}

// ---------- COUNT UP ----------
function useCountUp(target, { duration = 1600, start = 0, decimals = 0 } = {}) {
  const [val, setVal] = useState(start);
  const elRef = useRef(null);
  useEffect(() => {
    if (!elRef.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(start + (target - start) * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.disconnect();
    }, { threshold: 0.3 });
    io.observe(elRef.current);
    return () => io.disconnect();
  }, [target]);
  return [val, elRef];
}

// ---------- SPARKLINE ----------
function Sparkline({ data }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 200, h = 32;
  const stepX = w / (data.length - 1);
  const norm = (v) => h - 4 - ((v - min) / Math.max(0.0001, max - min)) * (h - 8);
  const linePts = data.map((v, i) => `${(i * stepX).toFixed(1)},${norm(v).toFixed(1)}`).join(' L ');
  const fillPts = `M 0,${h} L ${linePts} L ${w},${h} Z`;
  return (
    <svg className="metric-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path className="fill" d={fillPts} />
      <path className="line" d={`M ${linePts}`} />
    </svg>
  );
}

function MetricCard({ m }) {
  const [val, ref] = useCountUp(m.value);
  const display = m.display
    ? m.display
    : Math.round(val).toLocaleString();
  return (
    <div className="metric" ref={ref}>
      <div className="metric-value">
        {display}<span className="unit">{m.suffix}</span>
      </div>
      <div className="metric-label">{m.label}</div>
      <Sparkline data={m.spark} />
    </div>
  );
}

// ---------- MARQUEE ----------
function Marquee({ items }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {doubled.map((it, i) => (
          <span key={i} className="marquee-item">
            <span className="sep"></span>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function TerminalCard() {
  return (
    <div className="project-visual">
      <div className="terminal-head">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="title">slim-margin · claude-code</span>
      </div>
      <div className="terminal-body">
        <div><span className="comment"># enforce token budget on long-context task</span></div>
        <div><span className="prompt">$</span> slim-margin run --tier auto ./analyze.md</div>
        <div className="comment">  routing strategy: opus → sonnet → haiku</div>
        <div className="comment">  budget cap: 200K input · 16K output</div>
        <div><span className="ok">  ✓</span> haiku draft     <span className="comment">  4.2K tok</span></div>
        <div><span className="ok">  ✓</span> sonnet refine   <span className="comment"> 18.7K tok</span></div>
        <div><span className="ok">  ✓</span> opus validate   <span className="comment">  2.1K tok</span></div>
        <div className="comment">  total: 25.0K / 200K · <span style={{color:'var(--accent)'}}>87.5% budget saved</span></div>
        <div><span className="prompt">$</span> <span style={{borderRight: '8px solid var(--accent)', animation: 'pulse 1s steps(2) infinite'}}>&nbsp;</span></div>
      </div>
    </div>
  );
}

// ---------- HOOK: reveal on scroll ----------
function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    // Only arm the entrance animation for items currently below the fold.
    // Anything already visible stays visible — protects us against paused
    // RAF / hidden-iframe scenarios where transitions never progress.
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.95) el.classList.add('pre');
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.remove('pre');
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ---------- ANIMATED HEADING ----------
function AnimatedHeading({ text, charDelay = 28, initialDelay = 200, duration = 600, className = '', serifLineIdx = null }) {
  const lines = text.split('\n');
  let cumulativeChars = 0;
  return (
    <h1 className={className}>
      {lines.map((line, li) => {
        const lineClass = 'line' + (li === serifLineIdx ? ' serif' : '');
        const words = line.split(' ');
        let wordChars = 0;
        const lineEl = (
          <span key={li} className={lineClass}>
            {words.map((word, wi) => {
              const isLast = wi === words.length - 1;
              const wordEl = (
                <React.Fragment key={wi}>
                  <span className="word">
                    {[...word].map((ch, ci) => {
                      const delay = initialDelay + (cumulativeChars + wordChars + ci) * charDelay;
                      return (
                        <span
                          key={ci}
                          className="char"
                          style={{
                            animationDelay: delay + 'ms',
                            animationDuration: duration + 'ms',
                          }}
                        >
                          {ch}
                        </span>
                      );
                    })}
                  </span>
                  {!isLast && (
                    <span
                      className="char space"
                      style={{
                        animationDelay: (initialDelay + (cumulativeChars + wordChars + word.length) * charDelay) + 'ms',
                        animationDuration: duration + 'ms',
                      }}
                    >{'\u00A0'}</span>
                  )}
                </React.Fragment>
              );
              wordChars += word.length + 1;
              return wordEl;
            })}
          </span>
        );
        cumulativeChars += line.length;
        return lineEl;
      })}
    </h1>
  );
}

function FadeIn({ delay = 0, duration = 1000, className = '', as: Tag = 'div', children, ...rest }) {
  return (
    <Tag
      className={`fade-in ${className}`}
      style={{
        animationDelay: delay + 'ms',
        animationDuration: duration + 'ms',
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// ---------- APP ----------
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useRevealOnScroll();

  useEffect(() => {
    document.body.classList.toggle('light', tweaks.theme === 'light');
  }, [tweaks.theme]);

  useEffect(() => {
    const a = ACCENTS[tweaks.accent] || ACCENTS['#E8A861'];
    document.documentElement.style.setProperty('--accent', a.c);
    document.documentElement.style.setProperty('--accent-soft', a.soft);
    document.documentElement.style.setProperty('--accent-line', a.line);
  }, [tweaks.accent]);

  useEffect(() => {
    const el = document.querySelector('.dotgrid');
    if (el) el.style.display = tweaks.showDotGrid ? 'block' : 'none';
  }, [tweaks.showDotGrid]);

  useEffect(() => {
    const el = document.querySelector('.blobs');
    if (el) el.style.display = tweaks.showBlobs ? 'block' : 'none';
  }, [tweaks.showBlobs]);

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-dot"></span>
            <span>vikram.parmar / data-eng</span>
          </div>
          <nav className="nav liquid-glass">
            <a href="#work"><span className="idx">01</span>work</a>
            <a href="#skills"><span className="idx">02</span>stack</a>
            <a href="#project"><span className="idx">03</span>open-source</a>
            <a href="#contact"><span className="idx">04</span>contact</a>
          </nav>
          <div className="topbar-ctas">
            <a className="btn-solid" href="mailto:parmar.vik25@gmail.com">
              Get in touch
            </a>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <TopologyBg />
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">Data Engineer · Austin, TX</div>
          <h1>
            Pipelines that move data<br/>
            <span className="serif">at the speed of flight.</span>
          </h1>
          <p className="hero-lede">
            I run a <strong>real-time analytics platform processing 500M events/day</strong> for aviation clients
            on Kafka, Airflow and ClickHouse — and lead AI tooling adoption across a 32-person engineering org.
          </p>
          <div className="hero-ctas">
            <a className="btn-solid" href="#contact">Get in touch</a>
            <a className="btn-glass" href="#work">View work</a>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" style={{paddingTop:120}}>
        <div className="container">
          <div className="section-head reveal">
            <span className="section-num">/ 00</span>
            <h2 className="section-title">By the numbers</h2>
            <span className="section-sub">impact across 3 years</span>
          </div>
          <div className="impact-grid reveal">
            {METRICS.map((m, i) => <MetricCard key={i} m={m} />)}
          </div>
        </div>
        <div className="container">
          <Marquee items={MARQUEE_ITEMS} />
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="work">
        <div className="container">
          <div className="section-head reveal">
            <span className="section-num">/ 01</span>
            <h2 className="section-title">Selected work</h2>
            <span className="section-sub">3 roles · 2022 → present</span>
          </div>
          <div className="experience-list">
            {EXPERIENCE.map((e, i) => (
              <div key={i} className="exp reveal">
                <div className="exp-meta">
                  <div>{e.period}</div>
                  <div>{e.location}</div>
                  {e.active && <div className="role-status"><span className="dot"></span>currently</div>}
                </div>
                <div>
                  <h3 className="exp-company">{e.company}</h3>
                  <div className="exp-role">{e.role}</div>
                  <ul className="exp-bullets">
                    {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="container">
          <div className="section-head reveal">
            <span className="section-num">/ 02</span>
            <h2 className="section-title">The stack</h2>
            <span className="section-sub">tools I reach for</span>
          </div>
          <div className="skills-grid reveal">
            {SKILLS.map((cat, i) => (
              <div key={i} className="skill-cat">
                <div className="skill-cat-title">{cat.title}</div>
                <div className="skill-list">
                  {cat.items.map((s, j) => <span key={j}>{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT */}
      <section id="project">
        <div className="container">
          <div className="section-head reveal">
            <span className="section-num">/ 03</span>
            <h2 className="section-title">Open source</h2>
            <span className="section-sub">side-quest</span>
          </div>
          <div className="project reveal">
            <div className="project-info">
              <div className="label">slim-margin · mit licensed</div>
              <h3>Token discipline for long-context Claude Code tasks.</h3>
              <p>
                An open-source Claude Code plugin that enforces token-budget discipline and tier-routing
                across Opus, Sonnet and Haiku — so long-context workflows stay cheap and predictable without
                manual model juggling.
              </p>
              <div className="project-tags">
                <span className="tag">Claude Code</span>
                <span className="tag">Python</span>
                <span className="tag">LLM ops</span>
                <span className="tag">Agentic workflows</span>
              </div>
              <a href="https://github.com/markiv25/slim-margin" target="_blank" rel="noopener" className="project-link">
                github.com/markiv25/slim-margin →
              </a>
            </div>
            <TerminalCard />
          </div>
        </div>
      </section>

      {/* PUBLICATION */}
      <section id="publication" style={{paddingTop:0}}>
        <div className="container">
          <div className="section-head reveal">
            <span className="section-num">/ 04</span>
            <h2 className="section-title">Publication</h2>
            <span className="section-sub">IEEE · peer-reviewed</span>
          </div>
          <div className="pub reveal">
            <div>
              <div className="pub-title">Anomaly Detection System for Smart Home using Machine Learning</div>
              <div className="pub-meta">Srinivasan, A., Parmar, V., et al. — IEEE ICSSA, 2021, pp. 52–55</div>
            </div>
            <div className="pub-doi">DOI:<br/>10.1109/ICSSA53632.2021.00018</div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="contact-eyebrow reveal">/ 05 — get in touch</div>
          <h2 className="reveal">
            Let's build something <span className="serif">that scales.</span>
          </h2>
          <div className="contact-grid reveal">
            <a className="contact-card" href="mailto:parmar.vik25@gmail.com">
              <span className="contact-label">Email</span>
              <span className="contact-value">parmar.vik25@gmail.com</span>
            </a>
            <a className="contact-card" href="https://github.com/markiv25" target="_blank" rel="noopener">
              <span className="contact-label">GitHub</span>
              <span className="contact-value">github.com/markiv25</span>
            </a>
            <a className="contact-card" href="https://linkedin.com/in/vikramparmar25" target="_blank" rel="noopener">
              <span className="contact-label">LinkedIn</span>
              <span className="contact-value">/in/vikramparmar25</span>
            </a>
          </div>
          <footer>
            <span>© 2026 Vikram Kumar Parmar</span>
            <span>built in HTML · last deploy 2026.05.15</span>
          </footer>
        </div>
      </section>

      {/* TWEAKS */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme">
          <TweakRadio
            label="Mode"
            value={tweaks.theme}
            options={[{value:'dark',label:'Dark'},{value:'light',label:'Light'}]}
            onChange={v => setTweak('theme', v)}
          />
        </TweakSection>
        <TweakSection label="Accent color">
          <TweakColor
            label="Accent"
            value={tweaks.accent}
            options={['#E8A861', '#7BC481', '#6BB6CE', '#B68DD8']}
            onChange={v => setTweak('accent', v)}
          />
        </TweakSection>
        <TweakSection label="Background">
          <TweakToggle
            label="Dot grid"
            value={tweaks.showDotGrid}
            onChange={v => setTweak('showDotGrid', v)}
          />
          <TweakToggle
            label="Gradient blobs"
            value={tweaks.showBlobs}
            onChange={v => setTweak('showBlobs', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
