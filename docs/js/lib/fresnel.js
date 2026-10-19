import { D2R, R2D } from "./units.js";

// フレネル反射率（誘電体界面、吸収なし）
// 入力: 屈折率 n1, n2、入射角 thDeg [°]
// 出力: { Rs, Rp, R (無偏光 = (Rs+Rp)/2), tir }  反射率は 0〜1 の比
export function fresnel(n1, n2, thDeg) {
  const ti = thDeg * D2R;
  const s = (n1 / n2) * Math.sin(ti);
  if (s >= 1) return { Rs: 1, Rp: 1, R: 1, tir: true };
  const ci = Math.cos(ti);
  const ct = Math.sqrt(1 - s * s);
  const rs = (n1 * ci - n2 * ct) / (n1 * ci + n2 * ct);
  const rp = (n2 * ci - n1 * ct) / (n2 * ci + n1 * ct);
  const Rs = rs * rs;
  const Rp = rp * rp;
  return { Rs, Rp, R: (Rs + Rp) / 2, tir: false };
}

// ブリュースター角 θB = arctan(n2 / n1)  [°]
export function brewster(n1, n2) {
  return Math.atan(n2 / n1) * R2D;
}
