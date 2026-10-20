import { D2R, R2D } from "./units.js";

// プリズムの最小偏角（プリズムのまわりは空気 n=1 とする）
// 入力: 頂角 aDeg [°]、プリズムの屈折率 n
// 出力: 最小偏角 δmin [°]。光が通り抜けられない（n·sin(A/2) > 1）ときは NaN
// 式: n = sin((A+δmin)/2) / sin(A/2)  →  δmin = 2·arcsin(n·sin(A/2)) − A
export function minDeviation(aDeg, n) {
  const s = n * Math.sin((aDeg / 2) * D2R);
  if (s > 1) return NaN;
  return 2 * Math.asin(s) * R2D - aDeg;
}

// 最小偏角のときの入射角 θ = (A+δmin)/2  [°]（光はプリズムの中を底面と平行に進む）
export function minDeviationIncidence(aDeg, n) {
  return (aDeg + minDeviation(aDeg, n)) / 2;
}

// 頂角 aDeg [°] と測った最小偏角 dDeg [°] から屈折率を求める（最小偏角法）
export function indexFromMinDeviation(aDeg, dDeg) {
  return Math.sin(((aDeg + dDeg) / 2) * D2R) / Math.sin((aDeg / 2) * D2R);
}

// 入射角 thDeg [°] での偏角 δ = θ1 + θ2 − A  [°]
// 出口の面で全反射して出てこないときは NaN
export function deviation(aDeg, n, thDeg) {
  const r1 = Math.asin(Math.sin(thDeg * D2R) / n) * R2D; // 入口の屈折角
  const r2 = aDeg - r1; // 出口の面への入射角（プリズムの中）
  const s = n * Math.sin(r2 * D2R);
  if (Math.abs(s) > 1) return NaN;
  return thDeg + Math.asin(s) * R2D - aDeg;
}
