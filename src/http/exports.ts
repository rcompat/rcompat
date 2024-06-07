import { platform } from "rcompat/package";

import * as node from "./node/exports.js";
import * as deno from "./deno/exports.js";
import * as bun from "./bun/exports.js";

const {
  Status,
  MediaType,
  Body,
  serve,
} = { bun, deno, node }[platform()];

export {
  Status,
  MediaType,
  Body,
  serve,
};
