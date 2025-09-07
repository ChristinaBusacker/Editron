/**
 * Utilities to localize a value payload and flatten localized fields.
 * - Detects locale maps like { "de-DE": "...", "en-US": "..." } via heuristic.
 * - Picks `lang` first, then `fallback`. If neither exists => returns null.
 * - Traverses arrays/objects recursively and flattens localized leaves.
 */

const LOCALE_KEY_RE = /^[a-z]{2}(?:-[A-Z]{2})?$/; // e.g. de, de-DE, en-US

function isLocaleKey(k: string): boolean {
  return LOCALE_KEY_RE.test(k);
}

export function isLocaleMap(obj: unknown): obj is Record<string, unknown> {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  const keys = Object.keys(obj);
  if (!keys.length) return false;
  return keys.every(isLocaleKey);
}

/**
 * Returns the localized scalar for a locale map or null if unavailable.
 */
export function pickFromLocaleMap(
  map: Record<string, unknown>,
  lang?: string | null,
  fallback?: string | null,
): unknown {
  if (lang && map[lang] != null) return map[lang];
  if (fallback && map[fallback] != null) return map[fallback];
  return null;
}

/**
 * Recursively localize and flatten a payload:
 * - For locale maps: returns scalar (lang->fallback->null)
 * - For arrays: localizes each element
 * - For plain objects: localizes each property
 * - For primitives: returns as-is
 */
export function localizeAndFlatten(
  value: unknown,
  lang?: string | null,
  fallback?: string | null,
): any {
  if (value == null) return null;

  if (Array.isArray(value)) {
    return value.map(v => localizeAndFlatten(v, lang, fallback));
  }

  if (typeof value === 'object') {
    // Locale map? Return the picked scalar (may be null)
    if (isLocaleMap(value)) {
      return pickFromLocaleMap(
        value as Record<string, unknown>,
        lang,
        fallback,
      );
    }

    // Plain object: recurse properties
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = localizeAndFlatten(v, lang, fallback);
    }
    return out;
  }

  // Primitive
  return value;
}
