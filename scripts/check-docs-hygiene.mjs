#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const docsJsonPath = path.join(rootDir, "docs", "docs.json");
const docsDir = path.join(rootDir, "docs");

console.log("[docs-hygiene] Starting documentation hygiene verification...");

let errors = [];

// 1. Verify docs.json exists and parse it
if (!fs.existsSync(docsJsonPath)) {
  console.error(`[docs-hygiene] ERROR: docs.json not found at ${docsJsonPath}`);
  process.exit(1);
}

const docsJson = JSON.parse(fs.readFileSync(docsJsonPath, "utf8"));

// Helper to collect all pages from navigation
function collectPages(obj) {
  let pages = [];
  if (Array.isArray(obj)) {
    for (const item of obj) {
      pages = pages.concat(collectPages(item));
    }
  } else if (obj && typeof obj === "object") {
    if (typeof obj.page === "string") {
      pages.push(obj.page);
    }
    for (const key of Object.keys(obj)) {
      if (key !== "page") {
        pages = pages.concat(collectPages(obj[key]));
      }
    }
  }
  return pages;
}

const navigationPages = collectPages(docsJson.navigation);
console.log(`[docs-hygiene] Found ${navigationPages.length} navigation entries in docs.json.`);

// 2. Check each page exists on disk
let missingPages = 0;
for (const page of navigationPages) {
  const candidates = [
    path.join(docsDir, `${page}.md`),
    path.join(docsDir, `${page}.mdx`),
    path.join(docsDir, page, "index.md"),
    path.join(docsDir, page, "index.mdx"),
  ];
  const exists = candidates.some((c) => fs.existsSync(c));
  if (!exists) {
    errors.push(`Missing docs.json target page: ${page} (searched in ${candidates[0]})`);
    missingPages++;
  }
}

if (missingPages > 0) {
  console.error(`[docs-hygiene] ✗ ${missingPages} pages referenced in docs.json are missing on disk!`);
} else {
  console.log(`[docs-hygiene] ✓ All ${navigationPages.length} navigation targets exist on disk.`);
}

// 3. Scan for forbidden competitor names and hardcoded local home paths
const forbiddenPatterns = [
  { name: "openclaw", regex: /\bopenclaw\b/i },
  { name: "clawhub", regex: /\bclawhub\b/i },
  { name: "clawbench", regex: /\bclawbench\b/i },
  { name: "clawgo", regex: /\bclawgo\b/i },
  { name: "hardcoded personal home path", regex: /((\/Users\/[a-zA-Z0-9_-]+)|(\/home\/(?!node\b)[a-zA-Z0-9_-]+)|([A-Z]:\\Users\\[a-zA-Z0-9_-]+))/ },
];

function scanFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === ".wrangler") {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(scanFiles(fullPath));
    } else if (entry.isFile() && /\.(md|mdx|json|js|mjs|html)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const allDocsFiles = scanFiles(docsDir);
console.log(`[docs-hygiene] Scanning ${allDocsFiles.length} documentation files for hygiene issues...`);

let forbiddenCount = 0;
for (const file of allDocsFiles) {
  const relPath = path.relative(rootDir, file);
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const pattern of forbiddenPatterns) {
      if (pattern.regex.test(line)) {
        errors.push(`${relPath}:${i + 1}: Found forbidden ${pattern.name}: "${line.trim()}"`);
        forbiddenCount++;
      }
    }
  }
}

if (errors.length > 0) {
  console.error("\n[docs-hygiene] FAILED with errors:");
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log(`[docs-hygiene] ✓ Zero competitor names, zero hardcoded local paths, zero broken navigation links.`);
console.log("[docs-hygiene] All documentation hygiene checks passed successfully.");
