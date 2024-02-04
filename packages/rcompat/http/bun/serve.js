import { get_options } from "../private/exports.js";

export default async (handler, conf) => {
  const server = Bun.serve({
    port: conf.port,
    hostname: conf.host,
    fetch: request => handler(request),
    tls: await get_options(conf),
    websocket: {
      async message(socket, message) {
        const reply = await socket.data.message?.(message, socket);
        reply !== undefined && socket.send(reply);
      },
      open(socket) {
        socket.data.open?.(socket);
      },
      close(socket) {
        socket.data.close?.(socket);
      },
    },
  });
  return {
    upgrade(request, data) {
      server.upgrade(request, { data });
    },
  };
};

