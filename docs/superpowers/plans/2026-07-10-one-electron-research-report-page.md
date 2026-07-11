# Blank one-electron-research-report Stub Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy a blank stub page reachable at `/one-electron-research-report` on the live site, unlinked from anywhere on the site.

**Architecture:** A single new directory `one-electron-research-report/` containing a minimal static `index.html` at the repo root, alongside the existing `index.html` and `wwwroot/`. No changes to any existing file. GitHub Pages serves it directly — no build step, no routing config.

**Tech Stack:** Plain HTML5. No JS, no CSS, no build tooling (matches the rest of the repo).

## Global Constraints

- Reachable at `/one-electron-research-report` on the deployed site (both with and without a trailing slash).
- No reference to the new page anywhere in `index.html`, `wwwroot/js/site.js`, or `README.md`.
- Page `<body>` is empty.
- Page title is exactly: `One-Electron Universe Hypothesis — Research Report`.
- This repo has no CI — a push to `main` is the production deploy (per `CLAUDE.md`).
- `.nojekyll` is present at repo root — files are served as plain static assets, no templating.
- Structure must be a directory + `index.html` (not a flat `.html` file), so the URL has no file extension.

---

### Task 1: Create the blank stub page and verify it locally

**Files:**
- Create: `one-electron-research-report/index.html`

**Interfaces:**
- Produces: a committed file at `one-electron-research-report/index.html`, which Task 2 pushes to production.

- [ ] **Step 1: Start a local static server from the repo root**

Run in the background from the repo root:

```bash
python -m http.server 8000
```

- [ ] **Step 2: Confirm the path doesn't resolve yet**

Run:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/one-electron-research-report
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/one-electron-research-report/
```

Expected: both print `404` (the directory doesn't exist yet).

- [ ] **Step 3: Create the stub page**

Create `one-electron-research-report/index.html`:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>One-Electron Universe Hypothesis — Research Report</title>
</head>
<body>
</body>
</html>
```

- [ ] **Step 4: Confirm the path now resolves cleanly**

Run:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/one-electron-research-report
curl -s -o /dev/null -w "%{http_code}\n" -L http://localhost:8000/one-electron-research-report
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/one-electron-research-report/
```

Expected:
- First command (no slash, no follow-redirect): `301`
- Second command (no slash, follow redirect): `200`
- Third command (trailing slash): `200`

- [ ] **Step 5: Confirm no other file references the new page**

Run:

```bash
grep -rn "one-electron-research-report" index.html wwwroot/js/site.js README.md
```

Expected: no output (exit code 1, zero matches). If anything matches, remove the reference before continuing — the page must stay unlinked.

- [ ] **Step 6: Stop the local server**

Stop the background process started in Step 1.

- [ ] **Step 7: Commit**

```bash
git add "one-electron-research-report/index.html"
git commit -m "feat: add blank stub page at /one-electron-research-report"
```

---

### Task 2: Deploy and verify in production

**Files:**
- None (deploy-only task; no file changes).

**Interfaces:**
- Consumes: the commit from Task 1 (must be on the local `main` branch before this task starts).
- Produces: a live, reachable page at `https://justinianerdmier.github.io/one-electron-research-report`.

- [ ] **Step 1: Get explicit user confirmation before pushing**

This repo has no CI gate — pushing `main` immediately redeploys the live production site. Ask the user to confirm they want to push now. Do not proceed to Step 2 without an explicit yes.

- [ ] **Step 2: Push to production**

```bash
git push origin main
```

- [ ] **Step 3: Verify the live page**

GitHub Pages can take up to a couple of minutes to publish after a push. Run:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://justinianerdmier.github.io/one-electron-research-report
curl -s -o /dev/null -w "%{http_code}\n" -L https://justinianerdmier.github.io/one-electron-research-report
```

Expected: first command `301` (or `200` if GitHub's edge normalizes the redirect internally — either is fine as long as the second command confirms the page loads), second command `200`. If both return `404`, wait ~30 seconds and retry before treating it as a failure.

Also load `https://justinianerdmier.github.io/one-electron-research-report` in a browser and confirm the tab title reads "One-Electron Universe Hypothesis — Research Report" with a blank page beneath it, and no console errors.
