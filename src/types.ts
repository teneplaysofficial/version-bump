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
  | 'experimental'
  | null;

export interface GitConfig {
  /**
   * Create the full version tag.
   *
   * @example
   * `v1.2.3`
   *
   * @default true
   */
  fullTag: boolean;
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
   * Commit message
   *
   * @default "chore: release v1.0.0"
   */
  commitMessage: string;
}

export enum VersionFiles {
  npm = 'package.json',
  jsr = 'jsr.json',
  deno = 'deno.json',
  lock = 'package-lock.json',
}
