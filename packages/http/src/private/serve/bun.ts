import type Actions from "#Actions";
import type Conf from "#Conf";
import get_options from "#get-options";
import type Handler from "#Handler";
import type Server from "#Server";
import type { ServerWebSocket } from "bun";

export default async (handler: Handler, conf: Conf): Promise<Server> => {
  const server = Bun.serve({
    fetch: handler,
    hostname: conf.host,
    port: conf.port,
    tls: await get_options(conf),
    websocket: {
      close(socket: ServerWebSocket<{ actions: Actions }>) {
        socket.data.actions.close?.(socket);
      },
      message(socket: ServerWebSocket<{ actions: Actions }>, message: Buffer | string) {
        socket.data.actions.message?.(socket, message);
      },
      open(socket: ServerWebSocket<{ actions: Actions }>) {
        socket.data.actions.open?.(socket);
      },
    },
  });

  return {
    stop() {
      server.stop();
    },
    upgrade(request: Request, actions) {
      server.upgrade(request, { data: { actions } });

      return null;
    },
  };
};
