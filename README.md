# The Great Gig in The Sky — Vocals to Lead Guitar

An interactive, mirror-view guitar tab and fretboard application for playing Clare Torry's studio vocal performance from "The Great Gig in the Sky" as an expressive electric lead-guitar solo.

## Status

The project is complete through Phase 9 and published on GitHub. It includes the supplied vocal-tab draft, right-handed mirror conversion, a tested 0–24 fretboard, G Dorian and G natural minor highlighting, responsive controls, and documentation.

Repository: <https://github.com/ProperProperProper/The-Great-Gig-in-The-Sky-Vocals-to-Lead-Guitar>

## Stack

The project uses dependency-free HTML, CSS, and JavaScript. This keeps the application portable and allows it to run from any basic static web server.

## Run locally

From this project directory, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in a browser.

Stop the server with `Ctrl+C`.

Paste a conventional six-row ASCII tab (`e B G D A E`) into the workspace. The output reverses only the row order to `E A D G B e`, matching the string orientation a right-handed guitarist sees in a mirror while preserving every horizontal character position.

The supplied project arrangement loads automatically. Use the scale selector below it to switch among G Dorian, G natural minor, and all chromatic notes. The note-name checkbox hides visual labels while retaining accessible descriptions.

## Run tests

```bash
npm test
```

## Project structure

```text
.
├── assets/                 Static media and visual assets
├── data/                   Approved source tabs and structured data
├── src/
│   ├── app.js              Application behavior
│   ├── fretboard.js        Pitch and scale engine
│   ├── tab-parser.js       ASCII parser and mirror renderer
│   └── styles.css          Application styling
├── tests/                  Automated test files
├── codex_instructions.md   Phased project specification
├── index.html              Single-page application entry point
└── README.md               Project and launch documentation
```

## Source-material policy

Only tab material supplied by the project owner or otherwise authorized for inclusion should be stored or published in this repository.

## Supported tab syntax

- Six-string standard input order: `e B G D A E`
- Right-handed mirror output order: `E A D G B e`
- Frets 0–24
- Hammer-ons (`h`), pull-offs (`p`), bends (`b`), releases (`r`), slides (`/` and `\`), and vibrato (`~`)
- Multiple consecutive six-row blocks

## Known limitations

- Character columns preserve relative ASCII alignment but do not encode formal rhythmic values.
- The user-supplied vocal tab is a structurally valid draft, not a note-for-note certified transcription; see `data/tab-audit.md`.
- Imported blocks must contain exactly six labeled rows in standard input order.
- Alternate tunings are not supported.
