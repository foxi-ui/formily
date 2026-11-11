#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="${1:-$ROOT/doc-site}"

SITES=(reactive core react antd next element vue)
FAILED=0

fail() {
  echo "ERROR: $*"
  FAILED=1
}

check_file() {
  if [ ! -s "$1" ]; then
    fail "missing or empty file: $1"
  fi
}

check_assets() {
  local dir="$1"

  # Dumi writes assets next to index.html; VuePress writes them under
  # assets/css and assets/js.
  if [ -z "$(find "$dir" -maxdepth 3 -type f \( -name '*.js' -o -name '*.css' \) -print -quit)" ]; then
    fail "no built JS/CSS assets found in $dir"
  fi
}

check_index_refs() {
  local index="$1"
  local ref

  while IFS= read -r ref; do
    [ -z "$ref" ] && continue
    ref="${ref%%\?*}"
    ref="${ref%%#*}"
    if [ ! -e "$OUTPUT/${ref#/}" ]; then
      fail "index references missing local path: $ref"
    fi
  done <<EOF
$(grep -oE '(src|href)="/[^"]+"' "$index" | sed -E 's/^(src|href)="//; s/"$//' | grep -v '^//' || true)
EOF
}

echo "Verifying documentation output at $OUTPUT"

check_file "$OUTPUT/index.html"
check_assets "$OUTPUT"
check_index_refs "$OUTPUT/index.html"

for name in "${SITES[@]}"; do
  site="$OUTPUT/$name"
  index="$site/index.html"

  echo "  - $name"
  check_file "$index"
  check_assets "$site"
  check_index_refs "$index"

  if [ -s "$index" ] && ! grep -q "/$name/" "$index"; then
    fail "$name/index.html does not reference the /$name/ base path"
  fi

  if [ -d "$site" ] && [ -z "$(find "$site" -mindepth 1 -maxdepth 1 -print -quit)" ]; then
    fail "$name directory is empty"
  fi
done

# Third-party styles and icon fonts must be served from the docs origin.
check_file "$OUTPUT/assets/css/antd.css"
check_file "$OUTPUT/react/assets/css/antd.css"
check_file "$OUTPUT/antd/assets/css/antd.css"
check_file "$OUTPUT/next/assets/css/next-noreset.css"
check_file "$OUTPUT/next/assets/css/fonts/font_515771_xjdbujl2iu.woff2"
check_file "$OUTPUT/element/assets/css/element-ui.css"
check_file "$OUTPUT/element/assets/css/fonts/element-icons.woff"

# Deep links must be real static HTML files so that refreshing a GitHub Pages
# URL does not return 404.
DEEP_ROUTES=(
  "reactive/guide/index.html"
  "core/guide/index.html"
  "react/guide/index.html"
  "antd/components/index.html"
  "next/components/index.html"
  "element/guide/index.html"
  "vue/guide/index.html"
)

for route in "${DEEP_ROUTES[@]}"; do
  check_file "$OUTPUT/$route"
done

if [ -d "$OUTPUT/doc-site" ]; then
  fail "unexpected nested output directory: $OUTPUT/doc-site"
fi

if [ -f "$OUTPUT/CNAME" ] && [ ! -s "$OUTPUT/CNAME" ]; then
  fail "CNAME exists but is empty"
fi

for external in "esm.sh" "at.alicdn.com"; do
  if grep -rIl -- "$external" "$OUTPUT" >/dev/null 2>&1; then
    fail "external dependency '$external' remains in $OUTPUT"
  fi
done

if [ "$FAILED" -ne 0 ]; then
  echo "Documentation verification failed"
  exit 1
fi

echo "Documentation verification passed"
