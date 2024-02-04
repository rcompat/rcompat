export default Object.entries({
  message(socket, handler) {
    socket.addEventListener("message", async event => {
      const reply = await handler(event.data, socket);
      reply !== undefined && socket.send(reply);
    });
  },
  open(socket, handler) {
    socket.addEventListener("open", handler);
  },
  close(socket, handler) {
    socket.addEventListener("close", handler);
  },
});

