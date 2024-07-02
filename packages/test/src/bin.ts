#!/usr/bin/env node

import { FlatFile, resolve } from "@rcompat/fs";
import * as P from "@rcompat/package";
import run from "./run.js";

const get_config = async (base: FlatFile) => {
  const filename = "debris.config.js";
  const path = base.join(filename);
  const import_str = await path.exists() ? `${path}` : `./${filename}`;
  return (await import(import_str)).default;
};

const root = await P.root();
const current = resolve();
const config = await get_config(root);
const base = `${root}` === `${current}` ? root.join(config.base) : current;

await run(root, base, config, process.argv[2]);
