import get_options from "#get-options";
import handle_ws from "#handle-ws";
import type Server from "#Server";
import type Conf from "#types/Conf";
import type Handler from "#types/Handler";
import identity from "@rcompat/function/identity";

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
      handle_ws(socket, actions);
    },
    stop() {
      abort_controller.abort();
    }
  };
};
