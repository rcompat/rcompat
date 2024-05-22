import { identity } from "rcompat/function";
import { upgrade } from "./ws.js";
import { get_options } from "../private/exports.js";
import type { Conf, Handler, Actions } from "../types.js";

export default async (handler: Handler, conf: Conf) => {
  // @ts-ignore
  Deno.serve({
    port: conf.port,
    hostname: conf.host,
    // suppress default "Listening on" message
    onListen: identity,
    ...await get_options(conf),
  }, (request: Request) => handler(request));
  return {
    upgrade(request: Request, actions: Actions = {}) {
      return upgrade(request, actions);
    },
  };
};
