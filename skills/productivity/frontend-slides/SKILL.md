---
name: frontend-slides
description: Create, edit, or convert browser-based HTML slide decks with animation, visual style previews, and fixed 16:9 layouts. Use for web presentations, HTML talks or pitches, and PPTX-to-HTML conversion. Not for producing native PowerPoint or Google Slides files.
---

# Frontend Slides for Codex

Create polished browser presentations with inline CSS and JavaScript, using the user's content and the bundled design library. No framework, npm build, or runtime JavaScript dependency is needed for the generated HTML. Optional extraction and PDF tools have separate dependencies.

## Environment and scope

- Resolve bundled resources and scripts relative to this `SKILL.md`, not the current working directory. Read only the resources needed for the current mode.
- Write generated files in the user's project/output directory. Use the task's scratch directory for previews and extracted assets; never write into the installed skill. Honor host rules for `work/` and `outputs/` when present.
- Honor the user's language, brand, selected style, existing authorization, and requested deliverable. Template rules are defaults; explicit user requirements take precedence.
- Use available Codex tools instead of assuming Claude slash commands, `AskUserQuestion`, Bash, or macOS `open`. Ask missing consequential questions with `request_user_input_async` when available; use `request_user_input` only when its current-mode restrictions allow it. Otherwise ask briefly in chat. Do not repeat answered questions or require approval for every reversible design step.
- Use an available image viewer for supplied visuals. In Codex desktop, use `open_in_codex` to show files or a served browser URL when useful. Opening a tab alone does not verify rendering. Follow the active browser tool's rules for inspection.
- The HTML should be portable: embed images for a single-file deliverable, or include explicitly requested relative assets. Remote Fontshare/Google Fonts links require internet. For offline delivery, embed licensed font files or use suitable installed/system fallbacks, including fonts covering the user's language.

## Choose the workflow

- **New deck:** infer purpose, audience, approximate length, available content, and density from the request. Ask only for missing details that change the result. Design an outline around both the text and usable images.
- **PPTX conversion:** read [conversion-and-sharing.md](references/conversion-and-sharing.md#powerpoint-to-html), extract the source, then use the design workflow below. Preserve slide order, source content, and speaker notes; disclose extraction gaps.
- **Existing HTML:** inspect its architecture and requested changes first. Preserve its content, design, controls, and layout contract where possible. Apply the fixed-stage architecture to new decks and requested redesigns, rather than silently rebuilding an unrelated existing layout.

Choose density from the brief or ask when it materially affects the result:

| Mode | Layout guidance |
| --- | --- |
| Speaker-led | One main idea per slide, large type, generous space, usually 1–3 bullets. Split material across more slides as needed. |
| Reading-first | Self-contained explanations, tables and annotations, usually 4–8 bullets or 4–6 cards when legible. |

Never resolve overflow by making text unreadably small. Split slides or simplify the layout. For image folders, inspect relevant images and use their subject, composition, and colors to shape the outline; do not invent unseen details.

## Discover the visual direction

If a style was selected, follow it. If the user delegates style choice or wants an immediate finished draft, pick a fitting direction and proceed. Otherwise read [style-discovery.md](references/style-discovery.md), generate three contrasting title-slide previews using real deck content, and let the user select or mix them.

Use [STYLE_PRESETS.md](STYLE_PRESETS.md) and [selection-index.json](bold-template-pack/selection-index.json) to shortlist styles. For bold templates, first load only shortlisted `preview_md` cards, then load the selected template's `design_md` for full generation. Index paths are relative to this skill root. The full upstream `template.html` files are not bundled; the preview and design documents are the local source of truth.

Keep template names, filenames, option labels, process notes, and requirement notes outside the visible slides. Use purposeful typography, a coherent palette, and distinctive layouts appropriate to the topic. Avoid applying a generic dashboard/card layout to every deck. User-specified fonts and branding override preset preferences.

## Build the deck

Read [html-template.md](html-template.md), the full [viewport-base.css](viewport-base.css), and the relevant parts of [animation-patterns.md](animation-patterns.md). Read only the chosen bold template's design document, if applicable. For a custom preview, expand that preview's visual system instead of switching to another template.

For new decks:

- Author slides at **1920 × 1080** inside `.deck-stage`, enclosed by `.deck-viewport`. Scale the entire stage uniformly with letterboxing/pillarboxing. Keep its 16:9 ratio even on phones; do not reflow internal slide layouts at mobile breakpoints.
- Include the complete `viewport-base.css` in the HTML, then add theme/layout styles. Translate viewport-fluid template values into stage coordinates. Do not let template CSS overwrite stage positioning or visibility rules.
- Stack `.slide` elements and switch `.active` / `.visible` using visibility, opacity, and pointer events. Do not switch slides using `display`, which layout classes can accidentally override.
- Provide keyboard navigation, touch/swipe navigation, and restrained mouse-wheel navigation. Keep deck controls outside the stage. Respect `prefers-reduced-motion` and keep text contrast and focus states usable.
- Include inline editing by default unless the user requests a locked/export-only deck. Implement the edit toggle, local save, and downloadable updated HTML described in `html-template.md`; verify the saved file actually retains edits. Reference snippets are partial recipes, not a complete implementation.
- Use fixed stage measurements for slide content. Reserve `clamp()` for UI outside the stage or compact previews. Negate CSS functions with `calc(-1 * ...)`, not `-clamp(...)`.
- Keep HTML/CSS/JS readable, with comments for major sections. Do not introduce React or animation-library dependencies just to implement a template effect.

When adding content to an existing fixed-stage deck, reassess density first. Fit new images inside the canvas or move material to another slide; verify text boxes, cards, and neighboring panels after changes.

## Verify and deliver

Use browser inspection when available:

1. Render every slide at 1280 × 720 and at least one phone viewport. Confirm the 16:9 stage, complete text, loaded media/fonts, and absence of clipping or overlapping panels. DOM overflow checks help but cannot replace screenshots.
2. Exercise navigation and any editing/export controls that are included. Check the browser console for failures.
3. If offline operation was requested, verify with network access disabled.
4. Fix issues introduced by the work. If no browser is available, perform the structural checks possible and explicitly say that visual verification remains unperformed.

Deliver the HTML and any needed assets with links, slide count, selected style, and working navigation/editing instructions. Show the result with the available file/browser tools. Retain previews unless cleanup is requested or they are disposable files created in this task; do not delete pre-existing user directories.

For requested PDF export or publication, read [conversion-and-sharing.md](references/conversion-and-sharing.md). Carry out exports already requested as part of the task. Offer optional sharing briefly when useful; generating a deck alone does not authorize public deployment.
