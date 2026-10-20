import { $, num, fmt, valid, cells, renderCases } from "../common.js";
import { thinLens } from "../lib/thinlens.js";
import { cases } from "../cases/thinlens.cases.js";

// 物体の位置 a に対する像の位置 b を折れ線グラフで描く（a = f の前後で線を切る）
function drawChart(f, a) {
  const W = 640, H = 300, ml = 56, mr = 16, mt = 14, mb = 40, pw = W - ml - mr, ph = H - mt - mb;
  const F = Math.abs(f), AMAX = 6 * F, BMAX = 6 * F;
  const x = (v) => ml + (v / AMAX) * pw, y = (v) => mt + (1 - (v + BMAX) / (2 * BMAX)) * ph;
  let p = "", pen = false, prev = 0;
  for (let i = 1; i <= 1200; i++) {
    const av = (AMAX * i) / 1200, b = thinLens(f, av).b;
    const out = !Number.isFinite(b) || Math.abs(b) > BMAX || (pen && Math.sign(b) !== Math.sign(prev));
    if (out) { pen = false; prev = b; continue; }
    p += (pen ? "L" : "M") + x(av).toFixed(1) + "," + y(b).toFixed(1);
    pen = true;
    prev = b;
  }
  let g = "";
  for (let k = 0; k <= 6; k++) {
    const v = k * F;
    g += `<line x1="${x(v)}" x2="${x(v)}" y1="${mt}" y2="${mt + ph}" stroke="var(--line)"/><text x="${x(v)}" y="${H - mb + 18}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--mono)">${fmt(v, 0)}</text>`;
  }
  for (let k = -6; k <= 6; k += 2) {
    const v = k * F;
    g += `<line x1="${ml}" x2="${ml + pw}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${ml - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--mono)">${fmt(v, 0)}</text>`;
  }
  const r = thinLens(f, a), show = a > 0 && a <= AMAX && Number.isFinite(r.b) && Math.abs(r.b) <= BMAX;
  $("t_chart").innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="物体の位置に対する像の位置のグラフ">
  ${g}
  <line x1="${ml}" x2="${ml + pw}" y1="${y(0)}" y2="${y(0)}" stroke="var(--muted)"/>
  ${a > 0 && a <= AMAX ? `<line x1="${x(a)}" x2="${x(a)}" y1="${mt}" y2="${mt + ph}" stroke="var(--muted)" stroke-dasharray="4 4"/>` : ""}
  <path d="${p}" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
  ${show ? `<circle cx="${x(a)}" cy="${y(r.b)}" r="4" fill="var(--accent)"/>` : ""}
  <text x="${ml + pw / 2}" y="${H - 4}" text-anchor="middle" font-size="12" fill="var(--muted)">物体からレンズまでの距離 a [mm]</text>
  <text x="12" y="${mt + ph / 2}" text-anchor="middle" font-size="12" fill="var(--muted)" transform="rotate(-90 12 ${mt + ph / 2})">像の位置 b [mm]</text>
  </svg>`;
}

function run() {
  const f = num("t_f"), a = num("t_a");
  if (!valid(f, a) || f === 0 || a <= 0) {
    cells($("t_out"), [["入力", "数値を入れてください", 1]]);
    $("t_chart").innerHTML = "";
    return;
  }
  const r = thinLens(f, a);
  if (r.inf) {
    cells($("t_out"), [
      ["像の位置 b [mm]", "無限遠（像はできない）", 1],
      ["倍率 m", "—", 1],
      ["像の種類", "物体が焦点の上にある", 1],
    ]);
  } else {
    cells($("t_out"), [
      ["像の位置 b [mm]", fmt(r.b, 2)],
      ["倍率 m", fmt(r.m, 3)],
      ["像の種類", (r.real ? "実像" : "虚像") + "・" + (r.m < 0 ? "倒立" : "正立")],
    ]);
  }
  drawChart(f, a);
}
["t_f", "t_a"].forEach((i) => $(i).addEventListener("input", run));
run();
renderCases($("tests").querySelector("tbody"), cases);
