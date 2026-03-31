import assert from "@rcompat/assert";
import color from "@rcompat/cli/color";
import print from "@rcompat/cli/print";
import type { FileRef } from "@rcompat/fs";
import type { Env, Result, Test } from "@rcompat/test";
import repository from "@rcompat/test/repository";
import { Worker } from "node:worker_threads";

const extensions = [".spec.ts", ".spec.js"];
const base_scalars = ["boolean", "number", "string", "symbol"];

function stringify_scalar(value: unknown) {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  const type = typeof value;
  if (base_scalars.includes(type)) return value.toString();
  if (typeof value === "bigint") return value.toString() + "n";
  if (typeof value === "function") {
    return `[Function${value.name ? `: ${value.name}` : ""}]`;
  }
}

function stringify(value: unknown) {
  const scalar = stringify_scalar(value);
  if (scalar !== undefined) return scalar;
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, (_, sub) => {
        const s = stringify_scalar(sub);
        return s !== undefined ? s : sub;
      });
    } catch {
      return "[Object (circular or unserializable)]";
    }
  }
  return String(value);
}

async function run_in_worker(spec: FileRef, env: FileRef): Promise<void> {
  const env_module = assert.shape<Env>((await import(env.path)).default, {
    globals: "function",
    setup: "function?",
    teardown: "function?",
  });

  const context = await env_module.setup?.();

  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./worker.js", import.meta.url), {
      workerData: {
        spec: spec.path,
        env: env.path,
        context,
      },
    });
    worker.on("message", ({ results }) => {
      const failed = results.filter((r: any) => !r.passed);
      for (const result of results) {
        print(result.passed ? color.green("o") : color.red("x"));
      }
      if (failed.length > 0) {
        print("\n");
        for (const result of failed) {
          print(`${spec.debase(spec.directory)} ${color.red(result.name)}\n`);
          print(`  expected  ${stringify(result.expected)}\n`);
          print(`  actual    ${stringify(result.actual)}\n`);
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

export default async (root: FileRef, subrepo?: string, target?: string) => {
  const files = await root.list({
    recursive: true,
    filter: info => extensions.some(extension => info.path.endsWith(extension)),
  });

  if (files.length === 0) return;

  if (subrepo !== undefined) print(`${color.blue(subrepo)}\n`);

  for (const file of files) {
    if (target !== undefined && !file.path.endsWith(target)) continue;

    const env_file = await file.sibling(
      file.name.replace(/\.spec\.(ts|js)$/, ".env.ts"),
    ).or(() => null);

    if (env_file !== null) {
      await run_in_worker(file, env_file);
      continue;
    }

    repository.suite(file);
    await file.import();
  }

  for (const suite of repository.next()) {
    const failed: [Test, Result<unknown>][] = [];

    for await (const test of suite.run()) {
      for (const result of test.results) {
        if (result.passed) {
          print(color.green("o"));
        } else {
          failed.push([test, result]);
          print(color.red("x"));
        }
      }
    }
    await suite.end();
    if (failed.length > 0) {
      print("\n");
      for (const [test, result] of failed) {
        print(`${suite.file.debase(root)} ${color.red(test.name)} \n`);
        print(`  expected  ${stringify(result.expected)}\n`);
        print(`  actual    ${stringify(result.actual)}\n`);
      }
    }
  }
  print("\n");
  repository.reset();
};
