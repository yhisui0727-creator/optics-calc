import { fresnel, brewster } from "../lib/fresnel.js";

export const cases = [
  { name: "空気→ガラス(n=1.5) 垂直入射 R", expected: 4.0, tol: 0.01, unit: "%", actual: () => fresnel(1, 1.5, 0).R * 100 },
  { name: "空気→ガラス(n=1.517) 垂直入射 R", expected: 4.22, tol: 0.01, unit: "%", actual: () => fresnel(1, 1.517, 0).R * 100 },
  { name: "空気→ガラス(n=1.5) ブリュースター角", expected: 56.31, tol: 0.01, unit: "°", actual: () => brewster(1, 1.5) },
  { name: "ブリュースター角での Rp", expected: 0, tol: 1e-6, unit: "%", actual: () => fresnel(1, 1.5, brewster(1, 1.5)).Rp * 100 },
  { name: "全反射域(ガラス→空気 60°)の R", expected: 100, tol: 1e-9, unit: "%", actual: () => fresnel(1.5, 1, 60).R * 100 },
];
