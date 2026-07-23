/**
 * Safe Markdown → HTML pipeline for content dialogs.
 * Treats repo Markdown as untrusted: parse then sanitize before any
 * dangerouslySetInnerHTML sink.
 */

import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

/** Tags/attrs allowed for terminal-prose content (lists get class enhancement). */
const PURIFY_CONFIG = {
  USE_PROFILES: { html: true },
  ALLOWED_TAGS: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "br",
    "hr",
    "ul",
    "ol",
    "li",
    "strong",
    "em",
    "b",
    "i",
    "u",
    "s",
    "del",
    "code",
    "pre",
    "blockquote",
    "a",
    "span",
    "div",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "img",
  ],
  ALLOWED_ATTR: ["href", "title", "target", "rel", "class", "src", "alt", "width", "height"],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ["target", "rel"],
} as const;

function looksLikeHtml(content: string): boolean {
  const trimmed = content.trim();
  return /^<[a-z][\s\S]*>/i.test(trimmed);
}

/**
 * Terminal list styling — runs only on already-sanitized HTML so injected
 * classes cannot reintroduce dangerous tags.
 */
export function enhanceListMarkup(html: string): string {
  return html
    .replace(
      /<li>([\s\S]*?)<\/li>/g,
      '<li class="flex items-start gap-2 my-1.5"><span class="text-primary shrink-0 mt-0.5">▸</span><span class="text-sm">$1</span></li>',
    )
    .replace(/<ul>([\s\S]*?)<\/ul>/g, '<ul class="space-y-1 my-3 list-none pl-0">$1</ul>')
    .replace(/<ol>([\s\S]*?)<\/ol>/g, '<ol class="space-y-1 my-3 list-none pl-0">$1</ol>');
}

/**
 * Force safe external-link defaults on every anchor.
 * Untrusted HTML may ship weak rel values (e.g. rel="opener") — always overwrite.
 */
function hardenLinks(html: string): string {
  return html.replace(/<a\b([^>]*)>/gi, (_match, attrs: string) => {
    let next = attrs
      // Strip any author-controlled rel/target so we cannot leave opener / empty rel.
      .replace(/\s*\brel\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/\s*\btarget\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");

    next += ' rel="noopener noreferrer"';

    // Prefer new-tab isolation for absolute http(s) destinations.
    if (/\bhref\s*=\s*["']https?:/i.test(next)) {
      next += ' target="_blank"';
    }

    return `<a${next}>`;
  });
}

/**
 * Parse Markdown (or pass through HTML), sanitize with DOMPurify, enhance lists.
 * This is the sole HTML production path for content-dialog.
 */
export function renderSafeMarkdown(content: string): string {
  const source = content || "";
  const rawHtml = looksLikeHtml(source)
    ? source
    : (marked.parse(source, { async: false }) as string);

  const clean = String(DOMPurify.sanitize(rawHtml, PURIFY_CONFIG as never));
  return enhanceListMarkup(hardenLinks(clean));
}
