import { runtime } from "rcompat/meta";

import * as node from "./node/exports.js";
import * as deno from "./deno/exports.js";
import * as bun from "./bun/exports.js";

const {
  Status,
  MediaType,
  Body,
  serve,
} = { bun, deno, node }[runtime];

export {
  Status,
  MediaType,
  Body,
  serve,
};
