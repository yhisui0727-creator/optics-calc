// 実行: npm test   （全計算機の検証ケースを自動で確認する）
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "docs", "js", "cases");
const files = readdirSync(dir).filter((f) => f.endsWith(".cases.js"));

test("検証ケースファイルが存在する", () => assert.ok(files.length > 0));

for (const f of files) {
  const { cases } = await import(pathToFileURL(path.join(dir, f)).href);
  test(`${f}: 検証ケースは3つ以上`, () => assert.ok(cases.length >= 3));
  for (const c of cases) {
    test(`${f}: ${c.name}`, () => {
      const v = c.actual();
      assert.ok(Number.isFinite(v), `計算値が数値ではありません: ${v}`);
      assert.ok(Math.abs(v - c.expected) <= c.tol, `期待 ${c.expected}${c.unit} / 計算 ${v}${c.unit} / 許容 ±${c.tol}`);
    });
  }
}
