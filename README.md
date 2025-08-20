<div align="center">

# version bump

_Update project version and create tag easily_

</div>

[![Build](https://github.com/teneplaysofficial/version-bump/actions/workflows/publish.yml/badge.svg)](https://github.com/TenEplaysOfficial/version-bump)
[![tests](https://github.com/teneplaysofficial/version-bump/actions/workflows/tests.yml/badge.svg)](https://github.com/TenEplaysOfficial/version-bump)
[![npm version](https://img.shields.io/npm/v/@tenedev/version-bump.svg)](https://www.npmjs.com/package/@tenedev/version-bump)
[![JSR](https://jsr.io/badges/@tene/version-bump)](https://jsr.io/@tene/version-bump)
[![JSR Score](https://jsr.io/badges/@tene/version-bump/score)](https://jsr.io/@tene/version-bump)
[![License](https://img.shields.io/github/license/TenEplaysOfficial/version-bump.svg)](https://github.com/TenEplaysOfficial/version-bump/blob/main/LICENSE)

## Overview

A lightweight Node.js utility to bump semantic versions in manifest files (`package.json`, `jsr.json`,`deno.json`) and optionally create Git tags for releases.

## Installation

```sh
# via npm
npm install @tenedev/version-bump

# via yarn
yarn add @tenedev/version-bump

# via pnpm
pnpm add @tenedev/version-bump

# via bun
bun add @tenedev/version-bump

# via Deno (using JSR)
deno add jsr:@tene/version-bump

# via JSR
npx jsr add @tene/version-bump
```

## Usage

### CLI

Add a script in your `package.json`:

```json
"scripts": {
    "release": "npx @tene/version-bump"
}
```

Then run:

```sh
npm run release --type minor --tag --fullTag
```

#### Options

| Flag           | Type    | Default                         | Description                                                                               |
| -------------- | ------- | ------------------------------- | ----------------------------------------------------------------------------------------- |
| `--type`       | string  | `"patch"`                       | Release type: `major`, `minor`, `patch`, `premajor`, `preminor`, `prepatch`, `prerelease` |
| `--preRelease` | string  | `null`                          | Pre-release identifier: `alpha`, `beta`, `rc`, `next`, etc.                               |
| `-m`           | string  | `"chore: release v\${version}"` | Commit message template (`\${version}`, `\${major}`, `\${minor}`, etc. supported)         |
| `--tag`        | boolean | `false`                         | Create Git tag(s) after bumping                                                           |
| `--fullTag`    | boolean | `true`                          | Create full version tag (`v1.2.3`)                                                        |
| `--major`      | boolean | `false`                         | Create `v1` tag                                                                           |
| `--minor`      | boolean | `false`                         | Create `v1.2` tag                                                                         |
| `--dry-run`    | boolean | `false`                         | Print what would happen without changing files or running Git commands                    |

### Examples

#### 1. Bump a patch version (default)

```bash
npm run release
# from 1.2.3 → 1.2.4
```

#### 2. Bump a minor version and create tags

```bash
npm run release --type minor --tag --major --minor
# from 1.2.3 → 1.3.0
# creates tags: v1, v1.3, v1.3.0
```

#### 3. Create a beta prerelease

```bash
npm run release --type prerelease --preRelease beta --tag
# from 1.2.3 → 1.2.4-beta.0
# creates tag: v1.2.4-beta.0
```

#### 4. Dry run (no changes, just logs)

```bash
npm run release --type minor --dry-run
```

## Programmatic API

You can also use it directly in your Node.js scripts:

```ts
import { run, versionBump, formatCommitMessage } from 'version-bump-tool';

// bump only
const next = versionBump('1.2.3', 'minor');
// → "1.3.0"

// format commit messages
const msg = formatCommitMessage('release: v${version}', '1.3.0');
// → "release: v1.3.0"

// full run (bump + git tags)
const bumped = run('minor', undefined, true, {
  commitMessage: 'release: v${version}',
  fullTag: true,
  major: true,
  minor: true,
});
// updates files + creates Git tags
```

## Supported Files

- `package.json` (npm)
- `jsr.json` (JSR packages)
- `deno.json` (Deno)

## License

Released under the [Apache-2.0](LICENSE) License.
