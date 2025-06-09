# wesh

This repository hosts a small static dashboard to visualise causal relationships in Iran's electricity sector.

## Running locally

Use a simple HTTP server from the repository root so that the JSON data can be fetched correctly:

```bash
# with Python
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

Alternatively, use any other static server (e.g. `npx serve`). Opening the HTML files directly via `file://` will not work because the graph data is loaded with `fetch`.

