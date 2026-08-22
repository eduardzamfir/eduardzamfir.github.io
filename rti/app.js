/* RTI project page — explorer, video tabs and charts.
   Charts are hand-built SVG: the page has six of them and no build step, so a
   library would cost more than it saves. Series colours are fixed per ENTITY
   (blue = RTI, red = the competing reduction, purple = uniform grid, ink =
   the dense backbone) and never reassigned per chart. */

const C = { ours: "#4285F4", base: "#EA4335", uniform: "#9334E6" };

/* ── theme ─────────────────────────────────────────────────────────────── */
const root = document.documentElement;
const saved = localStorage.getItem("rti-theme");
if (saved) root.setAttribute("data-theme", saved);
const qTheme = new URLSearchParams(location.search).get("theme");   // ?theme=dark
if (qTheme === "dark" || qTheme === "light") root.setAttribute("data-theme", qTheme);
document.getElementById("themebtn").addEventListener("click", () => {
  const now = root.getAttribute("data-theme")
    || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = now === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("rti-theme", next);
});

/* ── budget explorer ───────────────────────────────────────────────────── */
/* Stops are labelled by sequence length, not speedup: the dense backbone runs on
   all 1024 patch tokens and every other stop is a fraction of that. The measured
   speedups live in the results section, where their protocol is stated. */
const N_TOK = 1024;
/* sp = measured speedup, results/span_latency (RTX 4090, 4 images per batch, CFG
   doubles the forward batch to 8, 100 steps, SDPA) — the Table 1 protocol */
const BUDGETS = [
  { R: 728, sp: "1.77×" },
  { R: 512, sp: "2.11×" },
  { R: 256, sp: "2.59×" },
  { R: 128, sp: "2.86×" },
  { R: 64,  sp: "3.01×" },
];
const pad2 = (i) => String(i).padStart(2, "0");
let curPrompt = 0, curBudget = 1;    // the marble statue at R=256
let ZOOM = 3;
// where the magnifier starts for each prompt: the place the reductions are
// asked to hold on to (carved feathers, chain mail, a face, lettering)
const CROP0 = [[0.47, 0.24],   // the statue's face and carved curls
               [0.32, 0.41],   // the knight's helm and mail
               [0.46, 0.25],   // the Mona Lisa's blocky face
               [0.48, 0.52],   // figures and umbrellas on the wet crossing
               [0.31, 0.23],   // the peacock's head and crest
               [0.52, 0.45],   // the rose window
               [0.45, 0.35],   // the butterfly's wing pattern
               [0.53, 0.67],   // the lettering on the sign
               [0.47, 0.35],   // the fox's face and ruff
               [0.47, 0.42],   // the rocket inside the visor
               [0.44, 0.45],   // the locomotive's boiler front
               [0.50, 0.45],   // the painted glaze on the vase
               [0.50, 0.44],   // the fall seen through the ruined arch
               [0.55, 0.30],   // the chameleon's head and crest
               [0.50, 0.40],   // (retired)
               [0.45, 0.42]];  // the island's terraces and falls
let crop = CROP0[curPrompt].slice();

/* Indices into PROMPTS. The set is deliberately smaller than the file: the
   Tokyo crossing, the cathedral and the robot sign are kept for the limitation
   sections, and the peacock is retired. */
const EXPLORER = [0, 1, 2, 6, 8, 9, 11, 12, 13, 15];

const thumbs = document.getElementById("thumbs");
EXPLORER.forEach((i) => {
  const label = window.PROMPT_LABELS[i];
  const b = document.createElement("button");
  b.type = "button";
  b.title = label;
  b.setAttribute("aria-label", label);
  // 12 x ~6 KB: eager, so the picker never renders as an empty strip
  b.innerHTML = `<img src="assets/gallery/thumb_p${pad2(i)}.webp" alt="${label}">`;
  b.addEventListener("click", () => { curPrompt = i; crop = CROP0[i].slice(); renderExplorer(); });
  thumbs.appendChild(b);
});

const slider = document.getElementById("budget");
slider.addEventListener("input", () => { curBudget = +slider.value; renderExplorer(); });

/* CSS background-position is a percentage of the OVERFLOW, not of the image, so
   centring image fraction f under zoom Z needs (fZ - 1/2)/(Z - 1), clamped. The
   crop box drawn on the sample is derived back from the clamped value, so the
   two always agree at the edges of the frame. */
const bgPos = (f) => Math.max(0, Math.min(1, (f * ZOOM - 0.5) / (ZOOM - 1)));

function paintCrop(id, url) {
  const el = document.getElementById(id);
  el.style.backgroundImage = `url(${url})`;
  el.style.backgroundSize = `${ZOOM * 100}%`;
  el.style.backgroundPosition = `${bgPos(crop[0]) * 100}% ${bgPos(crop[1]) * 100}%`;
}
function paintBoxes() {
  const w = 100 / ZOOM;
  document.querySelectorAll(".cropbox").forEach((b) => {
    b.style.width = w + "%"; b.style.height = w + "%";
    b.style.left = bgPos(crop[0]) * (100 - w) + "%";
    b.style.top  = bgPos(crop[1]) * (100 - w) + "%";
  });
}
document.querySelectorAll(".imgwrap").forEach((wrap) => {
  wrap.addEventListener("click", (e) => {
    const r = wrap.getBoundingClientRect();
    crop = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
    renderExplorer();
  });
});
document.getElementById("zoombtn").addEventListener("click", () => {
  ZOOM = ZOOM === 3 ? 5 : ZOOM === 5 ? 2 : 3;
  document.getElementById("zoombtn").textContent = `${ZOOM}×`;
  renderExplorer();
});

function renderExplorer() {
  const { R, sp } = BUDGETS[curBudget];
  const p = pad2(curPrompt);
  const urls = { dense: `assets/gallery/dense_p${p}.webp`,
                 ours:  `assets/gallery/rti_r${R}_p${p}.webp`,
                 base:  `assets/gallery/fs_r${R}_p${p}.webp` };
  document.getElementById("im-dense").src = urls.dense;
  document.getElementById("im-ours").src  = urls.ours;
  document.getElementById("im-base").src  = urls.base;
  for (const k of ["dense", "ours", "base"]) paintCrop(`cr-${k}`, urls[k]);
  paintBoxes();
  const frac = `${R} / ${N_TOK}`;
  document.getElementById("cap-ours").textContent = frac;
  document.getElementById("cap-base").textContent = frac;
  document.getElementById("crcap-ours").textContent = `RTI · ${frac}`;
  document.getElementById("crcap-base").textContent = `Feat Sim · ${frac}`;
  document.getElementById("readout").innerHTML =
    `<b>${frac}</b> tokens &nbsp;·&nbsp; ${Math.round((R / N_TOK) * 100)}% of the sequence` +
    (sp ? ` &nbsp;·&nbsp; <span class="sp">${sp} faster</span>` : "");
  document.getElementById("sel-name").textContent = window.PROMPT_LABELS[curPrompt];
  document.getElementById("promptline").textContent = window.PROMPTS[curPrompt];
  [...thumbs.children].forEach((b, k) => b.setAttribute("aria-pressed", EXPLORER[k] === curPrompt));
  slider.value = curBudget;
  // the next budget along is the likely next click
  const nxt = BUDGETS[Math.min(curBudget + 1, BUDGETS.length - 1)].R;
  new Image().src = `assets/gallery/rti_r${nxt}_p${p}.webp`;
  new Image().src = `assets/gallery/fs_r${nxt}_p${p}.webp`;
}
renderExplorer();

/* ── video tabs ────────────────────────────────────────────────────────── */
/* The nine clips are 18 MB together. Nothing is fetched until its block is
   near the viewport; before that a poster (the finished sample) stands in. */
function whenVisible(el, fn) {
  if (!("IntersectionObserver" in window)) return fn();
  const io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) { io.disconnect(); fn(); }
  }, { rootMargin: "300px" });
  io.observe(el);
}
function videoMatrix(o) {
  const tabs = document.getElementById(o.tabsId);
  const btabs = o.budgetId ? document.getElementById(o.budgetId) : null;
  const video = document.getElementById(o.videoId);
  let p = 0, r = 0, armed = false;
  const src = () => `assets/anim/${o.kind}_p${pad2(o.prompts[p])}_r${o.budgets[r]}.mp4`;
  o.prompts.forEach((idx, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "tab"; b.textContent = window.PROMPT_LABELS[idx];
    b.addEventListener("click", () => { p = i; select(); });
    tabs.appendChild(b);
  });
  if (btabs) o.budgets.forEach((R, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "tab"; b.textContent = `R = ${R}`;
    b.addEventListener("click", () => { r = i; select(); });
    btabs.appendChild(b);
  });
  function select() {
    [...tabs.children].forEach((b, i) => b.setAttribute("aria-pressed", i === p));
    if (btabs) [...btabs.children].forEach((b, i) => b.setAttribute("aria-pressed", i === r));
    video.poster = src().replace(".mp4", ".jpg");
    if (!armed) return;
    video.src = src();
    video.play().catch(() => {});     // autoplay may be blocked; the poster stays
  }
  select();
  whenVisible(video, () => { armed = true; select(); });
}
videoMatrix({ kind: "traj", tabsId: "traj-tabs", budgetId: "traj-budget",
              videoId: "traj-video", prompts: [0, 1, 11, 13, 15], budgets: [512, 256] });
videoMatrix({ kind: "versus", tabsId: "vs-tabs", videoId: "vs-video",
              prompts: [0, 12, 15], budgets: [512] });
document.querySelectorAll("video[data-src]").forEach((v) => {
  whenVisible(v, () => { v.src = v.dataset.src; v.play().catch(() => {}); });
});

/* ── failure cases ─────────────────────────────────────────────────────── */
const FAIL = [
  { R: 128, sp: "2.86×", prompts: [3, 5, 9], note: "At R = 128 the composition and colour hold. Fine geometry starts to soften, and small lettering is the first thing to go." },
  { R: 64,  sp: "3.01×", prompts: [3, 5, 9], note: "At R = 64 — sixteen patches to a token on average — the subject survives but its structure does not. The merge at the same budget loses the subject as well." },
];
let failR = 0, failP = 0;
const failBudgetTabs = document.getElementById("fail-budget-tabs");
const failPromptTabs = document.getElementById("fail-prompt-tabs");
FAIL.forEach((f, i) => {
  const b = document.createElement("button");
  b.type = "button"; b.className = "tab"; b.textContent = `R = ${f.R}`;
  b.addEventListener("click", () => { failR = i; renderFail(); });
  failBudgetTabs.appendChild(b);
});
FAIL[0].prompts.forEach((p, i) => {
  const b = document.createElement("button");
  b.type = "button"; b.className = "tab"; b.textContent = window.PROMPT_LABELS[p];
  b.addEventListener("click", () => { failP = i; renderFail(); });
  failPromptTabs.appendChild(b);
});
function renderFail() {
  const f = FAIL[failR], p = pad2(f.prompts[failP]);
  document.getElementById("f-dense").src = `assets/gallery/dense_p${p}.webp`;
  document.getElementById("f-ours").src  = `assets/gallery/rti_r${f.R}_p${p}.webp`;
  document.getElementById("f-base").src  = `assets/gallery/fs_r${f.R}_p${p}.webp`;
  document.getElementById("f-cap-ours").textContent = `R = ${f.R} · ${f.sp}`;
  document.getElementById("f-cap-base").textContent = `R = ${f.R} · ${f.sp}`;
  document.getElementById("fail-note").textContent = f.note;
  [...failBudgetTabs.children].forEach((b, i) => b.setAttribute("aria-pressed", i === failR));
  [...failPromptTabs.children].forEach((b, i) => b.setAttribute("aria-pressed", i === failP));
}
renderFail();

/* ── chart primitives ──────────────────────────────────────────────────── */
const tip = document.getElementById("tip");
const svgEl = (n, a = {}) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (const k in a) e.setAttribute(k, a[k]);
  return e;
};
function showTip(evt, html) {
  tip.innerHTML = html;
  tip.style.opacity = 1;
  const r = tip.getBoundingClientRect();
  tip.style.left = Math.min(evt.clientX + 12, innerWidth - r.width - 8) + "px";
  tip.style.top = Math.max(evt.clientY - r.height - 12, 8) + "px";
}
const hideTip = () => { tip.style.opacity = 0; };

/* spec: {w,h,pad,x:{min,max,ticks,fmt,label}, y:{...}, series:[{name,color,pts,dash,noMarks}],
         rules:[{y,label}], bands:[{x0,x1,label}], fmt(pt)->tooltip html, area:[i,j] } */
function lineChart(mount, s) {
  const w = s.w || 380, h = s.h || 210;
  const pad = Object.assign({ l: 38, r: 12, t: 10, b: 30 }, s.pad);
  const svg = svgEl("svg", { viewBox: `0 0 ${w} ${h}`, role: "img" });
  const X = (v) => pad.l + (v - s.x.min) / (s.x.max - s.x.min) * (w - pad.l - pad.r);
  const Y = (v) => h - pad.b - (v - s.y.min) / (s.y.max - s.y.min) * (h - pad.t - pad.b);

  (s.bands || []).forEach((b) => {
    svg.appendChild(svgEl("rect", { class: "band", x: X(b.x0), y: pad.t,
      width: X(b.x1) - X(b.x0), height: h - pad.t - pad.b }));
    if (b.label) {
      const t = svgEl("text", { x: (X(b.x0) + X(b.x1)) / 2, y: h - pad.b - 5, "text-anchor": "middle" });
      t.textContent = b.label; svg.appendChild(t);
    }
  });
  s.y.ticks.forEach((v) => {
    svg.appendChild(svgEl("line", { class: "grid", x1: pad.l, x2: w - pad.r, y1: Y(v), y2: Y(v) }));
    const t = svgEl("text", { x: pad.l - 6, y: Y(v) + 3.5, "text-anchor": "end" });
    t.textContent = s.y.fmt ? s.y.fmt(v) : v; svg.appendChild(t);
  });
  s.x.ticks.forEach((v) => {
    const t = svgEl("text", { x: X(v), y: h - pad.b + 13, "text-anchor": "middle" });
    t.textContent = s.x.fmt ? s.x.fmt(v) : v; svg.appendChild(t);
  });
  svg.appendChild(svgEl("line", { class: "axis", x1: pad.l, x2: w - pad.r, y1: h - pad.b, y2: h - pad.b }));
  svg.appendChild(svgEl("line", { class: "axis", x1: pad.l, x2: pad.l, y1: pad.t, y2: h - pad.b }));
  if (s.x.label) {
    const t = svgEl("text", { class: "lab", x: (pad.l + w - pad.r) / 2, y: h - 2, "text-anchor": "middle" });
    t.textContent = s.x.label; svg.appendChild(t);
  }
  if (s.y.label) {
    const t = svgEl("text", { class: "lab", x: -(pad.t + h - pad.b) / 2, y: 10,
      transform: "rotate(-90)", "text-anchor": "middle" });
    t.textContent = s.y.label; svg.appendChild(t);
  }

  if (s.area) {                                   // shaded gap between two series
    const [a, b] = s.area.map((i) => s.series[i].pts);
    const d = a.map((p, i) => `${i ? "L" : "M"}${X(p[0])},${Y(p[1])}`).join("") +
              b.slice().reverse().map((p) => `L${X(p[0])},${Y(p[1])}`).join("") + "Z";
    svg.appendChild(svgEl("path", { d, fill: C.ours, opacity: 0.10 }));
  }
  (s.rules || []).forEach((r) => {
    svg.appendChild(svgEl("line", { class: "rule", x1: pad.l, x2: w - pad.r, y1: Y(r.y), y2: Y(r.y) }));
    if (r.label) {
      const t = svgEl("text", { class: "lab", x: w - pad.r, y: Y(r.y) - 5, "text-anchor": "end" });
      t.textContent = r.label; svg.appendChild(t);
    }
  });

  s.series.forEach((se) => {
    const d = se.pts.map((p, i) => `${i ? "L" : "M"}${X(p[0])},${Y(p[1])}`).join("");
    svg.appendChild(svgEl("path", { d, fill: "none", stroke: se.color, "stroke-width": 2,
      "stroke-linejoin": "round", "stroke-linecap": "round",
      ...(se.dash ? { "stroke-dasharray": "5 3" } : {}) }));
    if (!se.noMarks) se.pts.forEach((p) => {
      svg.appendChild(svgEl("circle", { class: "ring", cx: X(p[0]), cy: Y(p[1]), r: 3.4, fill: se.color }));
      const hit = svgEl("circle", { class: "hit", cx: X(p[0]), cy: Y(p[1]), r: 11 });
      hit.addEventListener("mousemove", (e) => showTip(e, s.fmt(p, se)));
      hit.addEventListener("mouseleave", hideTip);
      svg.appendChild(hit);
    });
  });
  (s.marks || []).forEach((m) => {           // quoted readings, drawn as in the paper
    svg.appendChild(svgEl("line", { class: "grid", x1: X(s.x.min), x2: X(m.x), y1: Y(m.y), y2: Y(m.y),
      stroke: C.base, "stroke-dasharray": "2 2" }));
    svg.appendChild(svgEl("line", { class: "grid", x1: X(m.x), x2: X(m.x), y1: Y(m.y), y2: Y(s.y.min),
      stroke: C.base, "stroke-dasharray": "2 2" }));
    svg.appendChild(svgEl("circle", { cx: X(m.x), cy: Y(m.y), r: 2.6, fill: C.base }));
    const t = svgEl("text", { x: X(m.x) + 6, y: Y(m.y) + 12, fill: C.base });
    t.textContent = m.label; svg.appendChild(t);
  });
  (s.labels || []).forEach((l) => {
    const t = svgEl("text", { class: "lab", x: X(l.x), y: Y(l.y),
      "text-anchor": l.anchor || "start", fill: l.color || "var(--ink-2)" });
    t.textContent = l.text; svg.appendChild(t);
  });
  mount.innerHTML = ""; mount.appendChild(svg);
}

function barChart(mount, s) {
  const w = s.w || 380, h = s.h || 210;
  const pad = Object.assign({ l: 38, r: 12, t: 10, b: 42 }, s.pad);
  const svg = svgEl("svg", { viewBox: `0 0 ${w} ${h}`, role: "img" });
  const Y = (v) => h - pad.b - (v - s.y.min) / (s.y.max - s.y.min) * (h - pad.t - pad.b);
  const iw = (w - pad.l - pad.r) / s.groups.length;          // per group
  s.y.ticks.forEach((v) => {
    svg.appendChild(svgEl("line", { class: "grid", x1: pad.l, x2: w - pad.r, y1: Y(v), y2: Y(v) }));
    const t = svgEl("text", { x: pad.l - 6, y: Y(v) + 3.5, "text-anchor": "end" });
    t.textContent = v; svg.appendChild(t);
  });
  s.groups.forEach((g, gi) => {
    const n = g.bars.length, bw = Math.min(34, (iw - 22) / n);
    g.bars.forEach((b, bi) => {
      const x = pad.l + gi * iw + iw / 2 + (bi - n / 2) * (bw + 2) + 1;
      const rect = svgEl("rect", { x, y: Y(b.v), width: bw, height: Y(s.y.min) - Y(b.v),
        fill: b.color, rx: 2 });
      rect.addEventListener("mousemove", (e) => showTip(e, `${b.name}<br>${g.label} · FID ${b.v.toFixed(2)}`));
      rect.addEventListener("mouseleave", hideTip);
      svg.appendChild(rect);
      const t = svgEl("text", { class: "strong", x: x + bw / 2, y: Y(b.v) - 5, "text-anchor": "middle" });
      t.textContent = b.v.toFixed(2); svg.appendChild(t);
    });
    const gl = svgEl("text", { class: "lab", x: pad.l + gi * iw + iw / 2, y: h - pad.b + 14, "text-anchor": "middle" });
    gl.textContent = g.label; svg.appendChild(gl);
    const gs = svgEl("text", { x: pad.l + gi * iw + iw / 2, y: h - pad.b + 26, "text-anchor": "middle" });
    gs.textContent = g.sub; svg.appendChild(gs);
  });
  (s.rules || []).forEach((r) => {          // after the bars, or a bar hides it
    svg.appendChild(svgEl("line", { class: "rule", x1: pad.l, x2: w - pad.r, y1: Y(r.y), y2: Y(r.y) }));
    // the label goes in the gutter between groups, on a plate, so it never
    // lands on a bar whatever the values are
    if (!r.label) return;
    const cx = pad.l + (w - pad.l - pad.r) / 2, tw = r.label.length * 5.3;
    svg.appendChild(svgEl("rect", { x: cx - tw / 2 - 3, y: Y(r.y) - 15, width: tw + 6, height: 14,
      fill: "var(--surface)" }));
    const t = svgEl("text", { class: "lab", x: cx, y: Y(r.y) - 5, "text-anchor": "middle" });
    t.textContent = r.label; svg.appendChild(t);
  });
  svg.appendChild(svgEl("line", { class: "axis", x1: pad.l, x2: w - pad.r, y1: h - pad.b, y2: h - pad.b }));
  svg.appendChild(svgEl("line", { class: "axis", x1: pad.l, x2: pad.l, y1: pad.t, y2: h - pad.b }));
  mount.innerHTML = ""; mount.appendChild(svg);
}

function legend(mount, items) {
  mount.innerHTML = items.map((i) => i.dash
    ? `<span><i class="dash" style="border-top-color:${i.color}"></i>${i.name}</span>`
    : `<span><i style="background:${i.color}"></i>${i.name}</span>`).join("");
}

/* ── the data (all from the paper's figure sources) ────────────────────── */
const LORENZ = [[0,0],[.075,.345],[.15,.524],[.25,.678],[.325,.760],[.40,.822],[.50,.882],
                [.575,.915],[.65,.939],[.75,.962],[.825,.976],[.90,.987],[1,1]];
const TIME = {
  adaptive: [[.03,63.1],[.17,68.6],[.30,71.7],[.43,73.9],[.53,75.1],[.67,76.8],[.80,78.3],[.93,81.4]],
  uniform:  [[.03,61.8],[.17,66.8],[.30,68.0],[.43,68.2],[.53,68.2],[.67,68.2],[.80,68.1],[.93,69.7]],
  skip:     [[.03,33.5],[.17,34.8],[.30,35.9],[.43,37.1],[.53,38.2],[.67,40.2],[.80,42.7],[.93,45.4]],
};
const DEPTH = {
  adaptive: [61.4,67.5,71.3,72.9,73.5,73.9,74.0,74.1,74.9,74.7,74.0,73.2,72.3,72.1,71.7,68.8,71.9],
  uniform:  [53.4,60.5,64.7,66.1,66.9,67.3,67.4,67.8,68.7,68.7,68.3,68.1,66.6,65.5,64.6,62.0,68.6],
  skip:     [35.3,37.0,37.1,37.4,37.6,37.8,37.8,37.8,38.3,38.3,39.1,39.6,40.3,39.4,41.6,41.3,30.6],
};
const FRONTIER = {   // MiniT2I-L/16. [speedup, metric]
  GenEval:     { dense: 88.12, ours: [[2.11,87.5],[2.59,86.3],[2.86,80.3],[3.01,69.1]],
                 base:  [[2.11,83.1],[2.59,76.5]], min: 66, max: 90, ticks: [70,80,90] },
  CLIPScore:   { dense: 28.50, ours: [[2.11,28.58],[2.59,28.52],[2.86,28.26],[3.01,27.57]],
                 base:  [[2.11,28.80],[2.59,28.31]], min: 27.4, max: 28.95, ticks: [27.5,28,28.5] },
  PickScore:   { dense: 22.75, ours: [[2.11,22.63],[2.59,22.37],[2.86,21.92],[3.01,21.34]],
                 base:  [[2.11,22.34],[2.59,21.76]], min: 21.2, max: 22.9, ticks: [21.5,22,22.5] },
  ImageReward: { dense: 1.232, ours: [[2.11,1.200],[2.59,1.167],[2.86,1.050],[3.01,0.804]],
                 base:  [[2.11,1.16],[2.59,1.01]], min: 0.75, max: 1.29, ticks: [0.8,1.0,1.2] },
};
const R_AT = { 2.11: 512, 2.59: 256, 2.86: 128, 3.01: 64 };
const STEPS = {
  dense: [[1.73,65.9],[2.31,75.7],[2.88,80.5],[4.62,86.4],[5.77,87.0]],
  ours:  [[1.79,82.7],[2.79,84.8],[5.58,86.2]],
};

/* ── render the charts ─────────────────────────────────────────────────── */
lineChart(document.getElementById("ch-space"), {
  h: 200, x: { min: 0, max: 1, ticks: [0, .5, 1], fmt: (v) => v * 100, label: "Patches (%)" },
  y: { min: 0, max: 1, ticks: [0, .5, 1], fmt: (v) => v * 100, label: "Share of detail (%)" },
  series: [
    { name: "even", color: "var(--muted)", pts: [[0, 0], [1, 1]], dash: true, noMarks: true },
    { name: "actual", color: C.ours, pts: LORENZ, noMarks: true },
  ],
  labels: [{ x: .30, y: .90, text: "actual", color: C.ours },
           { x: .72, y: .60, text: "even" }],
  marks: [{ x: .15, y: .524, label: "15% → 50%" }, { x: .50, y: .882, label: "50% → 88%" }],
  fmt: (p) => `${(p[0] * 100).toFixed(0)}% of patches → ${(p[1] * 100).toFixed(0)}% of detail`,
});
lineChart(document.getElementById("ch-time"), {
  h: 200, x: { min: 0, max: 1, ticks: [0, .5, 1], label: "Noise → image" },
  y: { min: 28, max: 84, ticks: [30, 50, 70], label: "Repr. retained (%)" },
  series: [
    { name: "Adaptive (ours)", color: C.ours, pts: TIME.adaptive },
    { name: "Uniform grid", color: C.uniform, pts: TIME.uniform },
    { name: "Skip", color: C.base, pts: TIME.skip },
  ],
  area: [0, 1],
  fmt: (p, se) => `${se.name}<br>t = ${p[0].toFixed(2)} · ${p[1].toFixed(1)}% retained`,
});
legend(document.getElementById("lg-time"), [
  { name: "Adaptive (ours)", color: C.ours }, { name: "Uniform grid", color: C.uniform },
  { name: "Skip", color: C.base }]);

const depthPts = (a) => a.map((v, i) => [i, v]);
lineChart(document.getElementById("ch-depth"), {
  h: 200, x: { min: -0.5, max: 16.5, ticks: [0, 4, 8, 12, 16], label: "Block index" },
  y: { min: 28, max: 84, ticks: [30, 50, 70], label: "Repr. retained (%)" },
  bands: [{ x0: -0.5, x1: 3, label: "dense" }, { x0: 13, x1: 16.5, label: "dense" }],
  series: [
    { name: "Adaptive (ours)", color: C.ours, pts: depthPts(DEPTH.adaptive) },
    { name: "Uniform grid", color: C.uniform, pts: depthPts(DEPTH.uniform) },
    { name: "Skip", color: C.base, pts: depthPts(DEPTH.skip) },
  ],
  fmt: (p, se) => `${se.name}<br>block ${p[0]} · ${p[1].toFixed(1)}% retained`,
});
legend(document.getElementById("lg-depth"), [
  { name: "Adaptive (ours)", color: C.ours }, { name: "Uniform grid", color: C.uniform },
  { name: "Skip", color: C.base }]);

/* ordering ablation: each order retrained with the B/16 recipe, read as the
   paired PickScore difference to the matched Hilbert run. Colours are local to
   this panel (the page's blue/red/purple name other entities). */
lineChart(document.getElementById("ch-order"), {
  h: 190, pad: { l: 48, r: 14, t: 12, b: 30 },
  x: { min: 44, max: 276, ticks: [64, 128, 256], label: "region budget R" },
  y: { min: -0.30, max: 0.04, ticks: [-0.3, -0.2, -0.1, 0], fmt: (v) => v.toFixed(1),
       label: "ΔPickScore vs Hilbert" },
  rules: [{ y: 0, label: "Hilbert (reference)" }],
  series: [
    { name: "Morton (Z)", color: "#EA8600", pts: [[64, -0.153], [128, -0.103], [256, -0.053]] },
    { name: "Raster", color: "var(--ink-2)", pts: [[64, -0.268], [128, -0.149], [256, -0.047]] },
  ],
  fmt: (p, se) => `${se.name}<br>R = ${p[0]} · ΔPick ${p[1].toFixed(3)}`,
});
legend(document.getElementById("lg-order"), [
  { name: "Morton (Z)", color: "#EA8600" }, { name: "Raster", color: "var(--ink-2)" },
  { name: "Hilbert (reference)", color: "var(--ink-2)", dash: true }]);

lineChart(document.getElementById("ch-steps"), {
  h: 190, x: { min: 1.4, max: 6.2, ticks: [2, 4, 6], label: "seconds / image" },
  y: { min: 63, max: 90, ticks: [70, 80, 90], label: "GenEval (%)" },
  series: [
    { name: "RTI, R = 256", color: C.ours, pts: STEPS.ours },
    { name: "Dense, fewer steps", color: "var(--ink-2)", pts: STEPS.dense },
  ],
  fmt: (p, se) => `${se.name}<br>${p[0].toFixed(2)} s/image · ${p[1].toFixed(1)} GenEval`,
});
legend(document.getElementById("lg-steps"), [
  { name: "RTI, R = 256 (steps vary)", color: C.ours },
  { name: "Dense backbone, fewer steps", color: "var(--ink-2)" }]);

/* frontier, with a metric switch */
const frTabs = document.getElementById("fr-tabs");
Object.keys(FRONTIER).forEach((k, i) => {
  const b = document.createElement("button");
  b.type = "button"; b.className = "tab"; b.textContent = k;
  b.addEventListener("click", () => drawFrontier(k));
  frTabs.appendChild(b);
});
function drawFrontier(metric) {
  const d = FRONTIER[metric];
  [...frTabs.children].forEach((b) => b.setAttribute("aria-pressed", b.textContent === metric));
  const dec = metric === "GenEval" ? 1 : metric === "ImageReward" ? 3 : 2;
  lineChart(document.getElementById("ch-frontier"), {
    h: 250, pad: { l: 44, r: 14, t: 14, b: 32 },
    x: { min: 2.0, max: 3.12, ticks: [2.11, 2.59, 2.86, 3.01],
         fmt: (v) => v.toFixed(2) + "×", label: "speedup (wall-clock, RTX 4090)" },
    y: { min: d.min, max: d.max, ticks: d.ticks, label: metric },
    rules: [{ y: d.dense, label: "dense backbone" }],
    series: [
      { name: "RTI (ours)", color: C.ours, pts: d.ours },
      { name: "Feat Sim", color: C.base, pts: d.base },
    ],
    fmt: (p, se) => `${se.name} · R = ${R_AT[p[0]]}<br>${p[0].toFixed(2)}× · ${metric} ${p[1].toFixed(dec)}`,
  });
  const rows = [2.11, 2.59, 2.86, 3.01].map((s) => {
    const o = d.ours.find((p) => p[0] === s), b = d.base.find((p) => p[0] === s);
    return `<tr><td>${R_AT[s]}</td><td>${s.toFixed(2)}×</td>
            <td>${o ? o[1].toFixed(dec) : "—"}</td><td>${b ? b[1].toFixed(dec) : "—"}</td></tr>`;
  }).join("");
  document.getElementById("tb-frontier").innerHTML =
    `<table><thead><tr><th>R</th><th>speedup</th><th>RTI</th><th>Feat Sim</th></tr></thead>
     <tbody>${rows}</tbody></table>
     <p class="hint">Dense backbone: ${d.dense.toFixed(dec)} at 1.00×.</p>`;
}
drawFrontier("GenEval");
legend(document.getElementById("lg-frontier"), [
  { name: "RTI (ours)", color: C.ours }, { name: "Feat Sim", color: C.base }]);

barChart(document.getElementById("ch-fid"), {
  h: 250, pad: { l: 40, r: 14, t: 18, b: 44 },
  y: { min: 0, max: 30, ticks: [0, 10, 20, 30] },
  rules: [{ y: 9.07 }],
  groups: [
    { label: "R = 512", sub: "2.11×", bars: [
      { name: "RTI (ours)", v: 11.43, color: C.ours }, { name: "Feat Sim", v: 19.99, color: C.base }] },
    { label: "R = 256", sub: "2.59×", bars: [
      { name: "RTI (ours)", v: 14.71, color: C.ours }, { name: "Feat Sim", v: 28.02, color: C.base }] },
  ],
});
legend(document.getElementById("lg-fid"), [
  { name: "RTI (ours)", color: C.ours }, { name: "Feat Sim", color: C.base },
  { name: "dense backbone · 9.07", color: "var(--ink-2)", dash: true }]);

/* ── 06b: the same prompt and seed at five budgets, to show the sampler
   changing mode rather than degrading ────────────────────────────────────── */
const strip = document.getElementById("drift-strip");
if (strip) {
  const BUD = [[1024, "dense"], [728, "RTI"], [512, "RTI"], [256, "RTI"], [128, "RTI"], [64, "RTI"]];
  const ROWS = [
    { p: 7,  name: "style unstated", flip: [728] },
    { p: 16, name: "photograph, stated" },
    { p: 17, name: "cartoon, stated" },
  ];
  strip.innerHTML = ROWS.map((row) => `
    <div class="striprow"><div class="striplabel">${row.name}</div>
    ${BUD.map(([R, who]) => `
      <figure class="pane${(row.flip || []).includes(R) ? " flip" : ""}">
        <div class="cap"><span class="who">${who}</span><span class="r">${R} / 1024</span></div>
        <img src="assets/gallery/${R === 1024 ? `dense_p${String(row.p).padStart(2, "0")}`
                                              : `rti_r${R}_p${String(row.p).padStart(2, "0")}`}.webp"
             alt="${row.name} at ${R} tokens" loading="lazy">
      </figure>`).join("")}
    </div>`).join("");
}
