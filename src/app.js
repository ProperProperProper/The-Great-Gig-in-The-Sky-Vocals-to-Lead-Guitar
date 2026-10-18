import { createFretboard } from "./fretboard.js";

const tab = document.querySelector("#full-tab");
const fretboard = document.querySelector("#fretboard");

async function loadTab() {
  try {
    const response = await fetch("README.md");
    if (!response.ok) throw new Error(`Unable to load tab (${response.status}).`);
    const markdown = await response.text();
    const blocks = [...markdown.matchAll(/```text\n([\s\S]*?)```/g)].map((match) => match[1].trim());
    if (!blocks.length) throw new Error("No tab blocks were found.");
    tab.textContent = blocks.join("\n\n────────────────────────────────────────────────────────────\n\n");
  } catch (error) {
    tab.textContent = error.message;
  }
}

function renderFretboard() {
  const fragment = document.createDocumentFragment();
  const corner = document.createElement("div");
  corner.className = "heading string-heading";
  corner.textContent = "String";
  fragment.append(corner);

  for (let fret = 0; fret <= 24; fret += 1) {
    const heading = document.createElement("div");
    heading.className = "heading";
    heading.textContent = fret;
    heading.setAttribute("role", "columnheader");
    fragment.append(heading);
  }

  for (const string of createFretboard()) {
    const label = document.createElement("div");
    label.className = "string-label";
    label.textContent = string.string === 6 ? "Low E" : string.string === 1 ? "High e" : string.label;
    label.setAttribute("role", "rowheader");
    fragment.append(label);

    for (const pitch of string.frets) {
      const cell = document.createElement("div");
      cell.className = `note${pitch.name === "G" ? " root" : ""}`;
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `${string.openPitch} string, fret ${pitch.fret}: ${pitch.name}${pitch.octave}`);
      cell.innerHTML = `<span>${pitch.name}</span>`;
      fragment.append(cell);
    }
  }

  fretboard.replaceChildren(fragment);
}

loadTab();
renderFretboard();
