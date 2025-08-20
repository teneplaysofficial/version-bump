import { run } from '../src';
import { PreReleaseTypes, ReleaseTypes } from '../src/types';

const args = process.argv.slice(2);

function getArgValue(flag: string): string | null {
  const index = args.indexOf(flag);
  return index !== -1 && args[index + 1] ? args[index + 1] : null;
}

function parseBooleanFlag(
  flagName: string,
  defaultValue: boolean = false,
): boolean {
  return args.includes(flagName) ? !defaultValue : defaultValue;
}

const type = (getArgValue('--type') as ReleaseTypes) || 'patch';
const preRelease = (getArgValue('--preRelease') as PreReleaseTypes) || null;
const message = getArgValue('-m') || 'chore: release v${version}';

const tag = parseBooleanFlag('--tag');
const fullTag = parseBooleanFlag('--fullTag', true);
const major = parseBooleanFlag('--major');
const minor = parseBooleanFlag('--minor');
const dryRun = parseBooleanFlag('--dry-run');

const version = run(type, preRelease, tag, {
  commitMessage: message,
  fullTag,
  major,
  minor,
  dryRun,
});

if (version) {
  console.log('Successfully released version:', version);
} else {
  console.error('Release failed.');
  process.exit(1);
}
