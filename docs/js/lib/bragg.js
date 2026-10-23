import { D2R, R2D } from "./units.js";

// ブラッグ反射  n·λ = 2·d·sinθ
// 入力: 格子面の間隔 d [mm]、波長 lam [mm]、反射の次数 n（1, 2, 3 …の整数）
// θ は「格子面」と入射光のなす角（ブラッグ角）[°]。面の法線からの角度ではない点に注意。

// ブラッグ角 θ [°]。sinθ > 1 でその次数の反射が起きないときは NaN
export function braggAngle(d, lam, n) {
  const s = (n * lam) / (2 * d);
  if (s > 1) return NaN;
  return Math.asin(s) * R2D;
}

// 反射が起きる最大の次数 nmax = floor(2d/λ)（sinθ ≤ 1 の条件から）
export function maxOrder(d, lam) {
  return Math.floor((2 * d) / lam + 1e-12);
}

// ブラッグ角 θ [°] から格子面の間隔 d = n·λ / (2·sinθ) [mm] を求める
export function spacingFromAngle(thDeg, lam, n) {
  return (n * lam) / (2 * Math.sin(thDeg * D2R));
}
