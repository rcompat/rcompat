import color from "@rcompat/cli/color";
import print from "@rcompat/cli/print";
import type { FileRef } from "@rcompat/fs";
import type Result from "@rcompat/test/Result";
import type Test from "@rcompat/test/Test";
import repository from "@rcompat/test/repository";

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

export default async (root: FileRef, subrepo?: string) => {
  const files = await root.list({
    recursive: true,
    filter: info => extensions.some(extension => info.path.endsWith(extension)),
  });

  if (files.length === 0) return;

  for (const file of files) {
    repository.suite(file);
    await file.import();
  }

  if (subrepo !== undefined) {
    print(`${color.blue(subrepo)}\n`);
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
