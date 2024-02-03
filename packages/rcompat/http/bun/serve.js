import { get_options } from "../private/exports.js";

export default async (handler, conf) => Bun.serve({
  port: conf.port,
  hostname: conf.host,
  fetch: request => handler(request),
  tls: await get_options(conf),
});

