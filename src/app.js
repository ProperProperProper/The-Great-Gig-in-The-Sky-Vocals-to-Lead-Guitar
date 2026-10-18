import { parseAsciiTab, parseMirrorTab, renderMirrorTab } from "./tab-parser.js";
import { createFretboard, scaleMembership } from "./fretboard.js";

const tabInput = document.querySelector("#tab-input");
const tabOutput = document.querySelector("#tab-output");
const status = document.querySelector("#parse-status");
const form = document.querySelector("#tab-form");
const loadProjectTab = document.querySelector("#load-project-tab");
const fretboard = document.querySelector("#fretboard");
const scaleMode = document.querySelector("#scale-mode");
const showNotes = document.querySelector("#show-notes");
const scaleDescription = document.querySelector("#scale-description");

function render() {
  try {
    const parsed = parseAsciiTab(tabInput.value);
    tabOutput.textContent = renderMirrorTab(parsed);
    const notes = parsed.blocks.reduce((total, block) => total + block.events.length, 0);
    status.textContent = `${parsed.blocks.length} block${parsed.blocks.length === 1 ? "" : "s"} · ${notes} note events · mirror view ready`;
    status.dataset.state = "success";
  } catch (error) {
    tabOutput.textContent = "Fix the input to generate mirror-view tab.";
    status.textContent = error.message;
    status.dataset.state = "error";
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
});

async function renderProjectTab() {
  try {
    status.textContent = "Loading project vocal tab…";
    const response = await fetch("great_gig_vocal_mirror_tabs.md");
    if (!response.ok) throw new Error(`Could not load the project tab (${response.status}).`);
    const parsed = parseMirrorTab(await response.text());
    tabOutput.textContent = renderMirrorTab(parsed);
    const notes = parsed.blocks.reduce((total, block) => total + block.events.length, 0);
    status.textContent = `${parsed.blocks.length} vocal blocks · ${notes} lead events · E A D G B e mirror view`;
    status.dataset.state = "success";
  } catch (error) {
    status.textContent = error.message;
    status.dataset.state = "error";
    render();
  }
}

loadProjectTab.addEventListener("click", renderProjectTab);
renderProjectTab();

const scaleCopy = {
  dorian: "G Dorian · G A Bb C D E F · major sixth (E)",
  naturalMinor: "G natural minor · G A Bb C D Eb F · minor sixth (Eb)",
  chromatic: "Chromatic · all twelve pitch classes"
};

function renderFretboard() {
  const board = createFretboard();
  const mode = scaleMode.value;
  const fragment = document.createDocumentFragment();

  const corner = document.createElement("div");
  corner.className = "fret-heading string-heading";
  corner.textContent = "String";
  fragment.append(corner);
  for (let fret = 0; fret <= 24; fret += 1) {
    const heading = document.createElement("div");
    heading.className = "fret-heading";
    heading.textContent = fret;
    heading.setAttribute("role", "columnheader");
    fragment.append(heading);
  }

  for (const string of board) {
    const label = document.createElement("div");
    label.className = "string-label";
    label.textContent = string.string === 6 ? "Low E" : string.string === 1 ? "High e" : string.label;
    label.setAttribute("role", "rowheader");
    fragment.append(label);

    for (const pitch of string.frets) {
      const cell = document.createElement("div");
      const inScale = scaleMembership(pitch.name, mode);
      const isRoot = pitch.name === "G";
      cell.className = `fret-cell${inScale ? " in-scale" : " outside-scale"}${isRoot ? " root-note" : ""}${showNotes.checked ? "" : " hide-name"}`;
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `${string.openPitch} string, fret ${pitch.fret}: ${pitch.name}${pitch.octave}${isRoot ? ", G root" : inScale ? ", in selected scale" : ", outside selected scale"}`);
      const marker = document.createElement("span");
      marker.className = "note-marker";
      marker.textContent = pitch.name;
      marker.setAttribute("aria-hidden", "true");
      cell.append(marker);
      fragment.append(cell);
    }
  }

  fretboard.replaceChildren(fragment);
  scaleDescription.textContent = scaleCopy[mode];
}

scaleMode.addEventListener("change", renderFretboard);
showNotes.addEventListener("change", renderFretboard);
renderFretboard();
