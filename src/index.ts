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

  if (preRelease) {
    newVersion = semver.inc(version, type, preRelease);
  } else {
    newVersion = semver.inc(version, type);
  }

  return newVersion;
}

export function formatCommitMessage(template: string, version: string): string {
  return template
    .replaceAll('${version}', version)
    .replaceAll('${major}', semver.major(version).toString())
    .replaceAll('${minor}', semver.minor(version).toString())
    .replaceAll('${patch}', semver.patch(version).toString());
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
    commitMessage: 'chore: release v${version}',
  },
): void {
  if (!version) return;

  if (!semver.valid(version)) throw new Error(`Invalid version: ${version}`);

  const data = semver.parse(version);
  if (!data) return;

  const message = formatCommitMessage(options.commitMessage, data.version);

  const isPrerelease = data.prerelease.length > 0;

  if (isPrerelease && (options.major || options.minor)) {
    console.warn(
      'Cannot create major and minor tags for a pre-release version. Only full tag will be created. ',
    );
  } else {
    if (options.major) {
      spawnSync('git', ['tag', '-f', `v${data?.major}`]);
    }

    if (options.minor) {
      spawnSync('git', ['tag', '-f', `v${data?.major}.${data?.minor}`]);
    }
  }

  if (options.fullTag) {
    spawnSync('git', ['tag', '-a', `v${data?.version}`, '-m', message]);
  }
  spawnSync('git', ['push', '--tags']);
}

/**
 *
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
  shouldCreateGitTag: boolean = false,
  options?: GitConfig,
) {
  const files = [VersionFiles.npm, VersionFiles.jsr, VersionFiles.deno];

  for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      console.log('Current version in file', file + ':', content.version);

      const newVersion = versionBump(content.version, type, preRelease);

      if (newVersion) {
        console.log('New version in file', file + ':', newVersion);
        content.version = newVersion;
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
        console.log(`Updated ${file} to version ${newVersion}`);
      }
    }
  }

  if (shouldCreateGitTag) {
    const filePath = path.join(
      process.cwd(),
      VersionFiles.npm || VersionFiles.jsr || VersionFiles.deno,
    );
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      console.log('Creating git tag for version:', content.version);
      createGitTag(content.version, options);
    }
  }
}
