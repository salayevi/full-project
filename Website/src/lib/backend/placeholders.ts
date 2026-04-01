type ContentPlaceholderOptions = {
  title: string;
  subtitle?: string;
  background?: string;
  foreground?: string;
  accent?: string;
};

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeColor(value: string | undefined, fallback: string) {
  if (!value || value.includes("var(")) {
    return fallback;
  }

  return value;
}

export function createContentPlaceholderDataUri({
  title,
  subtitle,
  background = "#f4ebf0",
  foreground = "#20161b",
  accent = "#d85ca7",
}: ContentPlaceholderOptions) {
  const safeTitle = escapeSvgText((title || "Content").slice(0, 48));
  const safeSubtitle = subtitle ? escapeSvgText(subtitle.slice(0, 64)) : "";
  const base = normalizeColor(background, "#f4ebf0");
  const text = normalizeColor(foreground, "#20161b");
  const accentColor = normalizeColor(accent, "#d85ca7");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="${safeTitle}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${base}" />
          <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.22" />
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)" />
      <circle cx="960" cy="180" r="180" fill="${accentColor}" fill-opacity="0.18" />
      <circle cx="210" cy="760" r="150" fill="${text}" fill-opacity="0.08" />
      <rect x="76" y="116" width="264" height="8" rx="4" fill="${accentColor}" fill-opacity="0.65" />
      <text x="76" y="410" fill="${text}" font-family="Arial, Helvetica, sans-serif" font-size="112" font-weight="700">${safeTitle}</text>
      ${safeSubtitle ? `<text x="76" y="500" fill="${text}" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="500" opacity="0.76">${safeSubtitle}</text>` : ""}
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
