#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="$ROOT/doc-site"

cd "$ROOT"

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [ "$NODE_MAJOR" != "16" ]; then
  if [ "${FORMILY_DOCS_ALLOW_UNSUPPORTED_NODE:-0}" = "1" ]; then
    echo "WARNING: Node $(node -v) is not the verified documentation build version (Node 16)."
    echo "         Continuing because FORMILY_DOCS_ALLOW_UNSUPPORTED_NODE=1."
  else
    echo "ERROR: Formily 2.x documentation is verified on Node 16 (the version used by CI)."
    echo "       Current Node: $(node -v)"
    echo "       Run 'nvm use 16' and retry, or set FORMILY_DOCS_ALLOW_UNSUPPORTED_NODE=1 at your own risk."
    exit 1
  fi
fi

# The legacy Dumi/VuePress toolchain needs more than the default heap for the
# antd/next documentation sites.
export NODE_OPTIONS="--max-old-space-size=4096 ${NODE_OPTIONS:-}"

echo "==> Clean documentation output"
rm -rf "$OUTPUT"
mkdir -p "$OUTPUT"

# Package documentation demos import sibling workspace packages. Their
# package.json main/module fields point at lib/esm, so build the packages
# before building any documentation site.
echo "==> Build workspace packages (required by documentation demos)"
yarn build

echo "==> Build main site (Dumi)"
DOCS_BASE="/" \
DOCS_OUT_DIR="./doc-site" \
yarn build:docs

build_dumi() {
  local workspace="$1"
  local base="$2"
  local name="$3"

  echo "==> Build $name ($workspace, Dumi)"
  DOCS_BASE="$base" \
  DOCS_OUT_DIR="../../doc-site/$name" \
  yarn workspace "$workspace" run build:docs
}

build_vuepress() {
  local workspace="$1"
  local base="$2"
  local name="$3"

  echo "==> Build $name ($workspace, VuePress)"
  DOCS_BASE="$base" \
  DOCS_OUT_DIR="../../doc-site/$name" \
  yarn workspace "$workspace" run build:docs
}

build_dumi "@formily/reactive" "/reactive/" "reactive"
build_dumi "@formily/core" "/core/" "core"
build_dumi "@formily/react" "/react/" "react"
build_dumi "@formily/antd" "/antd/" "antd"
build_dumi "@formily/next" "/next/" "next"

build_vuepress "@formily/element" "/element/" "element"
build_vuepress "@formily/vue" "/vue/" "vue"

echo "==> Verify documentation output"
bash "$ROOT/scripts/verify-docs.sh" "$OUTPUT"

echo "All documentation built successfully: $OUTPUT"
