export type StringOrStringArray = string | string[] | undefined;

export interface PublicLogFilters {
  projectId?: string; // set by controller param (or 'all')
  fromIso?: string; // inclusive
  toIso?: string; // exclusive
  routes?: string[]; // exact match on template (e.g. '/public/list/:moduleSlug')
  methods?: string[]; // 'GET','POST',...
  statusCodes?: number[]; // exact codes
  origins?: string[]; // exact origin(s)
  ips?: string[]; // exact ip(s)
  ok?: boolean; // true/false
  languages?: string[]; // 'de-DE', 'en-US',...
  pathLike?: string; // ILIKE %...%
  userAgentLike?: string; // ILIKE %...%
  minDurationMs?: number;
  maxDurationMs?: number;
  minResponseBytes?: number; // from socket delta
  maxResponseBytes?: number;
  contentEncodings?: string[]; // 'gzip','br',...
  controllers?: string[]; // controller name(s)
  handlers?: string[]; // handler name(s)
  requestId?: string; // exact
}

export function parseCsv(v: StringOrStringArray): string[] | undefined {
  if (v == null) return undefined;
  const list = Array.isArray(v) ? v : String(v).split(',');
  return list.map(s => s.trim()).filter(Boolean);
}

export function parseIntCsv(v: StringOrStringArray): number[] | undefined {
  const s = parseCsv(v);
  if (!s?.length) return undefined;
  const nums = s.map(x => Number(x)).filter(n => Number.isFinite(n));
  return nums.length ? nums : undefined;
}

export function parseBool(v?: string): boolean | undefined {
  if (v == null) return undefined;
  const t = String(v).toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(t)) return true;
  if (['false', '0', 'no', 'off'].includes(t)) return false;
  return undefined;
}

export function isoOrDefault(date?: string, dfltMsOffset?: number): string {
  if (date && !Number.isNaN(Date.parse(date)))
    return new Date(date).toISOString();
  const base = new Date(Date.now() + (dfltMsOffset ?? 0));
  return base.toISOString();
}
