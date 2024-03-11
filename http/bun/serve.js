import { get_options } from "../private/exports.js";

export default async (handler, conf) => {
  const server = Bun.serve({
    port: conf.port,
    hostname: conf.host,
    fetch: request => handler(request),
    tls: await get_options(conf),
    websocket: {
      message(socket, message) {
        socket.data.actions.message?.(socket, message);
      },
      open(socket) {
        socket.data.actions.open?.(socket);
      },
      close(socket) {
        socket.data.actions.close?.(socket);
      },
    },
  });
  return {
    upgrade(request, actions = {}) {
      server.upgrade(request, { data: { actions } });
    },
  };
};

