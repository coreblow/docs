import { DOCS } from "./docs.generated.js";

const docsByRoute = new Map(DOCS.map((doc) => [doc.route, doc]));
const sections = [...new Set(DOCS.map((doc) => doc.section))].sort((a, b) => a.localeCompare(b));

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const route = normalizeRoute(url.pathname);

    if (route === "/health") {
      return json({ status: "ok", documents: DOCS.length });
    }

    if (route === "/docs.json") {
      return json({
        title: "CoreBlow Docs",
        documents: DOCS.map(({ content, ...doc }) => doc),
      });
    }

    if (route === "/search") {
      const query = url.searchParams.get("q") ?? "";
      return html(renderShell(renderSearch(query), { title: "Search" }));
    }

    if (route === "/") {
      return html(renderShell(HOME_HTML));
    }

    const doc = docsByRoute.get(route);
    if (doc) {
      return html(renderShell(renderDocument(doc), { title: doc.title, route: doc.route }));
    }

    return html(renderShell(renderNotFound(route), { title: "Not Found" }), { status: 404 });
  },
};

function normalizeRoute(pathname) {
  const route = pathname.replace(/\/+$/, "") || "/";
  if (route === "/index") return "/";
  return route;
}

function renderShell(content, options = {}) {
  const title = options.title ? `${options.title} | CoreBlow Docs` : "CoreBlow Docs";
  const nav = sections
    .map((section) => `<a href="/${escapeAttr(section)}">${escapeHtml(label(section))}</a>`)
    .join("");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="CoreBlow documentation for installation, CLI, channels, plugins, gateway, and operations." />
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    :root {
      --bg: #f8fafc;
      --surface: #ffffff;
      --surface-2: #eef2f7;
      --text: #111827;
      --muted: #5b6472;
      --line: #d9e0ea;
      --accent: #0f766e;
      --accent-2: #1d4ed8;
      --code: #0f172a;
    }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    a { color: inherit; }
    .shell { width: min(1180px, calc(100% - 40px)); margin: 0 auto; }
    .topbar {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid var(--line);
    }
    .brand { display: flex; align-items: center; gap: 12px; text-decoration: none; font-weight: 800; }
    .mark {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border-radius: 8px;
      background: #111827;
      color: #fff;
      font-size: 13px;
    }
    .nav { display: flex; flex-wrap: wrap; gap: 16px; color: var(--muted); font-size: 14px; }
    .nav a { text-decoration: none; }
    .layout {
      display: grid;
      grid-template-columns: 240px minmax(0, 1fr);
      gap: 34px;
      padding: 34px 0 52px;
    }
    .sidebar {
      position: sticky;
      top: 20px;
      align-self: start;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      padding: 14px;
    }
    .sidebar h2 { margin: 0 0 10px; font-size: 13px; color: var(--muted); text-transform: uppercase; }
    .sidebar a {
      display: block;
      padding: 8px 10px;
      border-radius: 7px;
      color: #334155;
      text-decoration: none;
      font-size: 14px;
    }
    .sidebar a:hover { background: var(--surface-2); color: var(--text); }
    .content {
      min-width: 0;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      padding: clamp(22px, 4vw, 42px);
      box-shadow: 0 12px 40px rgba(15, 23, 42, 0.06);
    }
    .hero { padding: 48px 0 18px; }
    .eyebrow { margin: 0 0 14px; color: var(--accent); font-size: 13px; font-weight: 800; text-transform: uppercase; }
    h1 { margin: 0 0 18px; font-size: clamp(38px, 6vw, 68px); line-height: 0.98; letter-spacing: 0; }
    .lead { max-width: 760px; margin: 0; color: var(--muted); font-size: 18px; line-height: 1.65; }
    .search {
      display: flex;
      gap: 10px;
      margin-top: 26px;
      max-width: 720px;
    }
    .search input {
      flex: 1;
      min-width: 0;
      min-height: 46px;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 0 14px;
      font: inherit;
    }
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      border: 1px solid #111827;
      border-radius: 8px;
      background: #111827;
      color: #fff;
      padding: 0 16px;
      font-weight: 800;
      text-decoration: none;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-top: 26px;
    }
    .card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      padding: 18px;
      text-decoration: none;
    }
    .card h3 { margin: 0 0 8px; font-size: 17px; }
    .card p { margin: 0; color: var(--muted); line-height: 1.5; font-size: 14px; }
    .doc-path { margin: 0 0 18px; color: var(--muted); font-size: 13px; }
    .doc-body { line-height: 1.7; font-size: 16px; }
    .doc-body h1, .doc-body h2, .doc-body h3 { line-height: 1.2; margin: 28px 0 12px; letter-spacing: 0; }
    .doc-body h1 { font-size: 38px; margin-top: 0; }
    .doc-body h2 { font-size: 26px; border-top: 1px solid var(--line); padding-top: 24px; }
    .doc-body h3 { font-size: 20px; }
    .doc-body p { margin: 12px 0; }
    .doc-body ul, .doc-body ol { padding-left: 24px; }
    .doc-body li { margin: 6px 0; }
    .doc-body code {
      border-radius: 5px;
      background: #e2e8f0;
      padding: 2px 5px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.92em;
    }
    .doc-body pre {
      overflow-x: auto;
      border-radius: 8px;
      background: var(--code);
      color: #e5e7eb;
      padding: 16px;
      line-height: 1.55;
    }
    .doc-body pre code { background: transparent; padding: 0; }
    .doc-body blockquote {
      margin: 18px 0;
      border-left: 4px solid var(--accent);
      padding: 4px 0 4px 16px;
      color: var(--muted);
    }
    .footer { border-top: 1px solid var(--line); padding: 24px 0 34px; color: var(--muted); font-size: 13px; }
    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
      .sidebar { position: static; }
      .cards { grid-template-columns: 1fr; }
      .search { flex-direction: column; }
      .topbar { align-items: flex-start; flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <a class="brand" href="/">
        <span class="mark">CB</span>
        <span>CoreBlow Docs</span>
      </a>
      <nav class="nav" aria-label="Docs navigation">
        <a href="https://coreblow.com">Website</a>
        <a href="https://coreblow.com/corehub">CoreHub</a>
        <a href="https://github.com/coreblow/docs">GitHub</a>
      </nav>
    </header>
    <main class="layout">
      <aside class="sidebar">
        <h2>Sections</h2>
        ${nav}
      </aside>
      <section>
        ${content}
      </section>
    </main>
    <footer class="footer">CoreBlow documentation is maintained in github.com/coreblow/docs.</footer>
  </div>
</body>
</html>`;
}

function renderHome() {
  const featured = [
    findDoc("/install"),
    findDoc("/cli"),
    findDoc("/configuration"),
    findDoc("/channels"),
    findDoc("/plugins"),
    findDoc("/gateway"),
  ].filter(Boolean);
  return `<div class="hero">
    <p class="eyebrow">Documentation</p>
    <h1>CoreBlow operator docs.</h1>
    <p class="lead">Install, configure, operate, extend, and troubleshoot CoreBlow across CLI, channels, plugins, providers, gateway, security, and platform deployments.</p>
    <form class="search" action="/search" method="get">
      <input name="q" type="search" placeholder="Search documentation" aria-label="Search documentation" />
      <button class="button" type="submit">Search</button>
    </form>
  </div>
  <div class="cards">
    ${featured.map(renderCard).join("")}
  </div>
  <div class="content" style="margin-top: 18px;">
    <div class="doc-body">
      <h2>All Sections</h2>
      <ul>
        ${sections.map((section) => `<li><a href="/${escapeAttr(section)}">${escapeHtml(label(section))}</a></li>`).join("")}
      </ul>
    </div>
  </div>`;
}

function renderSearch(query) {
  const results = searchDocs(query);
  return `<div class="content">
    <div class="doc-body">
      <h1>Search</h1>
      <form class="search" action="/search" method="get">
        <input name="q" type="search" value="${escapeAttr(query)}" placeholder="Search documentation" aria-label="Search documentation" />
        <button class="button" type="submit">Search</button>
      </form>
      <h2>${results.length} results</h2>
      ${results.length ? `<div class="cards">${results.map(renderCard).join("")}</div>` : "<p>No documents matched the query.</p>"}
    </div>
  </div>`;
}

function renderDocument(doc) {
  return `<article class="content">
    <p class="doc-path">${escapeHtml(doc.path)}</p>
    <div class="doc-body">${markdownToHtml(doc.content)}</div>
  </article>`;
}

function renderNotFound(route) {
  return `<div class="content">
    <div class="doc-body">
      <h1>Document not found</h1>
      <p>No CoreBlow document exists at <code>${escapeHtml(route)}</code>.</p>
      <p><a href="/">Return to the documentation index</a>.</p>
    </div>
  </div>`;
}

function renderCard(doc) {
  return `<a class="card" href="${escapeAttr(doc.route)}">
    <h3>${escapeHtml(doc.title)}</h3>
    <p>${escapeHtml(doc.summary || doc.path)}</p>
  </a>`;
}

function findDoc(route) {
  return docsByRoute.get(route) ?? docsByRoute.get(`${route}/index`);
}

function searchDocs(query) {
  const terms = String(query ?? "")
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter(Boolean);
  if (terms.length === 0) return [];

  return DOCS
    .map((doc) => ({ doc, score: scoreDoc(doc, terms) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.doc.route.localeCompare(b.doc.route))
    .slice(0, 24)
    .map((result) => result.doc);
}

function scoreDoc(doc, terms) {
  const title = doc.title.toLowerCase();
  const haystack = [doc.title, doc.route, doc.path, doc.summary, doc.content]
    .join(" ")
    .toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (title.includes(term)) score += 10;
    if (doc.route.includes(term)) score += 5;
    if (haystack.includes(term)) score += 1;
  }
  return score;
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let inCode = false;
  let paragraph = [];
  let listType = null;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      flushParagraph();
      closeList();
      if (inCode) {
        html.push("</code></pre>");
        inCode = false;
      } else {
        html.push("<pre><code>");
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      html.push(`${escapeHtml(line)}\n`);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      if (listType !== "ul") {
        closeList();
        html.push("<ul>");
        listType = "ul";
      }
      html.push(`<li>${renderInline(unordered[1])}</li>`);
      continue;
    }

    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      if (listType !== "ol") {
        closeList();
        html.push("<ol>");
        listType = "ol";
      }
      html.push(`<li>${renderInline(ordered[1])}</li>`);
      continue;
    }

    const quote = line.match(/^>\s+(.+)$/);
    if (quote) {
      flushParagraph();
      closeList();
      html.push(`<blockquote>${renderInline(quote[1])}</blockquote>`);
      continue;
    }

    closeList();
    paragraph.push(line.trim());
  }

  flushParagraph();
  closeList();
  if (inCode) html.push("</code></pre>");
  return html.join("\n");
}

function renderInline(value) {
  return escapeHtml(value)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
      const normalizedHref = normalizeHref(href);
      return `<a href="${escapeAttr(normalizedHref)}">${escapeHtml(text)}</a>`;
    })
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function normalizeHref(href) {
  const value = String(href).trim();
  if (/^https?:\/\//.test(value) || value.startsWith("#")) return value;
  return value.replace(/\.mdx?(#.*)?$/i, "$1").replace(/^docs\//, "/");
}

function label(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function html(body, options = {}) {
  return new Response(body, {
    status: options.status ?? 200,
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

function json(body, options = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status: options.status ?? 200,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

const HOME_HTML = renderHome();
