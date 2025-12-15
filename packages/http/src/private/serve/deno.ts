import type Conf from "#Conf";
import get_options from "#get-options";
import handle_ws from "#handle-ws-deno";
import type Handler from "#Handler";
import type Server from "#Server";
import fn from "@rcompat/fn";
import type { WebSocket } from "undici-types";

export default async (handler: Handler, conf: Conf): Promise<Server> => {
  const abort_controller = new AbortController();
  Deno.serve({
    hostname: conf.host,
    // suppress default "Listening on" message
    onListen: fn.identity,
    port: conf.port,
    signal: abort_controller.signal,
    ...await get_options(conf),
  }, handler);

  return {
    stop() {
      abort_controller.abort();
    },
    upgrade(request: Request, actions) {
      const { socket } = Deno.upgradeWebSocket(request);
      handle_ws(socket as WebSocket, actions);

      return null;
    },
  };
};
