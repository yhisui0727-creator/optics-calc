import { lever } from "../lib/lever.js";

// 期待値は d = L·tan(2Δφ) を電卓で計算した値
export const cases = [
  { name: "傾き0.01°・L=1000mm の光点移動", expected: 0.3491, tol: 1e-3, unit: "mm", actual: () => lever(0.01, 1000).d },
  { name: "傾き0.5°・L=500mm の光点移動", expected: 8.7275, tol: 1e-3, unit: "mm", actual: () => lever(0.5, 500).d },
  { name: "傾き0.1°・L=2000mm の光点移動", expected: 6.9813, tol: 1e-3, unit: "mm", actual: () => lever(0.1, 2000).d },
  { name: "傾き0.25°の反射光の振れ角", expected: 0.5, tol: 1e-12, unit: "°", actual: () => lever(0.25, 1).dev },
];
