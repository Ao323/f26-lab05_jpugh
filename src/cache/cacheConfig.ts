/** Tuning knobs for the query cache. */
export interface CacheConfig {
  enabled: boolean;
  ttlMillis: number;
  maxEntries: number;
}

export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  enabled: true,
  ttlMillis: 30_000,
  maxEntries: 128,
};

/** Returns a copy of the config with a different entry lifetime. */
export function withTtl(config: CacheConfig, ttlMillis: number): CacheConfig {
  return { ...config, ttlMillis };
}

/** Returns a copy of the config with caching switched off. */
export function disabled(config: CacheConfig): CacheConfig {
  return { ...config, enabled: false };
}
