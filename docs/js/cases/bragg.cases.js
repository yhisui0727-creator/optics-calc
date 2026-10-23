// 検証ケース（教科書・公知の値）。テストとページの検証表の両方がこれを使う。
import { braggAngle, maxOrder, spacingFromAngle } from "../lib/bragg.js";

// 期待値の出典
// ・d = λ、1次：sinθ = 1/2 → 30°（公知の値 sin30° = 1/2）
// ・λ = √2·d、1次：sinθ = √2/2 → 45°（sin45° = 1/√2）
// ・d = λ、2次：sinθ = 1 → 90°（光が真っすぐ戻る）
// ・d = λ のとき反射できる最大次数は 2d/λ = 2 → 2次まで
// ・θ = 30°・λ = 0.0001 mm・1次：d = λ/(2×1/2) = λ = 0.0001 mm（手計算）
// ・シリコン (111) 面を Cu Kα 線（λ = 0.15406 nm）で測ると 2θ ≈ 28.44°（X線回折の標準データとして公知）
//   格子定数 a = 0.5431 nm、(111) 面の間隔 d = a/√3
const SI_D = 0.0000005431 / Math.sqrt(3); // [mm]
const CU_KA = 0.00000015406; // [mm]
export const cases = [
  { name: "d = λ・1次のブラッグ角", expected: 30, tol: 1e-9, unit: "°", actual: () => braggAngle(0.0001, 0.0001, 1) },
  { name: "λ = √2·d・1次のブラッグ角", expected: 45, tol: 1e-9, unit: "°", actual: () => braggAngle(0.0001, 0.0001 * Math.SQRT2, 1) },
  { name: "d = λ・2次のブラッグ角", expected: 90, tol: 1e-9, unit: "°", actual: () => braggAngle(0.0001, 0.0001, 2) },
  { name: "d = λ のときの最大次数", expected: 2, tol: 0, unit: "", actual: () => maxOrder(0.0001, 0.0001) },
  { name: "θ = 30°・λ = 0.0001 mm・1次から格子面の間隔", expected: 0.0001, tol: 1e-15, unit: "mm", actual: () => spacingFromAngle(30, 0.0001, 1) },
  { name: "Si (111) 面・Cu Kα 線の回折角 2θ", expected: 28.44, tol: 0.01, unit: "°", actual: () => 2 * braggAngle(SI_D, CU_KA, 1) },
];
