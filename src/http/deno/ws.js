import { ws_actions } from "../private/exports.js";

export const upgrade = (original, actions) => {
  const { socket, response } = Deno.upgradeWebSocket(original);
  ws_actions.filter(([key]) => actions[key]).forEach(([key, action]) =>
    action(socket, actions[key]));
  return response;
};
