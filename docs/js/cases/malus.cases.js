// 検証ケース（教科書・公知の値）。テストとページの検証表の両方がこれを使う。
import { malus } from "../lib/malus.js";

// 期待値は cos の公知の値から手計算：cos0°=1, cos30°=√3/2, cos45°=1/√2, cos60°=1/2, cos90°=0
export const cases = [
  { name: "I₀=100・θ=0°（軸が平行）", expected: 100, tol: 1e-9, unit: "", actual: () => malus(100, 0).I },
  { name: "I₀=100・θ=30°（cos²30°=3/4）", expected: 75, tol: 1e-9, unit: "", actual: () => malus(100, 30).I },
  { name: "I₀=100・θ=45°（cos²45°=1/2）", expected: 50, tol: 1e-9, unit: "", actual: () => malus(100, 45).I },
  { name: "I₀=100・θ=60°（cos²60°=1/4）", expected: 25, tol: 1e-9, unit: "", actual: () => malus(100, 60).I },
  { name: "I₀=100・θ=90°（直交ニコル）", expected: 0, tol: 1e-9, unit: "", actual: () => malus(100, 90).I },
  // 教科書の定番問題：無偏光 I₀ を 0°・45°・90° の3枚に通すと I₀/8（1枚目で I₀/2、残り2枚で各 1/2）
  { name: "無偏光100を3枚の偏光板（0°・45°・90°）に通す", expected: 12.5, tol: 1e-9, unit: "", actual: () => malus(malus(100 / 2, 45).I, 45).I },
];
