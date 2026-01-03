import fs from "@rcompat/fs";

const packages = await (await fs.project.root()).join("packages").list(
  { filter: info => info.kind === "directory" }
);

// check all first
for (const pkg of packages) {
  const json = await pkg.join("package.json").json();
  if (json.version.includes("-")) {
    console.error(`package ${json.name} already set to dev: ${json.version}`);
    break;
  }
  const [major, minor, patch] = json.version.split(".").map(Number);
  if (major > 0) {
    console.error(`still in <1 phase, adapt script if this is no longer the case`);
    break;
  }
}

for (const pkg of packages) {
  const package_json = pkg.join("package.json");
  const json = await package_json.json();
  const [major, minor, patch] = json.version.split(".").map(Number);
  json.version = `${major}.${minor + 1}.0`;
  await package_json.writeJSON(json);
}
