import {
  GitConfig,
  PreReleaseTypes,
  ReleaseTypes,
  VersionFiles,
} from './types';
import semver from 'semver';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

/**
 * Bumps a given semantic version according to the specified release type.
 *
 * @returns The new version string, or `null` if bumping fails.
 *
 * @example
 * ```ts
 * versionBump("1.2.3", "minor"); // "1.3.0"
 * versionBump("1.2.3", "prerelease", "beta"); // "1.2.4-beta.0"
 * ```
 *
 * @throws Will throw if the version is invalid.
 */
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
): string | null | undefined {
  let newVersion: string | null = null;

  if (!version) return;

  if (!semver.valid(version)) throw new Error(`Invalid version: ${version}`);

  if (preRelease) {
    newVersion = semver.inc(version, type, preRelease);
  } else {
    newVersion = semver.inc(version, type);
  }

  return newVersion;
}

/**
 * Formats a commit message template by replacing placeholders with version values.
 *
 * @returns The formatted commit message.
 *
 * @example
 * ```ts
 * formatCommitMessage("chore: release v${version}", "1.2.3");
 * // "chore: release v1.2.3"
 * ```
 */
export function formatCommitMessage(
  /**
   * A template string containing placeholders like `${version}`, `${major}`, etc.
   */
  template: string,
  /**
   * The version string to interpolate values from.
   */
  version: string,
): string {
  return template
    .replaceAll('${version}', version)
    .replaceAll('${major}', semver.major(version).toString())
    .replaceAll('${minor}', semver.minor(version).toString())
    .replaceAll('${patch}', semver.patch(version).toString())
    .replaceAll(
      '${prerelease}',
      semver.prerelease(version)?.join('.').toString() || '',
    );
}

/**
 * Creates Git tags for a given version according to the provided configuration.
 *
 * @remarks
 * - Always creates a full version tag if `fullTag` is enabled.
 * - Optionally creates major-only (`v1`) or major.minor (`v1.2`) tags.
 * - Skips major/minor tags if the version is a prerelease.
 *
 * @throws Will throw if the version is invalid.
 */
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
    commitMessage: 'chore: release v${version}',
  },
): void {
  if (!semver.valid(version)) throw new Error(`Invalid version: ${version}`);

  const data = semver.parse(version);
  if (!data) return;

  const message = formatCommitMessage(options.commitMessage, data.version);

  const isPrerelease = data.prerelease.length > 0;

  if (!options.dryRun) {
    spawnSync('git', ['add', '-A'], { stdio: 'inherit' });
    spawnSync('git', ['commit', '-m', message], {
      stdio: 'inherit',
    });
  }

  if (isPrerelease && (options.major || options.minor)) {
    console.warn(
      'Cannot create major and minor tags for a pre-release version. Only full tag will be created. ',
    );
  } else {
    if (options.major && !isPrerelease) {
      if (options.dryRun) console.log(`[DRY] git tag -f v${data.major}`);
      else spawnSync('git', ['tag', '-f', `v${data?.major}`]);
    }

    if (options.minor && !isPrerelease) {
      if (options.dryRun)
        console.log(`[DRY] git tag -f v${data.major}.${data.minor}`);
      else spawnSync('git', ['tag', '-f', `v${data?.major}.${data?.minor}`]);
    }
  }

  if (options.fullTag) {
    if (options.dryRun)
      console.log(`[DRY] git tag -a v${data.version} -m "${message}"`);
    else spawnSync('git', ['tag', '-a', `v${data?.version}`, '-m', message]);
  }

  if (!options.dryRun) {
    spawnSync('git', ['push'], { stdio: 'inherit' });
    spawnSync('git', ['push', '--tags'], { stdio: 'inherit' });
  }
}

/**
 * Runs the version bump process across supported manifest files (`package.json`, `jsr.json`, `deno.json`).
 *
 * @returns The new bumped version if updated, otherwise `undefined`.
 *
 * @example
 * ```ts
 * run("minor", undefined, true, { fullTag: true, commitMessage: "release: v${version}" });
 * ```
 */
export function run(
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
  /**
   * Whether to create Git tags after bumping.
   */
  shouldCreateGitTag: boolean = false,
  /**
   * Additional Git tagging options.
   */
  options?: GitConfig,
): string | undefined {
  const files = [VersionFiles.npm, VersionFiles.jsr, VersionFiles.deno];

  let bumpedVersion: string | undefined;

  for (const file of files) {
    const filePath = path.join(process.cwd(), file);

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) continue;

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const currentVersion = content.version;

    console.log('Current version in file', file + ':', currentVersion);

    const newVersion = versionBump(content.version, type, preRelease);

    if (!newVersion) continue;

    if (options?.dryRun) {
      console.log(`Dry run: would update ${file} to version ${newVersion}`);
      continue;
    }

    content.version = newVersion;
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
    console.log(`Updated ${file} to version ${newVersion}`);

    bumpedVersion = newVersion;
  }

  if (shouldCreateGitTag && bumpedVersion) {
    console.log('Creating git tag for version:', bumpedVersion);
    createGitTag(bumpedVersion, options);
  }

  return bumpedVersion;
}
