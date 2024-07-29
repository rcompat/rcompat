import get_options from "#get-options";
import handle_ws from "#handle-ws";
import type Actions from "#types/Actions";
import type Conf from "#types/Conf";
import type Handler from "#types/Handler";
import identity from "@rcompat/function/identity";

export default async (handler: Handler, conf: Conf) => {
  Deno.serve({
    port: conf.port,
    hostname: conf.host,
    // suppress default "Listening on" message
    onListen: identity,
    ...await get_options(conf),
  }, handler);

  return {
    upgrade(request: Request, actions: Actions) {
      const { socket, response } = Deno.upgradeWebSocket(request);
      handle_ws(socket, actions);
      return response;
    },
  };
};
