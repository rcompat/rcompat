#!/usr/bin/env node

import red from "@rcompat/cli/color/red";
import print from "@rcompat/cli/print";
import type FileRef from "@rcompat/fs/FileRef";
import root from "@rcompat/package/root";
import run from "./run.js";

const $root = await root();
const spec_json = $root.join("spec.json");

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
})($root);

if (type === "monorepo") {
  for (const repo of await $root.join("packages").list()) {
    await run(repo.join("src"), repo.name);
  }
} else if (type === "repo") {
  await run($root.join("src"));
} else {
  print(`${red("src")} or ${red("packages")} not found\n`);
}
