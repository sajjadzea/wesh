# Causal Graph Dashboard



## Project Structure

```
project-root/
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── public/
│   ├── index.html
│   ├── causal-graph.html
│   ├── assets/
│   │   ├── tailwind.css
│   │   ├── styles.css
│   │   └── dashboard.css
│   └── js/
│       ├── main.js
│       ├── causal-graph.js
│       └── libs/
│           └── cytoscape.min.js
├── src/
│   └── styles/
│       └── tailwind.css
├── data/
│   └── graph/
│       ├── nodes.json
│       └── edges.json
├── scripts/
│   ├── ensure-remote.sh
│   └── release.js
├── test/
│   ├── sample.test.js
│   └── test-cy.js
└── docs/
    └── CLD/
```

* `public/` contains the static site served to users.
* `src/styles/tailwind.css` is the Tailwind source file. Run `npm run build:css` to generate `public/assets/tailwind.css`.
* `data/` holds example graph data used by the dashboard.
* `scripts/` provides helper scripts for development and release.
* `docs/CLD/` contains archived documentation for the old CLD tool.

## Development

Install dependencies and generate the CSS once:

```bash
npm ci
npm run build:css
```

Start a simple server from the project root so that the JSON files can be fetched correctly:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:8000/public/index.html` in your browser.

### Scripts

```bash
npm run lint      # run ESLint
npm run format    # format with Prettier
npm test          # run Jest tests
npm run build:css # compile Tailwind CSS
```
### Linting

Run ESLint using:

```bash
npm run lint
```

The configuration lives in `eslint.config.js` and ignores generated assets and example files.


### Deployment

The `public/` folder contains the static site that is published to GitHub Pages.
Ensure the Pages source is set to the `gh-pages` branch, which is populated from
`public/` by the workflow in `.github/workflows`. If Pages shows the README
instead of the dashboard, check that the workflow has pushed the latest
`public/index.html`.

### Troubleshooting GitHub Pages

If the site ever loads the repository `README.md` instead of `public/index.html`:

1. Run `npm run verify:pages` locally or check the CI logs to ensure `public/index.html` exists and no `index.html` is present in the repo root.
2. Confirm that only `.github/workflows/deploy-pages.yml` runs automatically. Other workflows such as `jekyll-gh-pages.yml` or `static.yml` should be disabled or manual so they do not overwrite the `gh-pages` branch.
3. In GitHub Pages settings, verify the source is the `gh-pages` branch and directory `/`.
4. If an old deployment is cached, briefly disable and re-enable GitHub Pages or append a query string like `?cache=bust` to the site URL to invalidate the CDN cache.
5. Ensure the default branch is set to `main` and that no branch protection rules prevent the Pages workflow from pushing to `gh-pages`.
6. After fixing the above, trigger a fresh deploy on the `main` branch.



## Testing

Jest tests live in `test/`. Run them with:

```bash
npm test
```

### Running E2E Tests in CI

- With Electron headless (no X server required):
  ```bash
  npm run e2e
  ```
- If you need Chrome:
  ```bash
  npm run e2e:chrome
  ```
- Still see Xvfb errors? Ensure `scripts/install-chrome.sh` ran or install the package manually:
  ```bash
  sudo apt-get install -y xvfb
  ```
