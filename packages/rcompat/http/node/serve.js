import { Writable } from "node:stream";
import { Request } from "rcompat/http";
import { upgrade } from "./ws.js";
import { is_secure, get_options } from "../private/exports.js";

export default async (handler, conf) =>
  import(is_secure(conf) ? "https" : "http").then(async ({ createServer }) => {
    createServer(await get_options(conf), async (req, res) => {

      // handler gets a WHATWG Request, and returns a WHATWG Response
      //
      // 1. wrap a node request in a WHATWG request
      const url = new globalThis.URL(req.url, `http://${req.headers.host}`);
      const request = new Request(`${url}`, req);

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
        } catch (error) {
          await body.cancel();
        }
      }
    }).listen(conf.port, conf.host);
    return {
      upgrade(request, response) {
        upgrade(request.original, response);
        return null;
      },
    };
  });
