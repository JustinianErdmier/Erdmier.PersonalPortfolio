# Design: Blank stub page at /one-electron-research-report

## Purpose

Reserve the URL slug `/one-electron-research-report` on the live site ahead of
eventually publishing "The One-Electron Universe Hypothesis — Research Report"
(source docx/pdf already sit in `wwwroot/documents/`). This spec covers only
the blank stub and its deployment — populating the page with the report's
content is a separate, future task.

## Requirements

- Reachable at `/one-electron-research-report` on the deployed site.
- Not linked or referenced from `index.html`, `site.js`, or `README.md` — no
  nav entry, no href, no mention anywhere a visitor or reader of those files
  would encounter it.
- Page body is empty for now.
- Deployed to production (GitHub Pages, served from `main` branch root) and
  confirmed reachable.

## Approach

Create `one-electron-research-report/index.html` — a directory containing an
index file, not a flat `one-electron-research-report.html`.

This repo has `.nojekyll`, so GitHub Pages serves files as plain static
assets with no processing. A directory + `index.html` is what makes the
extension-less slug resolve: requests for `/one-electron-research-report`
(no trailing slash) get a 301 redirect to `/one-electron-research-report/`,
which then serves the directory's `index.html`. A flat `.html` file was
rejected because the URL would then include the `.html` extension, which
doesn't match the requested slug.

The page itself is a standalone, minimal, valid HTML5 document — doctype,
charset, `<title>One-Electron Universe Hypothesis — Research Report</title>`,
empty `<body>`. It does not include the main site's
`site.css`/`site.js`/theme bootstrap scripts, since it is intentionally
blank and decoupled from the single-page app for now.

## Isolation

Grep `index.html`, `wwwroot/js/site.js`, and `README.md` for
`one-electron-research-report` before committing, to confirm none of them
reference the new path.

## Verification

1. Serve the repo root locally (`python -m http.server`) and request both
   `/one-electron-research-report` and `/one-electron-research-report/`,
   confirming a 200/redirect-to-200 and a blank page with no console errors.
2. Commit, then push to `main` (this repo has no CI — pushing to `main` is
   the production deploy, per `CLAUDE.md`), after explicit user confirmation.
3. After push, request the live URL
   (`https://justinianerdmier.github.io/one-electron-research-report`) to
   confirm it resolves in production.

## Out of scope

- Any content for the report itself (text, styling, layout).
- Any link to this page from anywhere on the site.
- Updating `README.md`'s structure listing (it currently only summarizes
  directories, not individual pages, so it needs no change).
