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
* `examples/` hosts experimental projects such as `cld-tool`.

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



## Testing

Jest tests live in `test/`. Run them with:

```bash
npm test
```
