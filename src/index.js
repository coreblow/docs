import { DOCS, DOCS_CONFIG } from "./docs.generated.js";

const docsByRoute = new Map(DOCS.map((doc) => [doc.route, doc]));
const sections = [...new Set(DOCS.map((doc) => doc.section))].sort((a, b) => a.localeCompare(b));
const navTabs = buildNavTabs(DOCS_CONFIG);
const topNav = navTabs.map((tab) => ({ label: tab.label, route: tab.route }));
const searchIndex = DOCS.map(({ content, ...doc }) => doc);

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
      return html(renderShell(renderDocument(doc), {
        title: doc.title,
        route: doc.route,
        toc: extractHeadings(doc.content).slice(0, 12),
      }));
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
  const topLinks = topNav
    .map((item) => `<a class="${isActiveRoute(options.route, item.route) ? "active" : ""}" href="${escapeAttr(item.route)}">${escapeHtml(item.label)}</a>`)
    .join("");
  const sidebar = renderSidebar(options.route ?? "/");
  const toc = renderToc(options.toc ?? []);
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
      --bg: #f7f8fb;
      --surface: #ffffff;
      --surface-2: #f1f5f9;
      --surface-3: #e8edf5;
      --text: #111827;
      --muted: #5b6472;
      --line: #d9e0ea;
      --accent: #0f766e;
      --accent-2: #1d4ed8;
      --code: #0f172a;
      --shadow: 0 18px 54px rgba(15, 23, 42, 0.08);
    }
    body {
      margin: 0;
      min-height: 100vh;
      background: linear-gradient(180deg, #ffffff 0, var(--bg) 360px);
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    a { color: inherit; }
    .shell { width: min(1440px, calc(100% - 40px)); margin: 0 auto; }
    .topbar {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: center;
      min-height: 66px;
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
    .top-actions { display: flex; align-items: center; gap: 12px; }
    .search-trigger {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-width: 230px;
      min-height: 38px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      color: var(--muted);
      padding: 0 10px;
      font: inherit;
      cursor: pointer;
      box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
    }
    .kbd {
      margin-left: auto;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: var(--surface-2);
      color: #475569;
      padding: 2px 6px;
      font-size: 12px;
      font-weight: 800;
    }
    .external-nav { display: flex; gap: 14px; color: var(--muted); font-size: 14px; }
    .external-nav a { text-decoration: none; }
    .product-nav {
      display: flex;
      gap: 2px;
      overflow-x: auto;
      padding: 12px 0;
      border-bottom: 1px solid var(--line);
    }
    .product-nav a {
      flex: 0 0 auto;
      border-radius: 8px;
      color: #475569;
      padding: 8px 11px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 750;
    }
    .product-nav a:hover,
    .product-nav a.active {
      background: var(--surface-2);
      color: var(--text);
    }
    .layout {
      display: grid;
      grid-template-columns: 270px minmax(0, 1fr) 230px;
      gap: 28px;
      padding: 28px 0 52px;
    }
    .sidebar {
      position: sticky;
      top: 18px;
      align-self: start;
      max-height: calc(100vh - 36px);
      overflow: auto;
      padding-right: 6px;
    }
    .sidebar-group { margin-bottom: 22px; }
    .sidebar h2 { margin: 0 0 8px; font-size: 12px; color: #64748b; text-transform: uppercase; }
    .sidebar a {
      display: block;
      padding: 7px 10px;
      border-radius: 7px;
      color: #334155;
      text-decoration: none;
      font-size: 14px;
    }
    .sidebar a:hover,
    .sidebar a.active { background: var(--surface-2); color: var(--text); }
    .toc {
      position: sticky;
      top: 18px;
      align-self: start;
      max-height: calc(100vh - 36px);
      overflow: auto;
      color: var(--muted);
      font-size: 13px;
    }
    .toc h2 { margin: 0 0 10px; color: #64748b; font-size: 12px; text-transform: uppercase; }
    .toc a {
      display: block;
      padding: 6px 0;
      color: #475569;
      text-decoration: none;
      border-left: 2px solid transparent;
      padding-left: 10px;
    }
    .toc a:hover { border-left-color: var(--accent); color: var(--text); }
    .content {
      min-width: 0;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      padding: clamp(22px, 4vw, 42px);
      box-shadow: var(--shadow);
    }
    .hero { padding: 52px 0 20px; }
    .eyebrow { margin: 0 0 14px; color: var(--accent); font-size: 13px; font-weight: 800; text-transform: uppercase; }
    h1 { margin: 0 0 18px; font-size: clamp(38px, 6vw, 68px); line-height: 0.98; letter-spacing: 0; }
    .lead { max-width: 760px; margin: 0; color: var(--muted); font-size: 18px; line-height: 1.65; }
    .quick-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
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
    .button.secondary { border-color: var(--line); background: var(--surface); color: var(--text); }
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
      transition: border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease;
    }
    .card:hover {
      border-color: #b8c4d4;
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.07);
      transform: translateY(-1px);
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
    .doc-body table {
      width: 100%;
      margin: 18px 0;
      border-collapse: collapse;
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
      display: block;
      max-width: 100%;
      overflow-x: auto;
      white-space: nowrap;
    }
    .doc-body thead { background: var(--surface-2); }
    .doc-body th,
    .doc-body td {
      border-bottom: 1px solid var(--line);
      padding: 10px 12px;
      text-align: left;
      vertical-align: top;
    }
    .doc-body th {
      color: #334155;
      font-size: 13px;
      text-transform: uppercase;
    }
    .doc-body tr:last-child td { border-bottom: 0; }
    .command-modal {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: none;
      background: rgba(15, 23, 42, 0.42);
      padding: 64px 20px;
    }
    .command-modal.open { display: block; }
    .command-panel {
      width: min(720px, 100%);
      margin: 0 auto;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      box-shadow: 0 24px 80px rgba(15, 23, 42, 0.26);
      overflow: hidden;
    }
    .command-panel input {
      width: 100%;
      min-height: 54px;
      border: 0;
      border-bottom: 1px solid var(--line);
      padding: 0 16px;
      font: inherit;
      font-size: 16px;
      outline: none;
    }
    .command-results {
      max-height: 430px;
      overflow: auto;
      padding: 8px;
    }
    .command-result {
      display: block;
      border-radius: 8px;
      padding: 11px 12px;
      text-decoration: none;
    }
    .command-result:hover { background: var(--surface-2); }
    .command-result strong { display: block; font-size: 14px; }
    .command-result span { display: block; color: var(--muted); font-size: 12px; margin-top: 3px; }
    .footer { border-top: 1px solid var(--line); padding: 24px 0 34px; color: var(--muted); font-size: 13px; }
    @media (max-width: 1120px) {
      .layout { grid-template-columns: 240px minmax(0, 1fr); }
      .toc { display: none; }
    }
    @media (max-width: 820px) {
      .layout { grid-template-columns: 1fr; }
      .sidebar { position: static; }
      .cards { grid-template-columns: 1fr; }
      .search { flex-direction: column; }
      .topbar { align-items: flex-start; flex-direction: column; }
      .top-actions { width: 100%; align-items: stretch; flex-direction: column; }
      .search-trigger { width: 100%; }
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
      <div class="top-actions">
        <button class="search-trigger" type="button" data-open-search>
          <span>Search documentation</span>
          <span class="kbd">⌘K</span>
        </button>
        <nav class="external-nav" aria-label="External navigation">
        <a href="https://coreblow.com">Website</a>
        <a href="https://coreblow.com/corehub">CoreHub</a>
        <a href="https://github.com/coreblow/docs">GitHub</a>
      </nav>
      </div>
    </header>
    <nav class="product-nav" aria-label="Documentation navigation">
      ${topLinks}
    </nav>
    <main class="layout">
      ${sidebar}
      <section>
        ${content}
      </section>
      ${toc}
    </main>
    <footer class="footer">CoreBlow documentation is maintained in github.com/coreblow/docs.</footer>
  </div>
  <div class="command-modal" data-search-modal aria-hidden="true">
    <div class="command-panel" role="dialog" aria-label="Search documentation">
      <input data-search-input type="search" placeholder="Search CoreBlow docs" autocomplete="off" />
      <div class="command-results" data-search-results></div>
    </div>
  </div>
  <script type="application/json" id="docs-search-index">${escapeHtml(JSON.stringify(searchIndex))}</script>
  <script>
    const modal = document.querySelector("[data-search-modal]");
    const input = document.querySelector("[data-search-input]");
    const results = document.querySelector("[data-search-results]");
    const index = JSON.parse(document.querySelector("#docs-search-index").textContent);
    const openSearch = () => {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      input.value = "";
      renderResults(index.slice(0, 8));
      input.focus();
    };
    const closeSearch = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    };
    document.querySelectorAll("[data-open-search]").forEach((button) => button.addEventListener("click", openSearch));
    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
      if (event.key === "Escape") closeSearch();
    });
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeSearch();
    });
    input.addEventListener("input", () => {
      const terms = input.value.toLowerCase().split(/[^a-z0-9-]+/).filter(Boolean);
      if (!terms.length) {
        renderResults(index.slice(0, 8));
        return;
      }
      const matches = index
        .map((doc) => ({ doc, score: scoreDocClient(doc, terms) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || a.doc.route.localeCompare(b.doc.route))
        .slice(0, 12)
        .map((item) => item.doc);
      renderResults(matches);
    });
    function scoreDocClient(doc, terms) {
      const title = doc.title.toLowerCase();
      const haystack = [doc.title, doc.route, doc.path, doc.summary].join(" ").toLowerCase();
      return terms.reduce((score, term) => score + (title.includes(term) ? 10 : 0) + (doc.route.includes(term) ? 5 : 0) + (haystack.includes(term) ? 1 : 0), 0);
    }
    function renderResults(items) {
      results.innerHTML = items.length
        ? items.map((doc) => '<a class="command-result" href="' + doc.route + '"><strong>' + escapeHtmlClient(doc.title) + '</strong><span>' + escapeHtmlClient(doc.path) + '</span></a>').join("")
        : '<div class="command-result"><strong>No results</strong><span>Try a different query.</span></div>';
    }
    function escapeHtmlClient(value) {
      return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
    }
  </script>
</body>
</html>`;
}

function renderHome() {
  const featured = [
    findDoc("/start/quickstart"),
    findDoc("/install"),
    findDoc("/cli"),
    findDoc("/channels"),
    findDoc("/plugins"),
    findDoc("/gateway"),
    findDoc("/reference/cli-reference"),
  ].filter(Boolean);
  return `<div class="hero">
    <p class="eyebrow">Documentation</p>
    <h1>CoreBlow</h1>
    <p class="lead">Enterprise-grade documentation for installing, operating, extending, and securing CoreBlow across CLI, gateway, channels, plugins, providers, and platform deployments.</p>
    <div class="quick-actions">
      <a class="button" href="/start/quickstart">Get Started</a>
      <a class="button secondary" href="/install">Install</a>
      <a class="button secondary" href="/cli">CLI Reference</a>
    </div>
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

function renderSidebar(activeRoute) {
  const activeTab = findActiveTab(activeRoute);
  const groups = activeTab.groups
    .map((group) => {
      const links = group.pages
        .map(({ doc, label }) => `<a class="${isCurrentRoute(activeRoute, doc.route) ? "active" : ""}" href="${escapeAttr(doc.route)}">${escapeHtml(label)}</a>`)
        .join("");
      if (!links) return "";
      return `<div class="sidebar-group"><h2>${escapeHtml(group.title)}</h2>${links}</div>`;
    })
    .join("");
  return `<aside class="sidebar">${groups}</aside>`;
}

function buildNavTabs(config) {
  const configuredTabs = extractConfiguredTabs(config);
  const tabs = configuredTabs.map(normalizeNavTab).filter((tab) => tab.groups.length);
  if (tabs.length) return tabs;

  return [
    {
      label: "Docs",
      route: "/",
      groups: [
        {
          title: "Overview",
          pages: [
            navPage("index", "Home"),
            navPage("architecture", "Architecture"),
            navPage("configuration", "Configuration"),
          ].filter(Boolean),
        },
      ],
    },
  ];
}

function extractConfiguredTabs(config) {
  const navigation = config?.navigation;
  if (!navigation || typeof navigation !== "object") return [];
  if (Array.isArray(navigation.tabs)) return navigation.tabs;
  const languages = Array.isArray(navigation.languages) ? navigation.languages : [];
  const english = languages.find((item) => item?.language === "en") ?? languages[0];
  return Array.isArray(english?.tabs) ? english.tabs : [];
}

function normalizeNavTab(tab) {
  const groups = (Array.isArray(tab?.groups) ? tab.groups : [])
    .map((group) => ({
      title: String(group?.group ?? group?.title ?? "Docs"),
      pages: normalizeNavPages(group?.pages),
    }))
    .filter((group) => group.pages.length);
  const route = groups[0]?.pages[0]?.doc.route ?? "/";
  return {
    label: String(tab?.tab ?? tab?.label ?? "Docs"),
    route,
    groups,
  };
}

function normalizeNavPages(pages) {
  if (!Array.isArray(pages)) return [];
  return pages
    .flatMap((page) => {
      if (typeof page === "string") return [navPage(page)];
      if (!page || typeof page !== "object") return [];
      if (typeof page.page === "string") return [navPage(page.page, page.label ?? page.title)];
      if (Array.isArray(page.pages)) return normalizeNavPages(page.pages);
      return [];
    })
    .filter(Boolean);
}

function navPage(page, label) {
  const route = routeFromConfigPage(page);
  const doc = findDoc(route);
  if (!doc) return null;
  return { doc, label: label ? String(label) : doc.title };
}

function routeFromConfigPage(page) {
  let value = String(page ?? "").trim();
  value = value.replace(/^docs\//, "").replace(/\.(md|mdx)$/i, "");
  if (value === "index") return "/";
  if (value.endsWith("/index")) value = value.slice(0, -"/index".length);
  return normalizeRoute(`/${value}`);
}

function findActiveTab(activeRoute) {
  return (
    navTabs.find((tab) =>
      tab.groups.some((group) => group.pages.some(({ doc }) => isActiveRoute(activeRoute, doc.route))),
    ) ?? navTabs[0]
  );
}

function renderToc(items) {
  if (!items.length) {
    return `<aside class="toc"><h2>On this page</h2><a href="#top">Overview</a></aside>`;
  }
  return `<aside class="toc"><h2>On this page</h2>${items
    .map((item) => `<a href="#${escapeAttr(item.id)}">${escapeHtml(item.title)}</a>`)
    .join("")}</aside>`;
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
    <div class="doc-body" id="top">${markdownToHtml(doc.content, { anchors: true })}</div>
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

function markdownToHtml(markdown, options = {}) {
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

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
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

    if (isTableStart(lines, index)) {
      flushParagraph();
      closeList();
      const tableLines = [line, lines[index + 1]];
      index += 2;
      while (index < lines.length && isTableRow(lines[index])) {
        tableLines.push(lines[index]);
        index += 1;
      }
      index -= 1;
      html.push(renderTable(tableLines));
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      const id = options.anchors ? ` id="${escapeAttr(slugify(heading[2]))}"` : "";
      html.push(`<h${level}${id}>${renderInline(heading[2])}</h${level}>`);
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

function isTableStart(lines, index) {
  return isTableRow(lines[index]) && isTableSeparator(lines[index + 1]);
}

function isTableRow(line) {
  return typeof line === "string" && /^\s*\|.+\|\s*$/.test(line);
}

function isTableSeparator(line) {
  if (!isTableRow(line)) return false;
  return splitTableRow(line).every((cell) => /^:?-{3,}:?$/.test(cell.trim()));
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

function renderTable(lines) {
  const headers = splitTableRow(lines[0]);
  const rows = lines.slice(2).map(splitTableRow);
  return `<table>
<thead><tr>${headers.map((header) => `<th>${renderInline(header)}</th>`).join("")}</tr></thead>
<tbody>
${rows
  .map((row) => `<tr>${headers.map((_, index) => `<td>${renderInline(row[index] ?? "")}</td>`).join("")}</tr>`)
  .join("\n")}
</tbody>
</table>`;
}

function extractHeadings(markdown) {
  return markdown
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.match(/^(#{2,3})\s+(.+)$/))
    .filter(Boolean)
    .map((match) => ({
      id: slugify(match[2]),
      title: match[2].replace(/[#`*_]/g, "").trim(),
    }));
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
}

function isActiveRoute(activeRoute, candidate) {
  if (!activeRoute) return false;
  if (activeRoute === candidate) return true;
  return candidate !== "/" && activeRoute.startsWith(`${candidate}/`);
}

function isCurrentRoute(activeRoute, candidate) {
  return activeRoute === candidate;
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
