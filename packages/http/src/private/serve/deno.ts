import type Conf from "#Conf";
import get_options from "#get-options";
import handle_ws from "#handle-ws-deno";
import type Handler from "#Handler";
import type Server from "#Server";
import identity from "@rcompat/function/identity";
import type { WebSocket } from "undici-types";

export default async (handler: Handler, conf: Conf): Promise<Server> => {
  const abort_controller = new AbortController();
  Deno.serve({
    port: conf.port,
    hostname: conf.host,
    // suppress default "Listening on" message
    onListen: identity,
    signal: abort_controller.signal,
    ...await get_options(conf),
  }, handler);

  return {
    upgrade(request: Request, actions) {
      const { socket } = Deno.upgradeWebSocket(request);
      handle_ws(socket as WebSocket, actions);
    },
    stop() {
      abort_controller.abort();
    }
  };
};
