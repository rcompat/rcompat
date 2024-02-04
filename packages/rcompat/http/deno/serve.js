import { upgrade } from "./ws.js";
import { get_options } from "../private/exports.js";

export default async (handler, conf) => {
  Deno.serve({
    port: conf.port,
    hostname: conf.host,
    // suppress default "Listening on" message
    onListen: _ => _,
    ...await get_options(conf),
  }, request => handler(request));
  return {
    upgrade(request, response) {
      return upgrade(request, response);
    },
  };
};
