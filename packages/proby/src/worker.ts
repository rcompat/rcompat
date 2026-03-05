import fs from "@rcompat/fs";
import repository from "@rcompat/test/repository";
import { parentPort, workerData } from "node:worker_threads";

const { spec, env } = workerData;
const env_module = await import(env);

Object.assign(globalThis, env_module.default);

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
