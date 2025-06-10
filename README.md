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

### Deployment

The `public/` folder contains the static site that is published to GitHub Pages.
Ensure the Pages source is set to the `gh-pages` branch, which is populated from
`public/` by the workflow in `.github/workflows`. If Pages shows the README
instead of the dashboard, check that the workflow has pushed the latest
`public/index.html`.



## Testing

Jest tests live in `test/`. Run them with:


