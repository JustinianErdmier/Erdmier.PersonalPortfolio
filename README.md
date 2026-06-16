# JustinianErdmier.github.io

Personal portfolio for Justinian Erdmier — a vanilla HTML/CSS/JS site styled as a
Windows 11 desktop, deployed to GitHub Pages.

## Structure

```
index.html              Markup + two small inline bootstrap scripts (theme/boot,
                        kept inline to avoid a flash before first paint)
wwwroot/
  css/site.css          All styles
  js/site.js            All behavior (navigation, modals, theme, taskbar, tweaks)
  images/               headshot + project screenshots
  documents/            résumé + certificate PDFs
.nojekyll               Serve files as-is (no Jekyll processing)
```

## Local preview

It's a static site — open `index.html` in a browser, or serve the folder:

```sh
python -m http.server
# then visit http://localhost:8000
```

## Deployment

GitHub Pages serves `index.html` from the repository root on the default branch.
No build step is required.

