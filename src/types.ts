/**
 * Supported release types for semantic versioning.
 */
export type ReleaseTypes =
  | 'major'
  | 'premajor'
  | 'minor'
  | 'preminor'
  | 'patch'
  | 'prepatch'
  | 'prerelease';

/**
 * Supported prerelease identifiers.
 */
export type PreReleaseTypes =
  | 'alpha'
  | 'beta'
  | 'rc'
  | 'dev'
  | 'next'
  | 'preview'
  | 'canary'
  | 'nightly'
  | 'test'
  | 'experimental';

export interface GitConfig {
  /**
   * Create the full version tag.
   *
   * @example
   * `v1.2.3`
   *
   * @defaultValue `true`
   */
  fullTag?: boolean;
  /**
   * Create a major-only tag.
   *
   * @example
   * `v1`
   */
  major?: boolean;
  /**
   * Create a major.minor tag.
   *
   * @example
   * `v1.2`
   */
  minor?: boolean;
  /**
   * Force push tags even if they already exist remotely.
   */
  forcePush?: boolean;
}
