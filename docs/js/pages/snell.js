import { $, num, fmt, valid, cells, renderCases } from "../common.js";
import { snell } from "../lib/snell.js";
import { cases } from "../cases/snell.cases.js";

function run() {
  const n1 = num("s_n1"), n2 = num("s_n2"), th = num("s_th");
  if (!valid(n1, n2, th) || n1 <= 0 || n2 <= 0) {
    cells($("s_out"), [["入力", "数値を入れてください", 1]]);
    return;
  }
  const r = snell(n1, n2, th);
  cells($("s_out"), [
    ["屈折角 θₜ [°]", r.tir ? "全反射（透過なし）" : fmt(r.tt), r.tir],
    ["臨界角 θc [°]", Number.isFinite(r.crit) ? fmt(r.crit) : "なし（n₁ ≤ n₂）", !Number.isFinite(r.crit)],
  ]);
}
["s_n1", "s_n2", "s_th"].forEach((i) => $(i).addEventListener("input", run));
run();
renderCases($("tests").querySelector("tbody"), cases);
