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

/**
 * Configuration options for Git tagging.
 */
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
  /**
   * Run in dry mode without executing Git commands.
   */
  dryRun?: boolean;
}

/**
 * Supported manifest files for version bumping.
 */
export enum VersionFiles {
  /**
   * npm manifest
   */
  npm = 'package.json',
  /**
   * JSR package manifest
   */
  jsr = 'jsr.json',
  /**
   * Deno manifest
   */
  deno = 'deno.json',
  /**
   * npm lockfile
   */
  lock = 'package-lock.json',
}
