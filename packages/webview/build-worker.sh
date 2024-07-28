npx esbuild ./src/worker/bun/template.ts --bundle --format=esm \
  --outdir=./src/worker/bun --external:"bun:ffi" \
  --entry-names=[dir]/init
