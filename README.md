# Rebuttal site

Renders the reviewer-response notes as a single page and deploys it to GitHub
Pages. Pushing to `main` rebuilds and redeploys; nothing else is needed.

```bash
npm install
npm run build      # -> _site/index.html
open _site/index.html
```

## Sources

`src/` holds the notes, exported from Obsidian. The build handles the
Obsidian-specific syntax:

- `%%...%%` private comments are stripped and never published. CI also fails the
  build if a `%%` survives in `src/`, since this repo is public.
- `[[note|label]]` wikilinks become in-page links.
- `$...$` inline math is protected from the markdown parser, then pre-rendered
  to MathML at build time — the page loads no math library or stylesheet.

The `## Requested Change R3 [Critical] — ...` heading format is parsed into the
per-reviewer contents list and the severity chips. Keep that shape when editing.

## While the paper is under review

The repo is public because GitHub Pages requires it on a free plan. The page
sends `noindex, nofollow, noarchive` and `robots.txt` disallows crawling, but
public repo contents remain searchable on GitHub itself. Make the repo private
to take the site down.
