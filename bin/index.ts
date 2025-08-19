import { run } from '../src';
import { PreReleaseTypes, ReleaseTypes } from '../src/types';

const args = process.argv.slice(2);

function parseBooleanFlag(
  flagName: string,
  defaultValue: boolean = false,
): boolean {
  return args.includes(flagName) ? !defaultValue : defaultValue;
}

const type = args[args.indexOf('--type') + 1] as ReleaseTypes;
const preRelease = args[args.indexOf('--preRelease') + 1] as PreReleaseTypes;
const message = args[args.indexOf('-m') + 1];

const tag = parseBooleanFlag('--tag', false);
const fullTag = parseBooleanFlag('--fullTag', true);
const major = parseBooleanFlag('--major', false);
const minor = parseBooleanFlag('--minor', false);

run(type, preRelease, tag, {
  commitMessage: message,
  fullTag,
  major,
  minor,
});
