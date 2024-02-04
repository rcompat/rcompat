import { ws_actions } from "../private/exports.js";

export const upgrade = (original, websocket) => {
  const { socket, response } = Deno.upgradeWebSocket(original);
  ws_actions.filter(([key]) => websocket[key]).forEach(([key, action]) =>
    action(socket, websocket[key]));
  return response;
};
