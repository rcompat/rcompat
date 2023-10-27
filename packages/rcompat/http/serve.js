import { runtime } from "rcompat/meta";
import bun from "./bun-serve.js";
import deno from "./deno-serve.js";
import node from "./node-serve.js";

const serve = { bun, deno, node };

export default serve[runtime];
