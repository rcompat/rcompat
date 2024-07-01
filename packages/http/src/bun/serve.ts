import { ServerWebSocket } from "bun";
import type { Conf, Handler, Actions } from "../types.js";
import { get_options } from "../private/exports.js";

export default async (handler: Handler, conf: Conf) => {
  const server = Bun.serve({
    port: conf.port,
    hostname: conf.host,
    fetch: request => handler(request),
    tls: await get_options(conf),
    websocket: {
      message(socket: ServerWebSocket<{ actions: Actions }>, message) {
        socket.data?.actions.message?.(socket, message);
      },
      open(socket: ServerWebSocket<{ actions: Actions }>) {
        socket.data.actions.open?.(socket);
      },
      close(socket: ServerWebSocket<{ actions: Actions }>) {
        socket.data.actions.close?.(socket);
      },
    },
  });
  return {
    upgrade(request: Request, actions = {}) {
      server.upgrade(request, { data: { actions } });
    },
  };
};

