// 検証ケース（教科書・公知の値）。テストとページの検証表の両方がこれを使う。
import { arReflectance, optimalIndex, quarterWaveThickness } from "../lib/arcoat.js";

const LAM = 0.00055; // 波長 550 nm = 0.00055 mm

// 期待値の出典
// ・最適屈折率 √(n0·ns)、4分の1波長膜 d = λ/(4n1)：光学の教科書の単層反射防止膜の条件。電卓で計算。
// ・4分の1波長膜の反射率は教科書の簡単な式 R = ((n0·ns − n1²)/(n0·ns + n1²))² で電卓計算
//   （計算機は一般式を使うので、別の式での照合になる）。
//   MgF₂（n=1.38）をガラス（n=1.52）に付けた場合 約1.26% は教科書によく出る値。
// ・膜なし（d=0）・半波長膜は、むき出しのガラスの反射率 ((n0−ns)/(n0+ns))² と同じになる（公知）。
export const cases = [
  { name: "最適屈折率（空気 n0=1・ガラス ns=1.5）√1.5", expected: 1.224744871, tol: 1e-8, unit: "", actual: () => optimalIndex(1, 1.5) },
  { name: "4分の1波長膜の膜厚（n1=1.38・λ=0.00055 mm）", expected: 0.0000996376812, tol: 1e-12, unit: "mm", actual: () => quarterWaveThickness(1.38, LAM) },
  { name: "MgF₂ 4分の1波長膜（n1=1.38・ns=1.52）の反射率", expected: 1.26008, tol: 1e-4, unit: "%", actual: () => 100 * arReflectance(1, 1.38, 1.52, quarterWaveThickness(1.38, LAM), LAM) },
  { name: "理想膜（n1=√1.52）の4分の1波長膜は反射0", expected: 0, tol: 1e-9, unit: "%", actual: () => { const n1 = optimalIndex(1, 1.52); return 100 * arReflectance(1, n1, 1.52, quarterWaveThickness(n1, LAM), LAM); } },
  { name: "膜なし（d=0）ガラス ns=1.5 の反射率 4%", expected: 4, tol: 1e-9, unit: "%", actual: () => 100 * arReflectance(1, 1.38, 1.5, 0, LAM) },
  { name: "半波長膜（n1=1.38・ns=1.52）はガラスのみと同じ 4.258%", expected: 4.25800, tol: 1e-4, unit: "%", actual: () => 100 * arReflectance(1, 1.38, 1.52, LAM / (2 * 1.38), LAM) },
];
