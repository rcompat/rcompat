const packager = import.meta.runtime?.packager ?? "npm";
const manifest = import.meta.runtime?.manifest ?? "package.json";
const library = import.meta.runtime?.library ?? "node_modules";

const is_bun = typeof Bun !== "undefined";
// @ts-ignore
const is_deno = typeof Deno !== "undefined";
const runtime = is_bun ? "bun" : is_deno ? "deno" : "node";

export { packager, manifest, library, runtime };
export { default as depend } from "./depend.js";
