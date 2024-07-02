import { FlatFile, collect, resolve } from "@rcompat/fs";
import Config from "./config.js";
import Reporter from "./Reporter.js";
import Test from "./Test.js";

const collect_tests = async (base: FlatFile, pattern: string, target: string, fixtures: any[]) => {
  const files = await collect(base, pattern, { recursive: false });
  const tests = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const test = await new Test(base, file, i).run(target, fixtures);
    tests.push(test);
  }
  return tests;
};

export default async (root: FlatFile, base: FlatFile, config: Config, target: string) => {
  const fixtures = await Promise.all(
    (await collect(root.join(config.fixtures), ".js$", { recursive: false }))
      .map(async (file: FlatFile) => [file.base, await file.import("default")]));
  let tests = [];
  const r = resolve();
  if (target.endsWith(".spec.js")) {
    const test = await new Test(base, r.join(target), 0).run(undefined, fixtures);
    tests.push(test);
  } else {
    tests = await collect_tests(base, config.pattern, target, fixtures);
  }
  new Reporter(config.explicit).report(tests);
};
