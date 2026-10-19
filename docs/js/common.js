// 各ページ共通の画面ヘルパー
export const $ = (id) => document.getElementById(id);
export const num = (id) => parseFloat($(id).value);
export const fmt = (x, d = 3) => (Number.isFinite(x) ? x.toFixed(d) : "—");
export const valid = (...xs) => xs.every(Number.isFinite);

// 結果欄を描画する。items: [ラベル, 値, 注意表示か]
export function cells(el, items) {
  el.innerHTML = items
    .map(([k, v, na]) => `<div class="r"><span class="k">${k}</span><span class="v${na ? " na" : ""}">${v}</span></div>`)
    .join("");
}

// 検証表を描画する。cases は docs/js/cases/*.cases.js の配列
export function renderCases(tbody, cases) {
  tbody.innerHTML = cases
    .map((c) => {
      const v = c.actual();
      const ok = Math.abs(v - c.expected) <= c.tol;
      return `<tr><td>${c.name}</td><td class="num">${c.expected} ${c.unit}</td><td class="num">${v.toFixed(4)} ${c.unit}</td><td class="${ok ? "ok" : "ng"}">${ok ? "一致" : "不一致"}</td></tr>`;
    })
    .join("");
}
