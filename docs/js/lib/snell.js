import { D2R, R2D } from "./units.js";

// スネルの法則  n1 sin θi = n2 sin θt
// 入力: 屈折率 n1, n2、入射角 thDeg [°]
// 出力: { tir, tt [°] (全反射でなければ), crit [°] (n1 > n2 のときのみ、なければ NaN) }
export function snell(n1, n2, thDeg) {
  const s = (n1 / n2) * Math.sin(thDeg * D2R);
  const crit = n1 > n2 ? Math.asin(n2 / n1) * R2D : NaN;
  if (s > 1) return { tir: true, crit };
  return { tir: false, tt: Math.asin(s) * R2D, crit };
}
