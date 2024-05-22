import type { Actions } from "../types.js";
import { ws_actions } from "../private/exports.js";

export const upgrade = (original: Request, actions: Actions) => {
  // @ts-ignore
  const { socket, response } = Deno.upgradeWebSocket(original);
  ws_actions.filter(([key]) => actions[key]).forEach(([key, action]) =>
    action(socket, actions[key] as never));
  return response;
};
