#!/usr/bin/env node

import env from "@rcompat/env";
import fs from "@rcompat/fs";
import io from "@rcompat/io";
import is from "@rcompat/is";
import runtime from "@rcompat/runtime";
import Schema from "./Schema.js";

const root = await fs.project.root();
const ts_config_file = root.join("proby.config.ts");
const js_config_file = root.join("proby.config.js");
const user_config = await ts_config_file.exists()
  ? (await ts_config_file.import("default"))
  : await js_config_file.exists()
    ? (await js_config_file.import("default"))
    : {};

const { include, packages, conditions, monorepo } = Schema.parse(user_config);
const conditions_flag = conditions.length > 0
  ? ` --conditions=${conditions.join(",")}`
  : "";
const script = runtime.script;
const args = runtime.args.join(" ");

if (!is.defined(env.try("PROBY_RELAUNCHED"))) {
  await io.spawn(`${runtime.bin} ${conditions_flag} ${script} ${args}`, {
    inherit: true,
    env: { ...process.env, PROBY_RELAUNCHED: "1" },
  });
  runtime.exit(0);
}

import run from "#run";

const [file, group] = runtime.args;

if (monorepo) {
  for (const repo of await root.join(packages).list({
    filter: info => info.kind === "directory",
  })) {
    for (const dir of include) {
      await run(repo.join(dir), repo.name, file, group);
    }
  }
} else {
  for (const dir of include) {
    await run(root.join(dir), undefined, file, group);
  }
}
