import { get_options } from "../private/exports.js";

export default async (handler, conf) => {
  const server = Deno.serve({
    port: conf.port,
    hostname: conf.host,
    // suppress default "Listening on" message
    onListen: _ => _,
    ...await get_options(conf),
  }, request => handler(request));
  await server.finished;
  return server;
};
