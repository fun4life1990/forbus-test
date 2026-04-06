const UNIT_TO_MS: Record<string, number> = {
  s: 1_000,
  m: 60 * 1_000,
  h: 60 * 60 * 1_000,
  d: 24 * 60 * 60 * 1_000,
  w: 7 * 24 * 60 * 60 * 1_000,
};

/**
 * Converts a JWT-compatible expiresIn value to milliseconds.
 * Accepts plain numbers (treated as seconds) or strings like "60m", "24h", "7d", "3600".
 */
export function parseTtlToMs(ttl: string | number): number {
  if (typeof ttl === 'number') {
    return ttl * 1_000;
  }

  const asNumber = Number(ttl);
  if (!isNaN(asNumber)) {
    return asNumber * 1_000;
  }

  const match = ttl.match(/^(\d+(?:\.\d+)?)(s|m|h|d|w)$/);
  if (!match) {
    throw new Error(
      `Invalid TTL format: "${ttl}". Expected a number or a string like "60m", "24h", "7d".`,
    );
  }

  return parseFloat(match[1]) * UNIT_TO_MS[match[2]];
}
