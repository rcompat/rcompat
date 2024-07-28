import { serve as node } from "./node/exports.js";
import { serve as deno } from "./deno/exports.js";
import { serve as bun } from "./bun/exports.js";
import platform from "@rcompat/platform";

export default { bun, deno, node }[platform];
