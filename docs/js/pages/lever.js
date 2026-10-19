import { $, num, fmt, valid, cells, renderCases } from "../common.js";
import { lever } from "../lib/lever.js";
import { cases } from "../cases/lever.cases.js";

function run() {
  const phi = num("l_phi"), L = num("l_L");
  if (!valid(phi, L)) {
    cells($("l_out"), [["入力", "数値を入れてください", 1]]);
    return;
  }
  const r = lever(phi, L);
  cells($("l_out"), [
    ["反射光の振れ角 δ [°]", fmt(r.dev, 4)],
    ["光点の移動量 d [mm]", fmt(r.d, 4)],
  ]);
}
["l_phi", "l_L"].forEach((i) => $(i).addEventListener("input", run));
run();
renderCases($("tests").querySelector("tbody"), cases);
