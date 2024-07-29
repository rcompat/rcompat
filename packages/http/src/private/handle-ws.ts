import type Actions from "#types/Actions";

export default (socket: WebSocket, actions: Actions) => {
  if (actions.message !== undefined) {
    const action = actions.message;

    socket.addEventListener("message", event => {
      action(socket, event.data as string);
    });
  }
  if (actions.open !== undefined) {
    socket.addEventListener("open", actions.open);
  }
  if (actions.close !== undefined) {
    socket.addEventListener("close", actions.close);
  }
};
