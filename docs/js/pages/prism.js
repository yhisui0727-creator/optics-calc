import { $, num, fmt, valid, cells, renderCases } from "../common.js";
import { minDeviation, minDeviationIncidence, deviation } from "../lib/prism.js";
import { cases } from "../cases/prism.cases.js";

// 入射角 0〜90° に対する偏角 δ を折れ線グラフで描く（出てこない角度は線を切る）
function drawChart(A, n, th) {
  const W = 640, H = 300, ml = 48, mr = 16, mt = 14, mb = 40, pw = W - ml - mr, ph = H - mt - mb;
  const pts = [];
  for (let i = 0; i <= 900; i++) pts.push([i / 10, deviation(A, n, i / 10)]);
  const ok = pts.filter(([, d]) => Number.isFinite(d)).map(([, d]) => d);
  if (!ok.length) {
    $("p_chart").innerHTML = "";
    return;
  }
  const top = Math.ceil(Math.max(...ok) / 10) * 10, bot = Math.max(0, Math.floor(Math.min(...ok) / 10) * 10 - 10);
  const x = (a) => ml + (a / 90) * pw, y = (v) => mt + (1 - (v - bot) / (top - bot)) * ph;
  let p = "", pen = false;
  for (const [a, d] of pts) {
    if (!Number.isFinite(d)) { pen = false; continue; }
    p += (pen ? "L" : "M") + x(a).toFixed(1) + "," + y(d).toFixed(1);
    pen = true;
  }
  let g = "";
  for (let a = 0; a <= 90; a += 15) {
    g += `<line x1="${x(a)}" x2="${x(a)}" y1="${mt}" y2="${mt + ph}" stroke="var(--line)"/><text x="${x(a)}" y="${H - mb + 18}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--mono)">${a}</text>`;
  }
  const step = Math.max(10, Math.ceil((top - bot) / 50) * 10);
  for (let v = bot; v <= top; v += step) {
    g += `<line x1="${ml}" x2="${ml + pw}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${ml - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--mono)">${v}</text>`;
  }
  const dm = minDeviation(A, n), tm = minDeviationIncidence(A, n);
  const dc = deviation(A, n, th), inRange = th >= 0 && th <= 90 && Number.isFinite(dc);
  $("p_chart").innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="入射角に対する偏角のグラフ">
  ${g}
  ${inRange ? `<line x1="${x(th)}" x2="${x(th)}" y1="${mt}" y2="${mt + ph}" stroke="var(--muted)" stroke-dasharray="4 4"/>` : ""}
  <path d="${p}" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
  ${Number.isFinite(dm) ? `<circle cx="${x(tm)}" cy="${y(dm)}" r="4" fill="var(--accent2)"/>` : ""}
  ${inRange ? `<circle cx="${x(th)}" cy="${y(dc)}" r="4" fill="var(--accent)"/>` : ""}
  <text x="${ml + pw / 2}" y="${H - 4}" text-anchor="middle" font-size="12" fill="var(--muted)">入射角 θ₁ [°]</text>
  <text x="12" y="${mt + ph / 2}" text-anchor="middle" font-size="12" fill="var(--muted)" transform="rotate(-90 12 ${mt + ph / 2})">偏角 δ [°]</text>
  </svg>`;
}

function run() {
  const A = num("p_A"), n = num("p_n"), th = num("p_th");
  if (!valid(A, n, th) || A <= 0 || A >= 180 || n <= 0) {
    cells($("p_out"), [["入力", "数値を入れてください", 1]]);
    $("p_chart").innerHTML = "";
    return;
  }
  const dm = minDeviation(A, n), d = deviation(A, n, th);
  const noMin = !Number.isFinite(dm), noD = !Number.isFinite(d);
  cells($("p_out"), [
    ["最小偏角 δmin [°]", noMin ? "光が通り抜けない" : fmt(dm), noMin],
    ["そのときの入射角 [°]", noMin ? "—" : fmt(minDeviationIncidence(A, n)), noMin],
    ["入射角 θ₁ での偏角 δ [°]", noD ? "出口で全反射" : fmt(d), noD],
  ]);
  drawChart(A, n, th);
}
["p_A", "p_n", "p_th"].forEach((i) => $(i).addEventListener("input", run));
run();
renderCases($("tests").querySelector("tbody"), cases);
