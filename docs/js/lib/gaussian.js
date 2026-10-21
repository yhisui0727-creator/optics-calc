import { R2D } from "./units.js";

// ガウシアンビーム（レーザー光）の広がり。空気中（屈折率1）とする。
// 入力: 波長 lam [mm]、ビームウェスト半径 w0 [mm]（一番細いところの半径）、ウェストからの距離 z [mm]
// ビーム半径は強度が中心の 1/e²（約13.5%）になる半径。

// レイリー長 zR = π·w0²/λ  [mm]（ビームの太さが √2 倍になる距離）
export function rayleighLength(lam, w0) {
  return (Math.PI * w0 * w0) / lam;
}

// 広がり角（半角）θ = arctan(λ/(π·w0))  [°]
export function divergence(lam, w0) {
  return Math.atan(lam / (Math.PI * w0)) * R2D;
}

// 距離 z でのビーム半径 w(z) [mm] と波面の曲率半径 R(z) [mm]
// w(z) = w0·√(1 + (z/zR)²)、 R(z) = z·(1 + (zR/z)²)（z = 0 では平面波なので R = ∞）
export function gaussianBeam(lam, w0, z) {
  const zR = rayleighLength(lam, w0);
  const w = w0 * Math.sqrt(1 + (z / zR) ** 2);
  const R = z === 0 ? Infinity : z * (1 + (zR / z) ** 2);
  return { zR, w, R };
}
