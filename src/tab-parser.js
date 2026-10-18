const STANDARD_ORDER = ["e", "B", "G", "D", "A", "E"];
const MIRROR_ORDER = ["E", "A", "D", "G", "B", "e"];
const TECHNIQUE_SYMBOLS = { h: "hammer-on", p: "pull-off", b: "bend", r: "release", "/": "slide-up", "\\": "slide-down", "~": "vibrato" };

function normalizeLines(input) {
  return input.replaceAll("\r\n", "\n").split("\n").map((line) => line.trimEnd()).filter((line) => line.trim() && !line.trimStart().startsWith("#"));
}

function tabRowsFromMarkdown(input) {
  return input.replaceAll("\r\n", "\n").split("\n").map((line) => line.trimEnd()).filter((line) => /^\s*[eEBGDA]\s*\|/.test(line));
}

function parseLine(line, lineNumber) {
  const match = line.match(/^\s*([eEBGDA])\s*\|([^|]*)\|?\s*$/);
  if (!match) throw new Error(`Line ${lineNumber} is not a valid tab row.`);
  return { label: match[1], content: match[2] };
}

function parseEvents(row, stringNumber) {
  const events = [];
  let cursor = 0;
  while (cursor < row.content.length) {
    if (!/\d/.test(row.content[cursor])) {
      cursor += 1;
      continue;
    }

    const start = cursor;
    while (/\d/.test(row.content[cursor] ?? "")) cursor += 1;
    const fretText = row.content.slice(start, cursor);
    const fret = Number(fretText);
    if (fret > 24) throw new Error(`${row.label} string contains fret ${fret}; supported range is 0–24.`);
    const techniques = [];

    while (row.content[cursor] in TECHNIQUE_SYMBOLS) {
      const symbol = row.content[cursor];
      if (symbol === "~") {
        const techniqueStart = cursor;
        while (row.content[cursor] === "~") cursor += 1;
        techniques.push({ type: "vibrato", symbol: row.content.slice(techniqueStart, cursor), startColumn: techniqueStart, endColumn: cursor - 1, targetFret: null });
      } else {
        const techniqueStart = cursor;
        cursor += 1;
        const targetStart = cursor;
        while (/\d/.test(row.content[cursor] ?? "")) cursor += 1;
        const targetText = row.content.slice(targetStart, cursor);
        techniques.push({ type: TECHNIQUE_SYMBOLS[symbol], symbol, startColumn: techniqueStart, endColumn: Math.max(techniqueStart, cursor - 1), targetFret: targetText ? Number(targetText) : null });
      }
    }

    events.push({ kind: "note", string: stringNumber, column: start, length: fretText.length, fret, techniques });
  }
  return events;
}

function parseBlock(lines, blockIndex) {
  if (lines.length !== 6) throw new Error(`Tab block ${blockIndex + 1} has ${lines.length} rows; exactly 6 are required.`);
  const rows = lines.map((line, index) => parseLine(line, blockIndex * 6 + index + 1));
  const labels = rows.map((row) => row.label);
  if (labels.join(",") !== STANDARD_ORDER.join(",")) {
    throw new Error(`Tab block ${blockIndex + 1} must use standard input order: ${STANDARD_ORDER.join(", ")}. Received: ${labels.join(", ")}.`);
  }
  const width = Math.max(...rows.map((row) => row.content.length));
  const paddedRows = rows.map((row, index) => ({ ...row, string: index + 1, content: row.content.padEnd(width, "-") }));
  return { number: blockIndex + 1, width, rows: paddedRows, events: paddedRows.flatMap((row) => parseEvents(row, row.string)) };
}

export function parseAsciiTab(input) {
  if (typeof input !== "string" || !input.trim()) throw new Error("Paste at least one six-row ASCII tab block.");
  const lines = normalizeLines(input);
  if (lines.length % 6 !== 0) throw new Error(`Found ${lines.length} tab rows; the total must be a multiple of 6.`);
  const blocks = [];
  for (let index = 0; index < lines.length; index += 6) blocks.push(parseBlock(lines.slice(index, index + 6), index / 6));
  return { inputOrder: STANDARD_ORDER, displayOrder: MIRROR_ORDER, blocks };
}

export function parseMirrorTab(input) {
  if (typeof input !== "string" || !input.trim()) throw new Error("The mirror-tab source is empty.");
  const lines = tabRowsFromMarkdown(input);
  if (!lines.length || lines.length % 6 !== 0) throw new Error(`Found ${lines.length} mirror-tab rows; the total must be a non-zero multiple of 6.`);

  const blocks = [];
  for (let index = 0; index < lines.length; index += 6) {
    const rows = lines.slice(index, index + 6).map((line, rowIndex) => parseLine(line, index + rowIndex + 1));
    const labels = rows.map((row) => row.label);
    if (labels.join(",") !== MIRROR_ORDER.join(",")) {
      throw new Error(`Mirror block ${index / 6 + 1} must use right-handed mirror order: ${MIRROR_ORDER.join(", ")}. Received: ${labels.join(", ")}.`);
    }
    const width = Math.max(...rows.map((row) => row.content.length));
    const numberedRows = rows.map((row, rowIndex) => ({ ...row, string: 6 - rowIndex, content: row.content.padEnd(width, "-") }));
    blocks.push({ number: index / 6 + 1, width, rows: numberedRows, events: numberedRows.flatMap((row) => parseEvents(row, row.string)) });
  }
  return { inputOrder: MIRROR_ORDER, displayOrder: MIRROR_ORDER, blocks };
}

export function renderMirrorTab(document) {
  return document.blocks.map((block) => {
    const byString = new Map(block.rows.map((row) => [row.string, row]));
    return [6, 5, 4, 3, 2, 1].map((stringNumber) => {
      const row = byString.get(stringNumber);
      return `${row.label}|${row.content}|`;
    }).join("\n");
  }).join("\n\n");
}

export { MIRROR_ORDER, STANDARD_ORDER };
