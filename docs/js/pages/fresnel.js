import { $, num, fmt, valid, cells, renderCases } from "../common.js";
import { fresnel, brewster } from "../lib/fresnel.js";
import { cases } from "../cases/fresnel.cases.js";

// Rs・Rp の比較なので折れ線グラフ（棒グラフにしない）
function drawChart(n1, n2, th) {
  const W = 640, H = 300, ml = 48, mr = 16, mt = 14, mb = 40, pw = W - ml - mr, ph = H - mt - mb;
  const x = (a) => ml + (a / 90) * pw, y = (v) => mt + (1 - v) * ph;
  let ps = "", pp = "";
  for (let i = 0; i <= 900; i++) {
    const a = i / 10, f = fresnel(n1, n2, Math.min(a, 89.999));
    ps += (i ? "L" : "M") + x(a).toFixed(1) + "," + y(f.Rs).toFixed(1);
    pp += (i ? "L" : "M") + x(a).toFixed(1) + "," + y(f.Rp).toFixed(1);
  }
  let g = "";
  for (let a = 0; a <= 90; a += 15) {
    g += `<line x1="${x(a)}" x2="${x(a)}" y1="${mt}" y2="${mt + ph}" stroke="var(--line)"/><text x="${x(a)}" y="${H - mb + 18}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--mono)">${a}</text>`;
  }
  for (let v = 0; v <= 100; v += 25) {
    g += `<line x1="${ml}" x2="${ml + pw}" y1="${y(v / 100)}" y2="${y(v / 100)}" stroke="var(--line)"/><text x="${ml - 6}" y="${y(v / 100) + 4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--mono)">${v}</text>`;
  }
  const cur = Math.min(Math.max(th, 0), 90);
  const fc = fresnel(n1, n2, Math.min(cur, 89.999));
  $("f_chart").innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="入射角に対する反射率のグラフ">
  ${g}
  <line x1="${x(cur)}" x2="${x(cur)}" y1="${mt}" y2="${mt + ph}" stroke="var(--muted)" stroke-dasharray="4 4"/>
  <path d="${ps}" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
  <path d="${pp}" fill="none" stroke="var(--accent2)" stroke-width="2.2"/>
  <circle cx="${x(cur)}" cy="${y(fc.Rs)}" r="4" fill="var(--accent)"/>
  <circle cx="${x(cur)}" cy="${y(fc.Rp)}" r="4" fill="var(--accent2)"/>
  <text x="${ml + pw / 2}" y="${H - 4}" text-anchor="middle" font-size="12" fill="var(--muted)">入射角 θᵢ [°]</text>
  <text x="12" y="${mt + ph / 2}" text-anchor="middle" font-size="12" fill="var(--muted)" transform="rotate(-90 12 ${mt + ph / 2})">反射率 [%]</text>
  </svg>`;
}

function run() {
  const n1 = num("f_n1"), n2 = num("f_n2"), th = num("f_th");
  if (!valid(n1, n2, th) || n1 <= 0 || n2 <= 0) {
    cells($("f_out"), [["入力", "数値を入れてください", 1]]);
    $("f_chart").innerHTML = "";
    return;
  }
  const r = fresnel(n1, n2, th);
  cells($("f_out"), [
    ["Rs（s偏光）[%]", fmt(r.Rs * 100, 2)],
    ["Rp（p偏光）[%]", fmt(r.Rp * 100, 2)],
    ["無偏光 R [%]", fmt(r.R * 100, 2)],
    ["ブリュースター角 θB [°]", fmt(brewster(n1, n2), 2)],
  ]);
  drawChart(n1, n2, th);
}
["f_n1", "f_n2", "f_th"].forEach((i) => $(i).addEventListener("input", run));
run();
renderCases($("tests").querySelector("tbody"), cases);
