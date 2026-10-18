import assert from "node:assert/strict";
import test from "node:test";
import { createFretboard, scaleMembership, TUNING } from "../src/fretboard.js";

test("builds mirror-order standard tuning through fret 24", () => {
  const board = createFretboard();
  assert.deepEqual(board.map((string) => string.openPitch), ["E2", "A2", "D3", "G3", "B3", "E4"]);
  assert.deepEqual(board.map((string) => string.label), ["E", "A", "D", "G", "B", "e"]);
  assert.ok(board.every((string) => string.frets.length === 25));
});

test("frets 12 and 24 are exactly one and two octaves above open", () => {
  const board = createFretboard();
  for (const string of board) {
    assert.equal(string.frets[12].midi, string.openMidi + 12);
    assert.equal(string.frets[24].midi, string.openMidi + 24);
    assert.equal(string.frets[12].name, string.frets[0].name);
    assert.equal(string.frets[24].name, string.frets[0].name);
  }
});

test("natural minor highlights Eb while Dorian highlights E", () => {
  assert.equal(scaleMembership("Eb", "naturalMinor"), true);
  assert.equal(scaleMembership("E", "naturalMinor"), false);
  assert.equal(scaleMembership("E", "dorian"), true);
  assert.equal(scaleMembership("Eb", "dorian"), false);
  assert.ok(TUNING.every((string) => Number.isInteger(string.openMidi)));
});
