import type Actions from "@rcompat/http/#/actions";
import type Conf from "@rcompat/http/#/conf";
import get_options from "@rcompat/http/#/get-options";
import type Handler from "@rcompat/http/#/handler";
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
