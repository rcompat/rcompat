import type { Actions } from "../types.js";
import { handle_ws } from "../private/exports.js";

export const upgrade = (original: Request, actions: Actions) => {
  // @ts-ignore
  const { socket, response } = Deno.upgradeWebSocket(original);
  handle_ws(actions, socket);
  return response;
};
