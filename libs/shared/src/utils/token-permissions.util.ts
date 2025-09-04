/**
 * Simple permission matcher with wildcard support:
 * - Exact match: "module:action"
 * - Module wildcard: "module:*"
 * - Global wildcard: "*"
 */
export function hasAllRequiredPermissions(
  tokenPerms: readonly string[] | undefined | null,
  required: readonly string[],
): boolean {
  if (!required?.length) return true;
  const set = new Set((tokenPerms ?? []).map(p => p.trim()));

  return required.every(need => {
    if (set.has('*') || set.has(need)) return true;

    // support "module:*"
    const [mod, act] = need.split(':', 2);
    if (mod && set.has(`${mod}:*`)) return true;

    return false;
  });
}
