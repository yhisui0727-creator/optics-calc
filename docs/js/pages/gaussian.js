import { $, num, fmt, valid, cells, renderCases } from "../common.js";
import { rayleighLength, divergence, gaussianBeam } from "../lib/gaussian.js";
import { cases } from "../cases/gaussian.cases.js";

// 距離 z に対するビーム半径 ±w(z) を折れ線グラフで描く（ビームの外形）
function drawChart(lam, w0, z) {
  const W = 640, H = 300, ml = 56, mr = 16, mt = 14, mb = 40, pw = W - ml - mr, ph = H - mt - mb;
  const zR = rayleighLength(lam, w0);
  const ZM = Math.max(3 * zR, Math.abs(z) * 1.1);
  const WM = gaussianBeam(lam, w0, ZM).w * 1.1;
  const x = (v) => ml + ((v + ZM) / (2 * ZM)) * pw, y = (v) => mt + (1 - (v + WM) / (2 * WM)) * ph;
  let pu = "", pl = "";
  for (let i = 0; i <= 400; i++) {
    const zz = -ZM + (2 * ZM * i) / 400, w = gaussianBeam(lam, w0, zz).w;
    pu += (i ? "L" : "M") + x(zz).toFixed(1) + "," + y(w).toFixed(1);
    pl += (i ? "L" : "M") + x(zz).toFixed(1) + "," + y(-w).toFixed(1);
  }
  let g = "";
  for (let k = -4; k <= 4; k++) {
    const v = (k * ZM) / 4;
    g += `<line x1="${x(v)}" x2="${x(v)}" y1="${mt}" y2="${mt + ph}" stroke="var(--line)"/><text x="${x(v)}" y="${H - mb + 18}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--mono)">${fmt(v, 0)}</text>`;
  }
  for (let k = -2; k <= 2; k++) {
    const v = (k * WM) / 2;
    g += `<line x1="${ml}" x2="${ml + pw}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${ml - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--mono)">${fmt(v, 2)}</text>`;
  }
  const wz = gaussianBeam(lam, w0, z).w;
  $("g_chart").innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="距離に対するビーム半径のグラフ">
  ${g}
  <line x1="${x(-zR)}" x2="${x(-zR)}" y1="${mt}" y2="${mt + ph}" stroke="var(--accent2)" stroke-dasharray="2 4"/>
  <line x1="${x(zR)}" x2="${x(zR)}" y1="${mt}" y2="${mt + ph}" stroke="var(--accent2)" stroke-dasharray="2 4"/>
  <line x1="${x(z)}" x2="${x(z)}" y1="${mt}" y2="${mt + ph}" stroke="var(--muted)" stroke-dasharray="4 4"/>
  <path d="${pu}" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
  <path d="${pl}" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
  <circle cx="${x(z)}" cy="${y(wz)}" r="4" fill="var(--accent)"/>
  <text x="${ml + pw / 2}" y="${H - 4}" text-anchor="middle" font-size="12" fill="var(--muted)">ウェストからの距離 z [mm]</text>
  <text x="12" y="${mt + ph / 2}" text-anchor="middle" font-size="12" fill="var(--muted)" transform="rotate(-90 12 ${mt + ph / 2})">ビーム半径 ±w [mm]</text>
  </svg>`;
}

function run() {
  const lam = num("g_lam"), w0 = num("g_w0"), z = num("g_z");
  if (!valid(lam, w0, z) || lam <= 0 || w0 <= 0) {
    cells($("g_out"), [["入力", "数値を入れてください", 1]]);
    $("g_chart").innerHTML = "";
    return;
  }
  const r = gaussianBeam(lam, w0, z);
  cells($("g_out"), [
    ["レイリー長 zR [mm]", fmt(r.zR, 2)],
    ["ビーム半径 w(z) [mm]", fmt(r.w, 4)],
    ["波面の曲率半径 R(z) [mm]", Number.isFinite(r.R) ? fmt(r.R, 1) : "∞（平らな波面）"],
    ["広がり角（半角）θ [°]", fmt(divergence(lam, w0), 5)],
  ]);
  drawChart(lam, w0, z);
}
["g_lam", "g_w0", "g_z"].forEach((i) => $(i).addEventListener("input", run));
run();
renderCases($("tests").querySelector("tbody"), cases);
