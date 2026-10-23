import { $, num, fmt, valid, cells, renderCases } from "../common.js";
import { braggAngle, maxOrder } from "../lib/bragg.js";
import { cases } from "../cases/bragg.cases.js";

const COLORS = ["var(--accent)", "var(--accent2)", "var(--muted)"];

// 波長 λ（0〜2d）に対するブラッグ角を、1〜3次で比べる折れ線グラフ
function drawChart(d, lam, n) {
  const W = 640, H = 300, ml = 48, mr = 16, mt = 14, mb = 40, pw = W - ml - mr, ph = H - mt - mb;
  const x = (r) => ml + (r / 2) * pw, y = (v) => mt + (1 - v / 90) * ph; // 横軸は λ/d（0〜2）
  let paths = "";
  for (let k = 1; k <= 3; k++) {
    let p = "";
    for (let i = 0; i <= 400; i++) {
      const r = (2 * i) / 400, th = braggAngle(1, r, k);
      if (!Number.isFinite(th)) break;
      p += (i ? "L" : "M") + x(r).toFixed(1) + "," + y(th).toFixed(1);
    }
    paths += `<path d="${p}" fill="none" stroke="${COLORS[k - 1]}" stroke-width="2.2"/>`;
  }
  let g = "";
  for (let k = 0; k <= 4; k++) {
    const r = k / 2;
    g += `<line x1="${x(r)}" x2="${x(r)}" y1="${mt}" y2="${mt + ph}" stroke="var(--line)"/><text x="${x(r)}" y="${H - mb + 18}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--mono)">${r.toFixed(1)}</text>`;
  }
  for (let v = 0; v <= 90; v += 15) {
    g += `<line x1="${ml}" x2="${ml + pw}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${ml - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--mono)">${v}</text>`;
  }
  const r = lam / d, th = braggAngle(d, lam, n), inRange = r <= 2;
  const ci = Math.min(Math.max(n, 1), 3) - 1;
  $("b_chart").innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="波長と格子面間隔の比に対するブラッグ角のグラフ">
  ${g}
  ${inRange ? `<line x1="${x(r)}" x2="${x(r)}" y1="${mt}" y2="${mt + ph}" stroke="var(--muted)" stroke-dasharray="4 4"/>` : ""}
  ${paths}
  ${inRange && Number.isFinite(th) && n <= 3 ? `<circle cx="${x(r)}" cy="${y(th)}" r="4" fill="${COLORS[ci]}"/>` : ""}
  <text x="${ml + pw / 2}" y="${H - 4}" text-anchor="middle" font-size="12" fill="var(--muted)">波長と格子面の間隔の比 λ/d</text>
  <text x="12" y="${mt + ph / 2}" text-anchor="middle" font-size="12" fill="var(--muted)" transform="rotate(-90 12 ${mt + ph / 2})">ブラッグ角 θ [°]</text>
  </svg>`;
}

function run() {
  const d = num("b_d"), lam = num("b_lam"), n = num("b_n");
  if (!valid(d, lam, n) || d <= 0 || lam <= 0 || n < 1 || !Number.isInteger(n)) {
    cells($("b_out"), [["入力", "数値を入れてください（次数は1以上の整数）", 1]]);
    $("b_chart").innerHTML = "";
    return;
  }
  const th = braggAngle(d, lam, n), no = !Number.isFinite(th), nmax = maxOrder(d, lam);
  cells($("b_out"), [
    ["ブラッグ角 θ [°]", no ? "この次数の反射は起きない" : fmt(th, 3), no],
    ["回折角 2θ [°]", no ? "—" : fmt(2 * th, 3), no],
    ["反射が起きる最大の次数", nmax < 1 ? "なし（λ > 2d）" : String(nmax), nmax < 1],
  ]);
  drawChart(d, lam, n);
}
["b_d", "b_lam", "b_n"].forEach((i) => $(i).addEventListener("input", run));
run();
renderCases($("tests").querySelector("tbody"), cases);
