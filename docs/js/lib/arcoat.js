// 単層の反射防止膜（垂直入射、吸収なし）
// 入射側の屈折率 n0、膜の屈折率 n1、基板の屈折率 ns、膜厚 d [mm]、波長 lam [mm]
// 波長も「長さ」なので mm で扱う（例：550 nm = 0.00055 mm）

// 反射率 R（0〜1 の比）
// 境界の振幅反射率 r01 = (n0−n1)/(n0+n1), r12 = (n1−ns)/(n1+ns)
// 膜を1回通る位相 δ = 2π·n1·d/λ として
// R = (r01² + r12² + 2·r01·r12·cos2δ) / (1 + r01²·r12² + 2·r01·r12·cos2δ)
export function arReflectance(n0, n1, ns, d, lam) {
  const r01 = (n0 - n1) / (n0 + n1);
  const r12 = (n1 - ns) / (n1 + ns);
  const c = Math.cos((4 * Math.PI * n1 * d) / lam);
  return (r01 * r01 + r12 * r12 + 2 * r01 * r12 * c) / (1 + r01 * r01 * r12 * r12 + 2 * r01 * r12 * c);
}

// 反射が0になる理想的な膜の屈折率 n1 = √(n0·ns)
export function optimalIndex(n0, ns) {
  return Math.sqrt(n0 * ns);
}

// 4分の1波長膜の膜厚 d = λ/(4·n1)  [mm]
export function quarterWaveThickness(n1, lam) {
  return lam / (4 * n1);
}
