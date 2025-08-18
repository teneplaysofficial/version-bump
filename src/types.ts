export type ReleaseTypes =
  | 'major'
  | 'premajor'
  | 'minor'
  | 'preminor'
  | 'patch'
  | 'prepatch';

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

export interface Config {
  version: string;
  type: ReleaseTypes;
  preRelease: PreReleaseTypes;
}
