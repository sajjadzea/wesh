#!/usr/bin/env bash
set -e

# Fail if an index.html exists in repository root (outside public)
if [ -f index.html ]; then
  echo "Root index.html detected; remove it to prevent GitHub Pages fallback." >&2
  exit 1
fi

# Ensure built index exists under public/
if [ ! -f public/index.html ]; then
  echo "public/index.html is missing. Build step did not produce output." >&2
  exit 1
fi

# Optionally check that .nojekyll exists
if [ ! -f public/.nojekyll ]; then
  echo ".nojekyll not found; creating it." >&2
  touch public/.nojekyll
fi

exit 0
