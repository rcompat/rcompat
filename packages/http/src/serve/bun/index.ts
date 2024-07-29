import get_options from "#get-options";
import type Actions from "#types/Actions";
import type Conf from "#types/Conf";
import type Handler from "#types/Handler";
import type { ServerWebSocket } from "bun";

export default async (handler: Handler, conf: Conf) => {
  const server = Bun.serve({
    port: conf.port,
    hostname: conf.host,
    fetch: handler,
    tls: await get_options(conf),
    websocket: {
      message(socket: ServerWebSocket<{ actions: Actions }>, message) {
        socket.data.actions.message?.(socket, message);
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
    upgrade(request: Request, actions: Actions) {
      server.upgrade(request, { data: { actions } });
    },
    stop() {
      server.stop();
    }
  };
};
