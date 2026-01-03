#!/usr/bin/env node

import color from "@rcompat/cli/color";
import print from "@rcompat/cli/print";
import fs, { type FileRef } from "@rcompat/fs";
import run from "./run.js";

const root = await fs.project.root();
const spec_json = root.join("spec.json");

if (await spec_json.exists()) {
  //  console.log(`spec.json exists, reading`);
} else {
  //  console.log(`spec.json missing, continuing with defaults`);
}

type Type = Promise<"monorepo" | "repo" | undefined>;
const type = await (async (base: FileRef): Type => {
  if (await base.join("packages").exists()) {
    return "monorepo";
  }
  if (await base.join("src").exists()) {
    return "repo";
  }
})(root);

if (type === "monorepo") {
  for (const repo of await root.join("packages").list({
    filter: info => info.kind === "directory",
  })) {
    await run(repo.join("src"), repo.name);
  }
} else if (type === "repo") {
  await run(root.join("src"));
} else {
  print(`${color.red("src")} or ${color.red("packages")} not found\n`);
}
