import assert from "@rcompat/assert";
import fs from "@rcompat/fs";
import type { Env } from "@rcompat/test";
import repository from "@rcompat/test/repository";
import { parentPort, workerData } from "node:worker_threads";

const { spec, env, context } = workerData;

const env_module = assert.shape<Env>((await import(env)).default, {
  globals: "function",
  setup: "function?",
  teardown: "function?",
});
Object.assign(globalThis, env_module.globals(context));

repository.suite(fs.ref(spec));
await import(spec);

const results: {
  name: string;
  passed: boolean;
  expected: unknown;
  actual: unknown;
}[] = [];

for (const suite of repository.next()) {
  for await (const test of suite.run()) {
    for (const result of test.results) {
      results.push({
        name: test.name,
        passed: result.passed,
        expected: result.expected,
        actual: result.actual,
      });
    }
  }
  await suite.end();
}

parentPort!.postMessage({ results });
