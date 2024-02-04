import { WebSocketServer } from "ws";
import { ws_actions } from "../private/exports.js";

const wss = new WebSocketServer({ noServer: true });

const done = response => socket => {
  ws_actions.filter(([key]) => response[key]).forEach(([key, action]) =>
    action(socket, response[key]));
};

export const upgrade = (original, response) => {
  const null_buffer = Buffer.from([]);
  wss.handleUpgrade(original, original.socket, null_buffer, done(response));
};
