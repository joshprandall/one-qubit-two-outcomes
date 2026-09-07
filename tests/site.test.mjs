import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("required source files exist", () => {
  for (const file of ["index.html", "styles.css", "app.js", "qubit.js", "README.md"]) {
    assert.ok(fs.existsSync(path.join(root, file)), `missing ${file}`);
  }
});

test("page has language, viewport, main landmark, and skip link", () => {
  assert.match(html, /<html[^>]+lang=["']en["']/i);
  assert.match(html, /<meta[^>]+name=["']viewport["']/i);
  assert.match(html, /<main[^>]+id=["']main["']/i);
  assert.match(html, /class=["'][^"']*\bskip\b[^"']*["'][^>]+href=["']#main["']/i);
});

test("element IDs are unique", () => {
  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
});

test("all local hash links resolve", () => {
  const ids = new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map(m => m[1]));
  const targets = [...html.matchAll(/href=["']#([^"']+)["']/g)].map(m => m[1]);
  for (const target of targets) assert.ok(ids.has(target), `missing #${target}`);
});

test("new-tab links use noopener noreferrer", () => {
  const anchors = [...html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)].map(m => m[0]);
  for (const anchor of anchors) {
    assert.match(anchor, /rel=["'][^"']*noopener[^"']*noreferrer[^"']*["']/i);
  }
});

test("reduced-motion support is present", () => {
  assert.match(css, /prefers-reduced-motion/);
});
