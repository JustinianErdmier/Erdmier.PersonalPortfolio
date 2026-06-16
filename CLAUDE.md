# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Local preview

No build step. Open `index.html` directly or serve the folder:

```sh
python -m http.server
# visit http://localhost:8000
```

Deployed automatically to GitHub Pages from the `main` branch root.

## Architecture

A single-page, vanilla HTML/CSS/JS portfolio styled as a Windows 11 desktop. No frameworks, no bundler, no dependencies.

**Three source files:**
- `index.html` — all markup and two inline `<script>` blocks that must stay inline (theme application and boot-skip, both run before first paint to avoid flash)
- `wwwroot/css/site.css` — all styles; single flat file
- `wwwroot/js/site.js` — all behaviour; single flat file loaded at bottom of `<body>`

**Navigation model** (`site.js`): buttons carry `data-go="<sectionId>"` attributes. Clicking calls `activatePane(id)`, which toggles the `.active` class on `.pane` sections inside `#content`. The nav rail highlights the active item via `setSel()`.

**Detail modal**: `EXP` and `PROJ` objects in `site.js` hold the full content for experience and project entries. `renderExp()` / `renderProj()` generate HTML strings from them. Buttons in `index.html` carry `data-modal`, `data-key`, `data-title`, and `data-sub` attributes that wire up the click handlers.

**Theming**: `data-theme="dark|light"` is set on `<body>`. CSS custom properties on `:root` and `[data-theme="dark"]` do all the work. Preference is read from `localStorage` (`je-theme`). The inline theme script in `<head>` must apply before the stylesheet renders — do not move it.

**Window chrome**: `.win` receives `.maximized` or `.minimized` classes. Minimize animates the window toward the taskbar via CSS transform; taskbar button `#tbApp` toggles restore/minimize.

**Boot sequence**: Shown once per session (`sessionStorage` key `je-booted`). `localStorage` key `je-boot-always = '1'` opts into showing every load. The inline boot-skip script in `<head>` hides `#boot` immediately on repeat visits.

**CSS tokens**: `--accent` is the primary brand colour (`#0067c0` light / `#60cdff` dark). The Mica backdrop effect on `.win` uses `backdrop-filter: blur(40px)`.
