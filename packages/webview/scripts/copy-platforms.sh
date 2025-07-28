#!/bin/bash

SRC_BASE="src/private/platform"
DEST_BASE="lib/private/platform"

find "$SRC_BASE" -type f -name "webview.bin" | while read -r src_file; do
  platform_dir=$(dirname "$src_file" | sed "s|$SRC_BASE/||")

  dest_dir="$DEST_BASE/$platform_dir"
  mkdir -p "$dest_dir"

  cp "$src_file" "$dest_dir/webview.bin"
done
