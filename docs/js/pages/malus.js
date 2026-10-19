import { $, num, fmt, valid, cells, renderCases } from "../common.js";
import { malus } from "../lib/malus.js";
import { cases } from "../cases/malus.cases.js";

// 角度 0〜180° に対する透過率 I/I₀ を折れ線グラフで描く
function drawChart(th) {
  const W = 640, H = 300, ml = 48, mr = 16, mt = 14, mb = 40, pw = W - ml - mr, ph = H - mt - mb;
  const x = (a) => ml + (a / 180) * pw, y = (v) => mt + (1 - v) * ph;
  let p = "";
  for (let i = 0; i <= 1800; i++) {
    const a = i / 10;
    p += (i ? "L" : "M") + x(a).toFixed(1) + "," + y(malus(1, a).ratio).toFixed(1);
  }
  let g = "";
  for (let a = 0; a <= 180; a += 30) {
    g += `<line x1="${x(a)}" x2="${x(a)}" y1="${mt}" y2="${mt + ph}" stroke="var(--line)"/><text x="${x(a)}" y="${H - mb + 18}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--mono)">${a}</text>`;
  }
  for (let v = 0; v <= 100; v += 25) {
    g += `<line x1="${ml}" x2="${ml + pw}" y1="${y(v / 100)}" y2="${y(v / 100)}" stroke="var(--line)"/><text x="${ml - 6}" y="${y(v / 100) + 4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--mono)">${v}</text>`;
  }
  const cur = Math.min(Math.max(th, 0), 180);
  $("m_chart").innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="角度に対する透過率のグラフ">
  ${g}
  <line x1="${x(cur)}" x2="${x(cur)}" y1="${mt}" y2="${mt + ph}" stroke="var(--muted)" stroke-dasharray="4 4"/>
  <path d="${p}" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
  <circle cx="${x(cur)}" cy="${y(malus(1, cur).ratio)}" r="4" fill="var(--accent)"/>
  <text x="${ml + pw / 2}" y="${H - 4}" text-anchor="middle" font-size="12" fill="var(--muted)">偏光方向と透過軸の角度 θ [°]</text>
  <text x="12" y="${mt + ph / 2}" text-anchor="middle" font-size="12" fill="var(--muted)" transform="rotate(-90 12 ${mt + ph / 2})">透過率 I/I₀ [%]</text>
  </svg>`;
}

function run() {
  const I0 = num("m_I0"), th = num("m_th");
  if (!valid(I0, th) || I0 < 0) {
    cells($("m_out"), [["入力", "数値を入れてください", 1]]);
    $("m_chart").innerHTML = "";
    return;
  }
  const r = malus(I0, th);
  cells($("m_out"), [
    ["透過光の強度 I", fmt(r.I, 4)],
    ["透過率 I/I₀ [%]", fmt(r.ratio * 100, 2)],
  ]);
  drawChart(th);
}
["m_I0", "m_th"].forEach((i) => $(i).addEventListener("input", run));
run();
renderCases($("tests").querySelector("tbody"), cases);
