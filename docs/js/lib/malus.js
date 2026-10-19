import { D2R } from "./units.js";

// マルスの法則：直線偏光が偏光板を通ると I = I₀·cos²θ になる。
// 入力: 入射光の強度 I0（単位は任意。出力も同じ単位）、偏光方向と偏光板の透過軸のなす角 thDeg [°]
// 出力: { I 透過光の強度（I0 と同じ単位）, ratio 透過率 I/I₀（0〜1 の比） }
export function malus(I0, thDeg) {
  const c = Math.cos(thDeg * D2R);
  const ratio = c * c;
  return { I: I0 * ratio, ratio };
}
