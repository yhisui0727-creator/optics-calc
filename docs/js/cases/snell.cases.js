// 検証ケース（教科書・公知の値）。テストとページの検証表の両方がこれを使う。
import { snell } from "../lib/snell.js";

export const cases = [
  { name: "ガラス(n=1.5)→空気 臨界角", expected: 41.81, tol: 0.01, unit: "°", actual: () => snell(1.5, 1, 0).crit },
  { name: "水(n=1.333)→空気 臨界角", expected: 48.61, tol: 0.01, unit: "°", actual: () => snell(1.333, 1, 0).crit },
  { name: "ダイヤモンド(n=2.417)→空気 臨界角", expected: 24.44, tol: 0.01, unit: "°", actual: () => snell(2.417, 1, 0).crit },
  { name: "空気→ガラス(n=1.5) 入射角30° の屈折角", expected: 19.47, tol: 0.01, unit: "°", actual: () => snell(1, 1.5, 30).tt },
  { name: "垂直入射(0°)の屈折角", expected: 0, tol: 1e-9, unit: "°", actual: () => snell(1, 1.5, 0).tt },
];
