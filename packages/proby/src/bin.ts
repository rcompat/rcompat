#!/usr/bin/env node

import Schema from "#Schema";
import env from "@rcompat/env";
import type { FileRef } from "@rcompat/fs";
import fs from "@rcompat/fs";
import io from "@rcompat/io";
import is from "@rcompat/is";
import runtime from "@rcompat/runtime";

type TSConfig = {
  compilerOptions?: {
    customConditions?: string[];
  };
  extends?: string;
};

async function read_conditions(file: FileRef): Promise<string[]> {
  const json = await file.json<TSConfig>();

  if (json.compilerOptions?.customConditions?.length) {
    return json.compilerOptions.customConditions;
  }

  if (json.extends === undefined) {
    return [];
  }

  const next = runtime.resolve(json.extends, file.directory.path);
  return read_conditions(fs.ref(next));
}

const root = await runtime.projectRoot();
const ts_config_file = root.join("proby.config.ts");
const js_config_file = root.join("proby.config.js");
const user_config = await ts_config_file.exists()
  ? (await ts_config_file.import("default"))
  : await js_config_file.exists()
    ? (await js_config_file.import("default"))
    : {};

const { include, packages, monorepo } = Schema.parse(user_config);
const ts_config = root.join("tsconfig.json");

const conditions = await ts_config.exists()
  ? await read_conditions(ts_config)
  : [];
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
