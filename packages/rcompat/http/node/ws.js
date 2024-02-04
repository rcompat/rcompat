import { WebSocketServer } from "ws";
import { ws_actions } from "../private/exports.js";

const wss = new WebSocketServer({ noServer: true });

const done = actions => socket => {
  ws_actions.filter(([key]) => actions[key]).forEach(([key, action]) =>
    action(socket, actions[key]));
};

export const upgrade = (original, actions) => {
  const null_buffer = Buffer.from([]);
  wss.handleUpgrade(original, original.socket, null_buffer, done(actions));
};
