import { D2R } from "./units.js";

// 光てこ：鏡が phiDeg [°] 傾くと反射光は 2·phiDeg [°] 振れる。
// 入力: 鏡の傾き phiDeg [°]、鏡からスクリーンまでの距離 L [mm]
// 出力: { dev [°] 振れ角, d [mm] 光点の移動量 }
export function lever(phiDeg, L) {
  const dev = 2 * phiDeg;
  return { dev, d: L * Math.tan(dev * D2R) };
}
