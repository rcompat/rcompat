#!/usr/bin/env node

import Schema from "#Schema";
import env from "@rcompat/env";
import io from "@rcompat/io";
import is from "@rcompat/is";
import runtime from "@rcompat/runtime";

const root = await runtime.projectRoot();
const ts_config_file = root.join("proby.config.ts");
const js_config_file = root.join("proby.config.js");
const user_config = await ts_config_file.exists()
  ? (await ts_config_file.import("default"))
  : await js_config_file.exists()
    ? (await js_config_file.import("default"))
    : {};

const { include, packages, monorepo } = Schema.parse(user_config);

const conditions = await runtime.conditions(root);
const conditions_flags = conditions
  .map(c => ` --conditions="${c}"`)
  .join("");
const script = runtime.script;
const args = runtime.args.join(" ");

if (!is.defined(env.try("PROBY_RELAUNCHED"))) {
  await io.spawn(`${runtime.bin}${conditions_flags} ${script} ${args}`, {
    inherit: true,
    env: { ...process.env, PROBY_RELAUNCHED: "1" },
  });
  runtime.exit(0);
}

import run from "#run";

const [file, group] = runtime.args;

if (monorepo) {
  for (const repo of await root.join(packages).list({
    filter: info => info.type === "directory",
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
