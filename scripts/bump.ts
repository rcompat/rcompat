import runtime from "@rcompat/runtime";

const packages = await (await runtime.projectRoot()).join("packages").list(
  { filter: info => info.type === "directory" },
);

// check all first
for (const pkg of packages) {
  const json = await runtime.packageJSON(pkg);
  if (json.version.includes("-")) {
    console.error(`package ${json.name} already set to dev: ${json.version}`);
    break;
  }
  const [major] = json.version.split(".").map(Number);
  if (major > 0) {
    console.error("still in <1 phase, adapt script if this is no longer the case");
    break;
  }
}

for (const pkg of packages) {
  const json = await runtime.packageJSON(pkg);
  const [major, minor] = json.version.split(".").map(Number);
  json.version = `${major}.${minor + 1}.0`;
  await pkg.join("package.json").writeJSON(json);
}
