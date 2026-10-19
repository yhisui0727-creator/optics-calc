import { $, num, fmt, valid, cells, renderCases } from "../common.js";
import { arReflectance, optimalIndex, quarterWaveThickness } from "../lib/arcoat.js";
import { cases } from "../cases/arcoat.cases.js";

const LMIN = 0.0004, LMAX = 0.0007; // グラフの波長範囲 [mm]（400〜700 nm）

// 膜ありと膜なしの反射率の比較なので折れ線グラフ（棒グラフにしない）
function drawChart(n0, n1, ns, d, lam0) {
  const bare = arReflectance(n0, ns, ns, 0, lam0); // 膜なし（膜と基板が同じ＝境界1つ）
  const W = 640, H = 300, ml = 48, mr = 30, mt = 14, mb = 40, pw = W - ml - mr, ph = H - mt - mb;
  let vmax = 0;
  const pts = [];
  for (let i = 0; i <= 300; i++) {
    const l = LMIN + ((LMAX - LMIN) * i) / 300;
    const r = arReflectance(n0, n1, ns, d, l);
    pts.push([l, r]);
    vmax = Math.max(vmax, r, bare);
  }
  const top = Math.max(1, Math.ceil((vmax * 100) / 1)); // 縦軸の上限 [%]
  const x = (l) => ml + ((l - LMIN) / (LMAX - LMIN)) * pw, y = (v) => mt + (1 - (v * 100) / top) * ph;
  const pc = pts.map(([l, r], i) => (i ? "L" : "M") + x(l).toFixed(1) + "," + y(r).toFixed(1)).join("");
  let g = "";
  for (let k = 0; k <= 6; k++) {
    const l = LMIN + k * 0.00005;
    g += `<line x1="${x(l)}" x2="${x(l)}" y1="${mt}" y2="${mt + ph}" stroke="var(--line)"/><text x="${x(l)}" y="${H - mb + 18}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--mono)">${l.toFixed(5)}</text>`;
  }
  const step = top <= 5 ? 1 : Math.ceil(top / 5);
  for (let v = 0; v <= top; v += step) {
    g += `<line x1="${ml}" x2="${ml + pw}" y1="${y(v / 100)}" y2="${y(v / 100)}" stroke="var(--line)"/><text x="${ml - 6}" y="${y(v / 100) + 4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--mono)">${v}</text>`;
  }
  const inRange = lam0 >= LMIN && lam0 <= LMAX;
  $("a_chart").innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="波長に対する反射率のグラフ">
  ${g}
  ${inRange ? `<line x1="${x(lam0)}" x2="${x(lam0)}" y1="${mt}" y2="${mt + ph}" stroke="var(--muted)" stroke-dasharray="4 4"/>` : ""}
  <line x1="${ml}" x2="${ml + pw}" y1="${y(bare)}" y2="${y(bare)}" stroke="var(--accent2)" stroke-width="2.2"/>
  <path d="${pc}" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
  ${inRange ? `<circle cx="${x(lam0)}" cy="${y(arReflectance(n0, n1, ns, d, lam0))}" r="4" fill="var(--accent)"/>` : ""}
  <text x="${ml + pw / 2}" y="${H - 4}" text-anchor="middle" font-size="12" fill="var(--muted)">波長 λ [mm]</text>
  <text x="12" y="${mt + ph / 2}" text-anchor="middle" font-size="12" fill="var(--muted)" transform="rotate(-90 12 ${mt + ph / 2})">反射率 [%]</text>
  </svg>`;
}

function run() {
  const n0 = num("a_n0"), n1 = num("a_n1"), ns = num("a_ns"), lam0 = num("a_lam");
  if (!valid(n0, n1, ns, lam0) || n0 <= 0 || n1 <= 0 || ns <= 0 || lam0 <= 0) {
    cells($("a_out"), [["入力", "数値を入れてください", 1]]);
    $("a_chart").innerHTML = "";
    return;
  }
  const d = quarterWaveThickness(n1, lam0);
  cells($("a_out"), [
    ["最適な膜の屈折率 √(n₀nₛ)", fmt(optimalIndex(n0, ns), 4)],
    ["4分の1波長膜の膜厚 d [mm]", fmt(d, 8)],
    ["膜ありの反射率 R [%]（λ₀）", fmt(arReflectance(n0, n1, ns, d, lam0) * 100, 3)],
    ["膜なしの反射率 [%]", fmt(arReflectance(n0, ns, ns, 0, lam0) * 100, 3)],
  ]);
  drawChart(n0, n1, ns, d, lam0);
}
["a_n0", "a_n1", "a_ns", "a_lam"].forEach((i) => $(i).addEventListener("input", run));
run();
renderCases($("tests").querySelector("tbody"), cases);
