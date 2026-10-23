// 検証ケース（教科書・公知の値）。テストとページの検証表の両方がこれを使う。
import { rayleighLength, divergence, gaussianBeam } from "../lib/gaussian.js";

const LAM = 0.000633; // He-Ne レーザーの波長 633 nm = 0.000633 mm
const W0 = 0.5; // ビームウェスト半径 0.5 mm

// 期待値の出典
// ・レイリー長 zR = π·w0²/λ = π×0.25/0.000633 = 1240.7554 mm（電卓）
// ・z = zR でビーム半径は √2 倍（レイリー長の定義、教科書）：0.5×√2 = 0.70710678 mm
// ・波面の曲率半径は z = zR で最小になり、その値は 2·zR（教科書の公知の性質）= 2481.5108 mm
// ・z = √3·zR では w = w0·√(1+3) = 2·w0 = 1 mm（手計算）
// ・広がり角 θ = λ/(π·w0) = 0.000633/(π×0.5) = 0.00040298 rad = 0.023089°（電卓、小角なので arctan ≈ そのまま）
// ・ウェスト（z = 0）ではビーム半径は w0 そのもの
export const cases = [
  { name: "He-Ne（λ=0.000633 mm）・w0=0.5 mm のレイリー長", expected: 1240.7554, tol: 1e-3, unit: "mm", actual: () => rayleighLength(LAM, W0) },
  { name: "z = zR でのビーム半径（w0 の √2 倍）", expected: 0.70710678, tol: 1e-8, unit: "mm", actual: () => gaussianBeam(LAM, W0, rayleighLength(LAM, W0)).w },
  { name: "z = zR での波面の曲率半径（最小値 2zR）", expected: 2481.5108, tol: 1e-3, unit: "mm", actual: () => gaussianBeam(LAM, W0, rayleighLength(LAM, W0)).R },
  { name: "z = √3·zR でのビーム半径（w0 の2倍）", expected: 1, tol: 1e-9, unit: "mm", actual: () => gaussianBeam(LAM, W0, Math.sqrt(3) * rayleighLength(LAM, W0)).w },
  { name: "広がり角（半角）", expected: 0.023089, tol: 1e-6, unit: "°", actual: () => divergence(LAM, W0) },
  { name: "ウェスト（z = 0）でのビーム半径", expected: 0.5, tol: 1e-12, unit: "mm", actual: () => gaussianBeam(LAM, W0, 0).w },
];
