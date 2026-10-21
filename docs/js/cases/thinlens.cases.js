// 検証ケース（教科書・公知の値）。テストとページの検証表の両方がこれを使う。
import { thinLens } from "../lib/thinlens.js";

// 期待値は 1/a + 1/b = 1/f と m = −b/a から手計算（教科書の定番の例）
// ・a = 2f に物体を置くと、b = 2f に同じ大きさの倒立実像ができる：1/b = 1/100 − 1/200 = 1/200
// ・f=100, a=300：1/b = 1/100 − 1/300 = 2/300 → b = 150、m = −150/300 = −0.5
// ・焦点の内側（虫めがね）f=100, a=50：1/b = 1/100 − 1/50 = −1/100 → b = −100（虚像）、m = 2（正立で2倍）
// ・凹レンズ f=−100, a=100：1/b = −1/100 − 1/100 = −2/100 → b = −50（虚像）、m = 0.5
export const cases = [
  { name: "f=100 mm・a=200 mm（2f の位置）の像の位置", expected: 200, tol: 1e-9, unit: "mm", actual: () => thinLens(100, 200).b },
  { name: "f=100 mm・a=200 mm の倍率（等倍の倒立像）", expected: -1, tol: 1e-12, unit: "", actual: () => thinLens(100, 200).m },
  { name: "f=100 mm・a=300 mm の像の位置", expected: 150, tol: 1e-9, unit: "mm", actual: () => thinLens(100, 300).b },
  { name: "f=100 mm・a=300 mm の倍率", expected: -0.5, tol: 1e-12, unit: "", actual: () => thinLens(100, 300).m },
  { name: "虫めがね f=100 mm・a=50 mm の像の位置（虚像）", expected: -100, tol: 1e-9, unit: "mm", actual: () => thinLens(100, 50).b },
  { name: "虫めがね f=100 mm・a=50 mm の倍率（正立2倍）", expected: 2, tol: 1e-12, unit: "", actual: () => thinLens(100, 50).m },
  { name: "凹レンズ f=−100 mm・a=100 mm の像の位置", expected: -50, tol: 1e-9, unit: "mm", actual: () => thinLens(-100, 100).b },
  { name: "凹レンズ f=−100 mm・a=100 mm の倍率", expected: 0.5, tol: 1e-12, unit: "", actual: () => thinLens(-100, 100).m },
];
