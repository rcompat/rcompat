#!/usr/bin/env node
import bold from "@rcompat/cli/color/bold";
import green from "@rcompat/cli/color/green";
import red from "@rcompat/cli/color/red";
import print from "@rcompat/cli/print";
import root from "@rcompat/package/root";
import run from "@rcompat/test/run";

const $root = await root();
const spec_json = $root.join("spec.json");

if (await spec_json.exists()) {
//  console.log(`spec.json exists, reading`);
} else {
//  console.log(`spec.json missing, continuing with defaults`);
}

const endings = [".spec.ts", ".spec.js"];

const files = await $root.join("src").list(file =>
  endings.some(ending => file.endsWith(ending)), { recursive: true });

await Promise.all(files.map(file => file.import()));

for (const test of run()) {
//  print(`${bold(test.name)} `);
  for (const result of test.results) {
    if (result.passed) {
      print(green("o"));
    } else {
      print(red("x"));
    }
  }
}
print("\n");
