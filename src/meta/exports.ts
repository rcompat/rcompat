const packager = import.meta.runtime?.packager ?? "npm";
const manifest = import.meta.runtime?.manifest ?? "package.json";
const library = import.meta.runtime?.library ?? "node_modules";

export { packager, manifest, library };
export { default as depend } from "./depend.js";
