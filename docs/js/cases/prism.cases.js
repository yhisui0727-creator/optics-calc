// 検証ケース（教科書・公知の値）。テストとページの検証表の両方がこれを使う。
import { minDeviation, minDeviationIncidence, indexFromMinDeviation, deviation } from "../lib/prism.js";

// 期待値の出典
// ・n=√2, √3 の頂角60°プリズム：sin30°=1/2 から n·sin30° = 1/√2, √3/2 となり、
//   arcsin がそれぞれ 45°, 60° になる（公知の値）。δmin = 2×45°−60° = 30°、2×60°−60° = 60°。
// ・n=1.5・頂角60°：δmin = 2·arcsin(0.75) − 60°。arcsin(0.75) = 48.5903779°（電卓）なので 37.1807558°。
//   教科書の定番例「ガラスの正三角形プリズムで約37°」。
// ・最小偏角法：A=60°, δmin=30° → n = sin45°/sin30° = √2 = 1.41421356（公知）。
// ・頂角が小さいプリズムの近似 δ ≈ (n−1)·A（教科書）：A=1°, n=1.5 → 0.5°。
// ・最小偏角のとき光路は左右対称なので、その入射角で入れた光の偏角は δmin と同じになる。
export const cases = [
  { name: "頂角60°・n=√2 の最小偏角", expected: 30, tol: 1e-9, unit: "°", actual: () => minDeviation(60, Math.SQRT2) },
  { name: "頂角60°・n=√3 の最小偏角", expected: 60, tol: 1e-9, unit: "°", actual: () => minDeviation(60, Math.sqrt(3)) },
  { name: "頂角60°・n=1.5 の最小偏角", expected: 37.1807558, tol: 1e-6, unit: "°", actual: () => minDeviation(60, 1.5) },
  { name: "最小偏角法：頂角60°・δmin=30° から屈折率 √2", expected: 1.41421356, tol: 1e-8, unit: "", actual: () => indexFromMinDeviation(60, 30) },
  { name: "薄いプリズム（頂角1°・n=1.5）δ ≈ (n−1)A = 0.5°", expected: 0.5, tol: 1e-4, unit: "°", actual: () => minDeviation(1, 1.5) },
  { name: "頂角60°・n=√2、入射角45°（最小偏角の条件）での偏角", expected: 30, tol: 1e-9, unit: "°", actual: () => deviation(60, Math.SQRT2, minDeviationIncidence(60, Math.SQRT2)) },
];
