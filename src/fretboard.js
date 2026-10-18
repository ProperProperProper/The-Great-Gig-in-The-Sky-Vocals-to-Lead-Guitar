const PITCH_CLASSES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const TUNING = [
  { string: 6, label: "E", openMidi: 40, openPitch: "E2" },
  { string: 5, label: "A", openMidi: 45, openPitch: "A2" },
  { string: 4, label: "D", openMidi: 50, openPitch: "D3" },
  { string: 3, label: "G", openMidi: 55, openPitch: "G3" },
  { string: 2, label: "B", openMidi: 59, openPitch: "B3" },
  { string: 1, label: "e", openMidi: 64, openPitch: "E4" }
];

export const SCALES = {
  chromatic: new Set(PITCH_CLASSES),
  naturalMinor: new Set(["G", "A", "Bb", "C", "D", "Eb", "F"]),
  dorian: new Set(["G", "A", "Bb", "C", "D", "E", "F"])
};

export function pitchFromMidi(midi) {
  if (!Number.isInteger(midi) || midi < 0 || midi > 127) throw new Error("MIDI pitch must be an integer from 0 to 127.");
  return { name: PITCH_CLASSES[midi % 12], octave: Math.floor(midi / 12) - 1, midi };
}

export function createFretboard(maxFret = 24) {
  if (!Number.isInteger(maxFret) || maxFret < 0 || maxFret > 24) throw new Error("Fret range must end between 0 and 24.");
  return TUNING.map((openString) => ({
    ...openString,
    frets: Array.from({ length: maxFret + 1 }, (_, fret) => ({ fret, ...pitchFromMidi(openString.openMidi + fret) }))
  }));
}

export function scaleMembership(noteName, mode) {
  if (!(mode in SCALES)) throw new Error(`Unknown scale mode: ${mode}`);
  return SCALES[mode].has(noteName);
}
