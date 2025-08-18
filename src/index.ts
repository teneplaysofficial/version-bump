import { GitConfig, PreReleaseTypes, ReleaseTypes } from './types';
import semver from 'semver';
import { spawnSync } from 'child_process';

export function versionBump(
  /**
   * The current version string.
   *
   * @remarks Must be a valid semantic version (e.g., `"1.2.3"`).
   */
  version: string,
  /**
   * The type of release to perform.
   *
   * @default `"patch"`
   */
  type: ReleaseTypes = 'patch',
  /**
   * The prerelease identifier to use (if applicable).
   *
   * @example
   * `"beta"` → produces `1.2.4-beta.0`
   */
  preRelease?: PreReleaseTypes,
) {
  let newVersion: string | null = null;

  if (!version) return;

  if (!semver.valid(version)) throw new Error(`Invalid version: ${version}`);

  newVersion = semver.inc(version, type, preRelease);

  return newVersion;
}

export function createGitTag(
  /**
   * The current version string.
   *
   * @remarks Must be a valid semantic version (e.g., `"1.2.3"`).
   */
  version: string,
  /**
   * Configuration for which tags to create
   */
  options: GitConfig = {
    fullTag: true,
  },
) {}
