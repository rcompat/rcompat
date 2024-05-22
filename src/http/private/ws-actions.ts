import ws from "ws";

export default Object.entries({
  message(socket: ws.WebSocket, handler: Function) {
    socket.addEventListener("message", event => {
      handler(socket, event.data);
    });
  },
  open(socket: ws.WebSocket, handler: (event: ws.Event) => void) {
    socket.addEventListener("open", handler);
  },
  close(socket: ws.WebSocket, handler: (event: ws.Event) => void) {
    socket.addEventListener("close", handler);
  },
});

