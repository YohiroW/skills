# Conversion, PDF export, and sharing

Resolve every script path below from the installed skill directory. Quote paths containing spaces. `SKILL_ROOT` in examples is a placeholder for that absolute directory, not an environment variable guaranteed by Codex.

## PowerPoint to HTML

Use Python with `python-pptx`. In Codex desktop, first check `load_workspace_dependencies` for a bundled Python runtime. If the package is missing, use a task-local virtual environment and install `python-pptx` there rather than changing a global environment.

```text
python -X utf8 "SKILL_ROOT/scripts/extract-pptx.py" "input.pptx" "work/extracted"
```

The extractor writes `extracted-slides.json` and `assets/`. It extracts top-level text frames, pictures, and speaker notes. It does **not** fully recover tables, charts, SmartArt, grouped content, embedded media, animation, or original slide layout. Inspect the source for these features; preserve them through available presentation rendering/extraction tools when needed, or explain what needs manual reconstruction. Legacy `.ppt` requires conversion to `.pptx` with an available office tool first.

Summarize the extracted content and any gaps. Ask about material ambiguity, then continue with the selected visual direction. Preserve source text, order, images, and notes (for example in HTML comments); escape notes so `-->` cannot break a comment. Embed images in a single-file deck, or ship an explicit assets folder. Do not claim pixel-perfect PowerPoint conversion.

## Export HTML to PDF

Use the cross-platform Node helper:

```text
node "SKILL_ROOT/scripts/export-pdf.cjs" "presentation.html" "presentation.pdf"
node "SKILL_ROOT/scripts/export-pdf.cjs" "presentation.html" "presentation.pdf" --compact
```

It serves the HTML's directory on loopback, captures every `.slide`, and writes one 16:9 raster page per slide. Default resolution is 1920 × 1080; `--compact` uses 1280 × 720. Static PDFs do not preserve interactivity, animations, selectable text, or speaker notes. Video/canvas state may require a deliberate static replacement.

Dependencies are Node.js, `playwright` (or `playwright-core`), and Chromium/Chrome/Edge. The helper never installs packages automatically.

- In Codex desktop, use `load_workspace_dependencies` to locate bundled Node packages. Expose that returned package directory through `NODE_PATH` for the helper, then restore the previous value when done.
- In a standalone environment, install `playwright` in a task-local tools directory, point `NODE_PATH` at its `node_modules`, and run that installation's `playwright install chromium` if no usable browser is installed.
- If bundled Chromium is absent, pass `--browser msedge` or `--browser chrome` to use an installed browser. Use `--executable-path "absolute/path/to/browser"` for an explicit binary. Do not install a browser if an available one suffices.
- `--help` describes arguments. Missing input, missing slides, or unloaded images produce a nonzero exit. Fonts loaded from the network can still fall back; visually verify the selected typography.
- Export operates on fixed-stage `.slide` decks. Other HTML architectures may need adaptation. It hides standard deck/edit controls and finishes finite reveal animations without rewriting stage geometry.

Inspect the resulting PDF, check page count and sample pages, and deliver it. If compact export is requested, use it directly; otherwise mention it only when size becomes a practical issue.

## Publish to Vercel only when requested

1. Prepare a dedicated staging folder with `index.html` and only its required assets. Do not deploy the whole source repository, scratch folder, or skill installation. Preview that folder locally and verify referenced assets.
2. Use an available Vercel connector or CLI. The CLI works on Windows without the upstream Bash wrapper. Run `npx vercel whoami`; if authentication is needed, have the user complete `npx vercel login`, then verify it. Do not promise free hosting or permanent URLs; account plans and policies apply.
3. Use `npx vercel deploy "path/to/staging-folder"` for the requested deployment. Add `--prod` only when production publication is authorized. Preserve prior authorization; if the request did not authorize upload/publication, obtain it after the local result is ready for review.
4. Verify the returned URL, images, fonts, and slide controls. Report the actual deployment URL and whether it is a preview or production deployment. Account protection settings may limit access; do not claim universal public access without checking.

Deployment is not exercised when merely installing or validating this skill.
