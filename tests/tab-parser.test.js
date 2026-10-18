import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { parseAsciiTab, parseMirrorTab, renderMirrorTab } from "../src/tab-parser.js";

const TAB = `e|--5h7--7p5--8b10r8--7/10--10\\7--5~~~----|
B|----------------------------------------|
G|-----------7----------------------------|
D|-----------7----------------------------|
A|----------------------------------------|
E|--3-------------------------------------|`;

test("parses all six standard-order strings and technique markers", () => {
  const parsed = parseAsciiTab(TAB);
  assert.equal(parsed.blocks.length, 1);
  assert.equal(parsed.blocks[0].rows.length, 6);
  const techniques = new Set(parsed.blocks[0].events.flatMap((event) => event.techniques.map((technique) => technique.type)));
  assert.deepEqual(techniques, new Set(["hammer-on", "pull-off", "bend", "release", "slide-up", "slide-down", "vibrato"]));
  assert.equal(parsed.blocks[0].events.filter((event) => event.string === 1).length, 6);
  assert.deepEqual(parsed.blocks[0].events.find((event) => event.fret === 8).techniques.map((technique) => technique.type), ["bend", "release"]);
});

test("renders the exact right-handed mirror row order", () => {
  const lines = renderMirrorTab(parseAsciiTab(TAB)).split("\n");
  assert.deepEqual(lines.map((line) => line.slice(0, 2)), ["E|", "A|", "D|", "G|", "B|", "e|"]);
  assert.match(lines[0], /--3/);
  assert.match(lines[5], /5h7/);
});

test("preserves aligned character columns when rows have unequal input lengths", () => {
  const parsed = parseAsciiTab(`e|--5-|
B|----|
G|----|
D|----|
A|----|
E|--3---|`);
  assert.ok(parsed.blocks[0].rows.every((row) => row.content.length === 6));
});

test("reports malformed row counts and ordering", () => {
  assert.throws(() => parseAsciiTab("e|---|"), /multiple of 6/);
  assert.throws(() => parseAsciiTab(`E|---|\nA|---|\nD|---|\nG|---|\nB|---|\ne|---|`), /standard input order/);
});

test("loads all user-supplied vocal blocks in right-handed mirror order", async () => {
  const markdown = await readFile(new URL("../great_gig_vocal_mirror_tabs.md", import.meta.url), "utf8");
  const parsed = parseMirrorTab(markdown);
  assert.equal(parsed.blocks.length, 12);
  for (const block of parsed.blocks) {
    assert.deepEqual(block.rows.map((row) => row.label), ["E", "A", "D", "G", "B", "e"]);
    assert.ok(block.rows.every((row) => row.content.length === block.width));
  }
});
