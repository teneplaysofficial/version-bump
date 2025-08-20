import test from 'node:test';
import assert from 'node:assert';
import { formatCommitMessage, versionBump } from '../src';

test.describe('formatCommitMessage', async () => {
  test('replaces ${version} with the full version string', () => {
    const version = '1.2.3';
    const message = 'Release version ${version}';
    const formatted = formatCommitMessage(message, version);

    assert.strictEqual(formatted, 'Release version 1.2.3');
  });

  test('replaces ${major} with the major number', () => {
    const version = '1.2.3';
    const message = 'Release major version ${major}';
    const formatted = formatCommitMessage(message, version);

    assert.strictEqual(formatted, 'Release major version 1');
  });

  test('replaces ${minor} with the minor number', () => {
    const version = '1.2.3';
    const message = 'Release minor version ${minor}';
    const formatted = formatCommitMessage(message, version);

    assert.strictEqual(formatted, 'Release minor version 2');
  });

  test('replaces ${patch} with the patch number', () => {
    const version = '1.2.3';
    const message = 'Release patch version ${patch}';
    const formatted = formatCommitMessage(message, version);

    assert.strictEqual(formatted, 'Release patch version 3');
  });

  test('replaces ${prerelease} with numeric identifier', () => {
    const version = '1.2.3-50';
    const message = 'Release prerelease version ${prerelease}';
    const formatted = formatCommitMessage(message, version);

    assert.strictEqual(formatted, 'Release prerelease version 50');
  });

  test('replaces ${prerelease} with tag + number', () => {
    const version = '1.2.3-beta.50';
    const message = 'Release prerelease version ${prerelease}';
    const formatted = formatCommitMessage(message, version);

    assert.strictEqual(formatted, 'Release prerelease version beta.50');
  });

  test('replaces ${prerelease} with empty string if version has no prerelease', () => {
    const version = '1.2.3';
    const message = 'Release prerelease version ${prerelease}';
    const formatted = formatCommitMessage(message, version);

    assert.strictEqual(formatted, 'Release prerelease version ');
  });
});

test.describe('versionBump', () => {
  test('bumps patch version by default', () => {
    const version = '1.2.3';
    assert.strictEqual(versionBump(version), '1.2.4');
  });

  test('bumps minor version', () => {
    const version = '1.2.3';
    assert.strictEqual(versionBump(version, 'minor'), '1.3.0');
  });

  test('bumps major version', () => {
    const version = '1.2.3';
    assert.strictEqual(versionBump(version, 'major'), '2.0.0');
  });

  test('bumps prerelease patch version', () => {
    const version = '1.2.3';
    assert.strictEqual(versionBump(version, 'prepatch'), '1.2.4-0');
  });

  test('bumps prerelease minor version', () => {
    const version = '1.2.3';
    assert.strictEqual(versionBump(version, 'preminor'), '1.3.0-0');
  });

  test('bumps prerelease major version', () => {
    const version = '1.2.3';
    assert.strictEqual(versionBump(version, 'premajor'), '2.0.0-0');
  });

  test('bumps prerelease version', () => {
    const version = '1.2.3';
    assert.strictEqual(versionBump(version, 'prerelease'), '1.2.4-0');
  });

  test('throws for invalid version', () => {
    assert.throws(
      () => versionBump('not-a-version'),
      /Invalid version: not-a-version/,
    );
  });
});
