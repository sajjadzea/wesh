# wesh

This repository hosts a small static dashboard to visualise causal relationships in Iran's electricity sector.

## Running locally

Use a simple HTTP server from the repository root so that the JSON data can be fetched correctly. Opening the HTML file directly with `file://` will lead to a `Failed to fetch` error because the graph data is loaded via `fetch`:

```bash
# with Python
python3 -m http.server 8000
# then open http://localhost:8000/index.html in your browser
```

Alternatively, use any other static server (e.g. `npx serve`). Opening the HTML files directly via `file://` will not work because the graph data is loaded with `fetch`.

After the page loads, open your browser's developer console. The script logs the fetched data and the number of nodes and edges. You can also run the following commands in the console to verify the numbers match your JSON file:

```js
cy.nodes().length;
cy.edges().length;
```

If the counts differ, check that `data/causal-power-imbalance.json` is up to date and that the IDs in `edges` exactly match the node IDs.

## Features

- Dependencies (Cytoscape.js, Tailwind) loaded via CDN
- Node details shown in a sidebar when clicked
- Works completely offline with a simple static server

## Release script

Run `node scripts/release.js <major|minor|patch>` or set `BUMP` env var to bump the version, tag, push and create a GitHub release. The script reads release notes from `CHANGELOG.md` (section `## vX.Y.Z`) and appends a demo link from `package.json` if present.

## Development

Install dependencies with `npm ci` and then use the following commands:

```bash
npm run lint    # run ESLint
npm run format  # format files with Prettier
npm test        # run tests with Jest
npm run build   # build the project
npm run release # run semantic-release
```

## Continuous Integration

Pull requests and pushes to `main` or `develop` run the CI workflow which lints, tests and builds the project. On success or failure a comment is posted on the pull request.

### Releases

Merges to `main` trigger the release workflow powered by `semantic-release`. Version numbers and changelogs are generated automatically and published to GitHub Releases. Deployment to GitHub Pages also happens from `main` after tests pass.
