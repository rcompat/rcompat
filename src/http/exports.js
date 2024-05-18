import { runtime } from "rcompat/meta";

import * as node from "./node/exports.js";
import * as deno from "./deno/exports.js";
import * as bun from "./bun/exports.js";

const {
  Request,
  Response,
  Headers,
  FormData,
  URL,
  URLSearchParams,
  Status,
  MediaType,
  Body,
  serve,
  fetch,
} = { bun, deno, node }[runtime];

export {
  Request,
  Response,
  Headers,
  FormData,
  URL,
  URLSearchParams,
  Status,
  MediaType,
  Body,
  serve,
  fetch,
};
