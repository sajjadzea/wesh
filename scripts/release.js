#!/usr/bin/env node
const fs = require('fs');
const { execSync, spawnSync } = require('child_process');

function run(cmd) {
  try {
    return execSync(cmd, { stdio: ['pipe', 'pipe', 'inherit'], encoding: 'utf8' }).trim();
  } catch (err) {
    if (err.stdout) process.stdout.write(err.stdout);
    if (err.stderr) process.stderr.write(err.stderr);
    process.exit(1);
  }
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const currentVersion = pkg.version;

const bump = process.env.BUMP || process.argv[2];
if (!['major', 'minor', 'patch'].includes(bump)) {
  fail('Usage: BUMP=major|minor|patch node scripts/release.js');
}

const parts = currentVersion.split('.').map(Number);
let newVersion;
if (bump === 'major') newVersion = `${parts[0] + 1}.0.0`;
if (bump === 'minor') newVersion = `${parts[0]}.${parts[1] + 1}.0`;
if (bump === 'patch') newVersion = `${parts[0]}.${parts[1]}.${parts[2] + 1}`;

if (newVersion === currentVersion) {
  fail('Version did not change.');
}

const existingTag = run(`git tag --list v${newVersion}`);
if (existingTag) {
  fail(`Tag v${newVersion} already exists.`);
}

pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

run(`git add ${pkgPath}`);
run(`git commit -m "chore(release): v${newVersion}"`);
run(`git tag v${newVersion}`);
run(`git push origin HEAD`);
run(`git push origin v${newVersion}`);

let notes = '';
const changelogPath = 'CHANGELOG.md';
if (fs.existsSync(changelogPath)) {
  const changelog = fs.readFileSync(changelogPath, 'utf8');
  const regex = new RegExp(`##\\s*v?${newVersion.replace(/\./g, '\\.')}(?:\\s*\n)([\\s\\S]*?)(?=\n##\\s*v|$)`);
  const match = changelog.match(regex);
  if (match) {
    notes = match[1].trim();
  }
}

const demo = pkg.demo || pkg.homepage;
if (demo) {
  notes += (notes ? '\n\n' : '') + `Demo: ${demo}`;
}

const gh = spawnSync('gh', ['release', 'create', `v${newVersion}`, '-t', `v${newVersion}`, '-F', '-'], {
  input: notes,
  stdio: ['pipe', 'inherit', 'inherit']
});
if (gh.status !== 0) {
  fail('Failed to create GitHub release.');
}

