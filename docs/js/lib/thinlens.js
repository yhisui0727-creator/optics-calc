// 薄レンズの公式  1/a + 1/b = 1/f
// 入力: 焦点距離 f [mm]（凸レンズは正、凹レンズは負）、物体からレンズまでの距離 a [mm]（正）
// 出力: { b 像の位置 [mm], m 横倍率, real 実像か, inf 像が無限遠か }
//   b > 0：レンズの後ろにできる実像（スクリーンに映る）
//   b < 0：レンズの前にできる虚像（レンズをのぞくと見える）
//   m = −b/a：負なら倒立（上下逆）、正なら正立。|m| が像の大きさの倍率
export function thinLens(f, a) {
  if (a === f) return { b: Infinity, m: Infinity, real: false, inf: true };
  const b = (a * f) / (a - f);
  return { b, m: -b / a, real: b > 0, inf: false };
}
