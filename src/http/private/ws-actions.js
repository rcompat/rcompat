export default Object.entries({
  message(socket, handler) {
    socket.addEventListener("message", event => {
      handler(socket, event.data);
    });
  },
  open(socket, handler) {
    socket.addEventListener("open", handler);
  },
  close(socket, handler) {
    socket.addEventListener("close", handler);
  },
});

