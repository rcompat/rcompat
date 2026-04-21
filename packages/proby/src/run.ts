import assert from "@rcompat/assert";
import cli from "@rcompat/cli";
import type { FileRef } from "@rcompat/fs";
import fs from "@rcompat/fs";
import is from "@rcompat/is";
import type { Env } from "@rcompat/test";
import repository from "@rcompat/test/repository";
import { Worker } from "node:worker_threads";

const extensions = [".spec.ts", ".spec.js"];
const base_scalars = ["boolean", "number", "string", "symbol"];

function stringify_scalar(x: unknown) {
  if (is.null(x)) return "null";
  if (is.undefined(x)) return "undefined";
  const type = typeof x;
  if (base_scalars.includes(type)) return x.toString();
  if (is.bigint(x)) return x.toString() + "n";
  if (is.function(x)) return `[Function${is.text(x.name) ? `: ${x.name}` : ""}]`;
}

function stringify(x: unknown) {
  const scalar = stringify_scalar(x);
  if (is.defined(scalar)) return scalar;
  if (is.object(x)) {
    try {
      return JSON.stringify(x, (_, sub) => {
        const s = stringify_scalar(sub);
        return is.defined(s) ? s : sub;
      });
    } catch {
      return "[Object (circular or unserializable)]";
    }
  }
  return String(x);
}

async function run_in_worker(spec: FileRef, env: FileRef): Promise<void> {
  const env_module = assert.shape<Env>((await import(env.path)).default, {
    globals: "function",
    setup: "function?",
    teardown: "function?",
  });

  const context = await env_module.setup?.();

  return new Promise((resolve, reject) => {
    const worker_url = new URL(
      import.meta.url.endsWith(".ts") ? "./worker.ts" : "./worker.js",
      import.meta.url,
    );
    const worker = new Worker(worker_url, {
      workerData: {
        spec: spec.path,
        env: env.path,
        context,
      },
    });
    worker.on("message", ({ results }) => {
      const failed = results.filter((r: any) => !r.passed);
      for (const result of results) {
        cli.print(result.passed ? cli.fg.green("o") : cli.fg.red("x"));
      }
      if (failed.length > 0) {
        cli.print("\n");
        for (const result of failed) {
          cli.print(`${spec.debase(spec.directory)} ${cli.fg.red(result.name)}\n`);
          cli.print(`  expected  ${stringify(result.expected)}\n`);
          cli.print(`  actual    ${stringify(result.actual)}\n`);
        }
      }
    });
    worker.on("error", reject);
    worker.on("exit", async () => {
      await env_module.teardown?.(context);
      resolve();
    });
  });
}

export default async (
  root: FileRef,
  subrepo?: string,
  target?: string,
  group?: string,
) => {
  const resolved = is.defined(target) ? fs.resolve(target).path : undefined;
  const files = await root.list({
    recursive: true,
    filter: info => {
      const path = info.path;
      if (is.undefined(resolved)) return extensions.some(e => path.endsWith(e));
      if (extensions.some(e => resolved.endsWith(e))) return path.endsWith(resolved);
      return info.path.startsWith(resolved) && extensions.some(e => path.endsWith(e));
    },
  });

  if (files.length === 0) return;

  if (is.defined(subrepo)) cli.print(`${cli.fg.blue(subrepo)}\n`);

  for (const file of files) {

    const env_file = await file.sibling(
      file.name.replace(/\.spec\.(ts|js)$/, ".env.ts"),
    ).or(() => null);

    if (env_file !== null) {
      await run_in_worker(file, env_file);
      continue;
    }

    const mock_file = await file.sibling(
      file.name.replace(/\.spec\.(ts|js)$/, ".mock.$1"),
    ).or(() => null);

    repository.suite(file);
    const suite = repository.next().next().value!;

    try {
      if (mock_file !== null) await mock_file.import();

      await file.import();

      const failed: [any, any][] = [];

      for await (const test of suite.run()) {
        if (is.defined(group) && test.group !== group) continue;

        for (const result of test.results) {
          if (result.passed) {
            cli.print(cli.fg.green("o"));
          } else {
            failed.push([test, result]);
            cli.print(cli.fg.red("x"));
          }
        }
      }

      await suite.end();

      if (failed.length > 0) {
        cli.print("\n");
        for (const [test, result] of failed) {
          cli.print(`${suite.file.debase(root)} ${cli.fg.red(test.name)} \n`);
          cli.print(`  expected  ${stringify(result.expected)}\n`);
          cli.print(`  actual    ${stringify(result.actual)}\n`);
        }
      }
    } finally {
      repository.reset();
    }
  }

  cli.print("\n");
};
