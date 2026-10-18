# Tab data

This directory separates unchanged source material from normalized project data.

## Directories

- `raw/`: original, approved ASCII tab files and their source records
- `fixtures/`: small, project-authored samples used to develop and test the parser
- `schema/`: the canonical structured-tab JSON Schema

Do not add copied tabs merely because they are publicly accessible. A source must be supplied by the project owner, licensed for reuse, or otherwise explicitly approved before it can be stored here or published.

## Adding an approved source

1. Save the source exactly as received in `raw/` without correcting or reformatting it.
2. Add a matching metadata record based on `raw/source-record.template.json`.
3. Give the tab and metadata record the same base filename.
4. Record the source URL or description, attribution, date accessed, and permission basis.
5. Keep transformations and generated files outside `raw/`.

## Structured representation

`schema/tab.schema.json` defines a tab document with:

- document and arrangement metadata;
- the six standard-tuned strings;
- source-preserving ASCII lines;
- a shared character-column timeline;
- note events with fret positions and optional techniques;
- rests and simultaneous-event grouping.

Columns are zero-based character offsets within the tab content after the string label and separator. Events on the same column occur together. Each technique stores its source symbol and exact column span so a renderer can preserve alignment.
