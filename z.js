// import semver from 'semver';
// let versions = [
//   '1.2.3', // normal
//   '0.1.0', // initial dev version
//   '10.20.30', // big numbers
//   '1.2.3-beta.55', // prerelease with tag + number
//   '1.2.3-85', // prerelease with numeric ID
//   '2.0.0-rc.1', // release candidate
//   '3.4.5-alpha', // prerelease without number
// ];
// let v = '1.2.3';

// export function formatCommitMessage(template, version) {
//   return template
//     .replaceAll('${version}', version)
//     .replaceAll('${major}', String(semver.major(version)))
//     .replaceAll('${minor}', String(semver.minor(version)))
//     .replaceAll('${patch}', String(semver.patch(version)));
// }
// const templates = [
//   'chore: release ${version}',
//   'release: v${major}.${minor}',
//   'bump patch: ${major}.${minor}.${patch}',
//   'Release ${version} (major=${major}, minor=${minor}, patch=${patch})',
// ];
// console.log(semver.major(v));
// console.log(semver.minor(v));
// console.log(semver.patch(v));
// console.log(semver.parse(v));

// for (const v of versions) {
//   console.log('\n🔹 Version:', v);
// //   console.log('Parsed:', semver.parse(v));

//   for (const t of templates) {
//     console.log('  →', formatCommitMessage(t, v));
//   }
// }

// import fs from 'fs';
// import path from 'path';

// const files = ['package-lock.json', 'package.json', 'jsr.json', 'deno.json'];

// for (const file of files) {
//   const filePath = path.join(process.cwd(), file);
//   if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
//     // console.log(filePath);
//     const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
//     console.log('Current version in file', file+ ':', content.version);
//   }
// }

// let v = '1.2.3-beta.55';

// console.log(semver.major(v));
// console.log(semver.minor(v));
// console.log(semver.patch(v));
// console.log(semver.prerelease(v));
// console.log(semver.prerelease(v)[0]);
