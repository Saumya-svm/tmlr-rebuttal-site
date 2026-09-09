/**
 * Build the rebuttal reading page from the Obsidian markdown notes.
 *
 *   node build.mjs <source_dir> <out_html>
 *
 * Everything is rendered at build time — markdown through `marked`, math
 * through KaTeX's MathML output, which browsers draw natively. The page ships
 * with no runtime dependency on a stylesheet or font from a CDN.
 *
 * The notes are Obsidian files, so the build also has to handle:
 *   %%...%%            private notes-to-self — stripped, never published
 *   [[note|label]]     wikilinks — rewritten to in-page links
 *   $...$              inline math — protected from the markdown parser first,
 *                      since underscores and asterisks in formulas would
 *                      otherwise be eaten as emphasis
 *   \\[ ... \\]          display math — LaTeX delimiters that Obsidian does not
 *                      render itself, so they arrive here as raw text
 */

import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import katex from "katex";

const COMMENT_RE = /%%[\s\S]*?%%/g;
const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
// Content may not start or end with whitespace, which keeps prose like
// "$5 and $10" out while still matching math glued to a word (MIMO-Crop$_{512}$).
const MATH_RE = /(?<!\$)\$(?!\s)([^$\n]+?)(?<!\s)\$(?!\$)/g;
// Display math. The notes use LaTeX \[ \] delimiters, which Obsidian itself
// does not render — $$ $$ is its dialect — so these have to be handled here or
// they reach the page as raw LaTeX.
const DISPLAY_RE = /\\\[([\s\S]*?)\\\]|\$\$([\s\S]*?)\$\$/g;
const TOKEN_RE = /MJXMATH(\d+)Z/g;
// "## Requested Change R3 [Critical] — Correct or redefine ..."
const CHANGE_RE = /^##\s+Requested Change\s+(R\d+)\s*(?:\[([^\]]+)\])?\s*[—–-]\s*(.+)$/;

marked.setOptions({ gfm: true, mangle: false, headerIds: false });

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = (s) => s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60);
const docId = (file) => path.basename(file, ".md").split(" - ")[0].trim();

function stripToText(md) {
  return md.replace(TOKEN_RE, "").replace(/[*_`\\]/g, "").trim();
}

/** Pull math out of the markdown so the parser can't mangle it. */
function stashMath(md, spans) {
  const stash = (tex, display) => `MJXMATH${spans.push({ tex: tex.trim(), display }) - 1}Z`;
  return md
    .replace(DISPLAY_RE, (_, bracketed, dollared) => stash(bracketed ?? dollared, true))
    .replace(MATH_RE, (_, tex) => stash(tex, false));
}

// LaTeX the notes use that KaTeX does not implement. Mapping them here keeps
// the source valid LaTeX for the paper itself.
const MACROS = { "\\mbox": "\\text{#1}" };

function restoreMath(html, spans, failures) {
  return html.replace(TOKEN_RE, (_, i) => {
    const { tex, display } = spans[+i];
    try {
      return katex.renderToString(tex, {
        output: "mathml",
        displayMode: display,
        macros: MACROS,
        throwOnError: true,
      });
    } catch (err) {
      // Falling back silently would ship raw LaTeX to the page looking like
      // prose, so surface it in the build output instead.
      failures.push({ tex, reason: err.message.split("\n")[0] });
      return `<code>${esc(tex)}</code>`;
    }
  });
}

/**
 * Rewrite the "Requested Change" headings into a header block carrying the
 * request number and its Critical/Strengthening tag, and collect them for the
 * sidebar. Every other heading is left to the markdown parser.
 */
function markChangeHeadings(md, toc) {
  return md
    .split("\n")
    .map((line) => {
      const m = CHANGE_RE.exec(line);
      if (!m) return line;
      const [, num, tag, rawTitle] = m;
      const id = `${num.toLowerCase()}-${slug(stripToText(rawTitle))}`;
      const kind = tag ? tag.trim().toLowerCase() : null;
      toc.push({ id, num, tag: tag ? tag.trim() : null, kind, title: stripToText(rawTitle) });
      const chip = tag ? `<span class="chip chip-${kind}">${esc(tag.trim())}</span>` : "";
      return (
        `<h2 class="request" id="${id}">` +
        `<span class="request-meta"><span class="request-num">${num}</span>${chip}</span>` +
        `<span class="request-title">${marked.parseInline(rawTitle)}</span>` +
        `</h2>`
      );
    })
    .join("\n");
}

/** Wide result tables scroll in their own box so the page never moves sideways. */
function wrapTables(html) {
  return html.replace(/<table>([\s\S]*?)<\/table>/g, (m) => `<div class="table-scroll">${m}</div>`);
}

function build(srcDir) {
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".md")).sort();
  const stems = new Map(files.map((f) => [path.basename(f, ".md"), docId(f)]));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(srcDir, file), "utf8");
    const spans = [];
    const toc = [];
    const failures = [];

    let md = raw.replace(COMMENT_RE, "");
    md = md.replace(WIKILINK_RE, (_, target, label) => {
      const dest = stems.get(target.trim());
      const text = (label || target).trim();
      return dest ? `[${text}](#/${dest})` : text;
    });
    md = stashMath(md, spans);

    const title = (raw.match(/^#\s+(.+)$/m) || [, path.basename(file, ".md")])[1];
    md = md.replace(/^\s*#\s+.*?\n/, "");
    md = markChangeHeadings(md, toc);

    const parts = path.basename(file, ".md").split(" - ");
    return {
      id: docId(file),
      title: stripToText(title.replace(MATH_RE, "$1")),
      nav: parts.length > 1 ? parts[1].trim() : parts[0],
      toc,
      html: restoreMath(wrapTables(marked.parse(md)), spans, failures),
      failures,
      counts: {
        critical: toc.filter((t) => t.kind === "critical").length,
        total: toc.length,
      },
    };
  });
}

/**
 * The Artifact host supplies the document skeleton, so the template is written
 * as bare page content. Serving the same page from GitHub Pages means adding
 * that skeleton back — plus the crawler opt-out, since the repo has to be
 * public for Pages to work while the paper is still under review.
 */
function standalone(page) {
  // html/head/body tags are optional in HTML5; omitting them keeps this a
  // straight prefix on the template rather than a wrapper that has to guess
  // where the head ends.
  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<style>body { margin: 0; } img { max-width: 100%; }</style>
${page}`;
}

const args = process.argv.slice(2);
const asStandalone = args.includes("--standalone");
const [srcDir, outFile] = args.filter((a) => !a.startsWith("--"));
const docs = build(srcDir);
const template = fs.readFileSync(new URL("./template.html", import.meta.url), "utf8");
const payload = JSON.stringify(docs.map(({ failures, ...d }) => d)).replace(/<\//g, "<\\/");
const page = template.replace("/*__DOCS__*/null", payload);
fs.writeFileSync(outFile, asStandalone ? standalone(page) : page);

console.log(`built ${outFile}`);
for (const d of docs) {
  console.log(`  ${d.id}  ${d.counts.total} requests (${d.counts.critical} critical)  ${d.nav}`);
}

const broken = docs.flatMap((d) => d.failures.map((f) => ({ ...f, id: d.id })));
if (broken.length) {
  console.log(`\n${broken.length} formula(s) could not be rendered and appear as literal text:`);
  for (const f of broken) {
    console.log(`  ${f.id}  ${f.tex.replace(/\s+/g, " ").slice(0, 70)}`);
    console.log(`      ${f.reason}`);
  }
}
