import identity from "@rcompat/function/identity";
import type Actions from "@rcompat/http/#/actions";
import type Conf from "@rcompat/http/#/conf";
import get_options from "@rcompat/http/#/get-options";
import handle_ws from "@rcompat/http/#/handle-ws";
import type Handler from "@rcompat/http/#/handler";

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
