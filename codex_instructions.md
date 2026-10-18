# Codex Project Instructions: Mirror-View Vocal Guitar Tabs

## Project Goal

Build a single-page interactive application centred on an electric lead-guitar solo that follows Clare Torry's studio vocal performance in "The Great Gig in the Sky." Convert the resulting ASCII guitar tab into an inverted mirror-view layout and provide a fully labelled 24-fret improvisation fretboard.

Work only inside this existing project folder:

```text
/Users/local.local/Projects/Job Hunting/The Great Gig in The Sky - Vocals to Lead Guitar
```

## Global Requirements

- Transcribe the studio vocal performance as a playable electric-guitar lead, including expressive bends, slides, vibrato, legato, phrasing, and sustain.
- Do not substitute a chord accompaniment, piano reduction, acoustic fingerstyle arrangement, or unrelated guitar cover for the vocal melody.
- Preserve tab timing and every technique marker, including bends, slides, hammer-ons, and pull-offs.
- Use standard guitar tuning: `E2`, `A2`, `D3`, `G3`, `B3`, `E4`.
- Keep G natural minor and G Dorian as separate selectable scale modes.
- Prefer a single-page HTML/CSS/JavaScript implementation unless the project later requires Streamlit-specific functionality.
- Complete and validate each phase before beginning the next one.

## Phase 1: Project Foundation

**Status: Complete — 18 October 2026**

### Tasks

1. Work from the existing project directory.
2. Initialize a local Git repository if one does not already exist.
3. Create the initial application structure.
4. Add a README describing the project and local run instructions.

```bash
cd "/Users/local.local/Projects/Job Hunting/The Great Gig in The Sky - Vocals to Lead Guitar"
git init
mkdir -p assets src data tests
touch README.md
```

### Deliverables

- Project directory structure
- Local Git repository
- Initial README
- Chosen application stack documented

### Validation Gate

- All project files remain inside the designated folder.
- The application can be launched locally with a documented command.

## Phase 2: Tab Data Collection and Format

**Status: Complete — 18 October 2026**

### Tasks

1. Collect the supplied or approved ASCII tab fragments.
2. Store original source tabs unchanged under `data/`.
3. Define a structured representation for strings, fret numbers, timing positions, and technique markers.
4. Record source attribution and arrangement metadata where available.

### Deliverables

- Raw tab source files
- Structured tab schema
- Representative fixtures covering notes, chords, rests, bends, slides, hammer-ons, and pull-offs

### Validation Gate

- Every imported fragment can be represented without losing its original timing or symbols.
- Source material and transformed output remain clearly separated.

## Phase 3: ASCII Tab Parser

**Status: Complete — 18 October 2026**

### Tasks

1. Parse six-string ASCII tabs into structured note-event arrays.
2. Retain horizontal alignment and technique notation.
3. Detect malformed or incomplete tab input and report useful errors.
4. Add automated parser tests using the Phase 2 fixtures.

### Deliverables

- Reusable parser module
- Structured note-event output
- Parser tests and error handling

### Validation Gate

- Parser tests pass.
- Round-trip or snapshot comparisons confirm that timing and technique markers are preserved.

## Phase 4: Mirror-View Transformation

**Status: Complete — 18 October 2026**

### Display Order

The output must place the thickest string at the top and the thinnest string at the bottom:

| Output row | Guitar string |
| ---: | :--- |
| 1 | Low `E` |
| 2 | `A` |
| 3 | `D` |
| 4 | `G` |
| 5 | `B` |
| 6 | High `e` |

### Tasks

1. Convert parsed tabs into the required mirror-view row order.
2. Preserve the exact horizontal position of notes and symbols.
3. Label low `E` and high `e` unambiguously.
4. Test transformations involving all six strings and supported techniques.

### Deliverables

- Mirror-view transformation module
- Readable mirror-view tab renderer
- Transformation tests

### Validation Gate

- Only row order changes; musical events and timing do not.
- Low `E` is always the top row and high `e` is always the bottom row.

## Phase 5: Fretboard Note Engine

**Status: Complete — 18 October 2026**

### Tasks

1. Calculate pitches dynamically for standard tuning across frets 0 through 24.
2. Render the fretboard using the same mirror-view string order.
3. Label every fret position with its chromatic pitch name.
4. Verify octave transitions internally, even if the interface displays pitch classes only.

### Deliverables

- Tested fretboard pitch engine
- Complete 0–24 fret data model
- Chromatic pitch labels for every string and fret

### Validation Gate

- Open strings match `E2 A2 D3 G3 B3 E4`.
- Fret 12 is one octave above its open string and fret 24 is two octaves above it.

## Phase 6: Scale Highlighting and Controls

**Status: Complete — 18 October 2026**

### Scale Definitions

- G natural minor: `G A Bb C D Eb F`
- G Dorian: `G A Bb C D E F`

Enharmonic display names may be normalized consistently, but the interface should favor the flat spellings above for these scales.

### Tasks

1. Add separate modes for G natural minor and G Dorian.
2. Highlight notes belonging to the selected scale.
3. Add controls to show or hide note markers.
4. Include a neutral chromatic or no-scale mode.
5. Add an accessible legend that does not rely on color alone.

### Deliverables

- Scale selector
- Note-marker toggle
- Highlighted fretboard and legend

### Validation Gate

- E-flat is highlighted only in G natural minor.
- E-natural is highlighted only in G Dorian.
- Controls work with mouse and keyboard input.

## Phase 7: Integrated Single-Page Interface

**Status: Complete — 18 October 2026**

### Tasks

1. Combine the tab viewer and interactive fretboard into one responsive page.
2. Add arrangement or tab-version selection.
3. Make long tab passages readable through wrapping, paging, or horizontal navigation.
4. Provide clear loading, empty, and invalid-input states.
5. Refine layout, typography, contrast, and mobile behavior.

### Deliverables

- Complete single-page application
- Responsive mirror-view tab viewer
- Interactive improvisation fretboard

### Validation Gate

- The application remains usable on desktop and mobile widths.
- All controls and labels are understandable without consulting the source code.
- No tab content is corrupted when switching views or settings.

## Phase 8: Quality Assurance and Documentation

**Status: Complete — 18 October 2026**

### Tasks

1. Run the complete automated test suite.
2. Test representative tabs manually against their source material.
3. Check keyboard navigation and basic accessibility.
4. Document supported ASCII syntax, known limitations, and how to add arrangements.
5. Confirm that only authorized source material is included.

### Deliverables

- Passing tests
- Final README and usage documentation
- Known-limitations section
- Release-ready local build

### Validation Gate

- All automated checks pass.
- A clean checkout can be launched using only the README instructions.
- Included source tabs have suitable provenance or permission.

## Phase 9: GitHub Repository Publication

**Status: Complete — 18 October 2026**

This phase changes external state and must only be run after the user explicitly approves publication and confirms that GitHub CLI authentication is available.

### Tasks

1. Review the staged files and ensure no secrets, private files, or unlicensed tab sources are included.
2. Create the initial commit.
3. Create the matching public GitHub repository and push the current branch.

```bash
gh repo create The-Great-Gig-in-The-Sky-Vocals-to-Lead-Guitar \
  --public \
  --source=. \
  --remote=origin \
  --push
```

### Deliverables

- Local initial commit
- Public GitHub repository
- Configured `origin` remote
- Pushed default branch

### Validation Gate

- The remote repository opens successfully.
- The local branch tracks the corresponding remote branch.
- No secrets or unauthorized source material are present in the published history.
