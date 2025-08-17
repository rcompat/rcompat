import type Actions from "#Actions";
import type WebSocket from "ws";

export default (socket: WebSocket, actions: Actions) => {
  const { close, message, open } = actions;

  if (message !== undefined) {
    socket.addEventListener("message", event => {
      message(socket, event.data as string);
    });
  }
  if (close !== undefined) {
    socket.addEventListener("close", () => close(socket));
  }

  open?.(socket);
};
