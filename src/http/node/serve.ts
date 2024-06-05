import { Writable } from "node:stream";
import type { IncomingMessage, ServerResponse } from "node:http";
import { WebSocketServer } from "ws";
import PseudoRequest from "./Request.js";
import { is_secure, get_options, handle_ws } from "../private/exports.js";
import type { Handler, Conf, Actions } from "../types.js";

const wss = new WebSocketServer({ noServer: true });

const get_url = (request: IncomingMessage) => {
  try {
    return new URL(request.url as string, `http://${request.headers.host}`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default async (handler: Handler, conf: Conf) =>
  import(is_secure(conf) ? "https" : "http").then(async ({ createServer }) => {
    createServer(await get_options(conf), async (req: IncomingMessage, res: ServerResponse) => {

      // handler gets a WHATWG Request, and returns a WHATWG Response
      //
      // 1. wrap a node request in a WHATWG request
      const url = get_url(req);

      if (url === null) {
        res.end();
        return;
      }

      const request = new PseudoRequest(`${url}`, req);

      const response = await handler(request);

      // no return (WebSocket)
      if (response === null) {
        return;
      }

      [...response.headers.entries()].forEach(([name, value]) => {
        res.setHeader(name, value);
      });

      res.writeHead(response.status);

      // 2. copy from a WHATWG response into a node response
      const { body } = response;

      if (body === null) {
        res.end();
      } else {
        try {
          await body.pipeTo(Writable.toWeb(res));
        } catch {
          await body.cancel();
        }
      }
    }).listen(conf.port, conf.host);
    return {
      upgrade({ original }: PseudoRequest, actions: Actions) {
        const null_buffer = Buffer.from([]);
        wss.handleUpgrade(original, original.socket, null_buffer, socket => {
          handle_ws(socket, actions);
        });
        return null;
      },
    };
  });
