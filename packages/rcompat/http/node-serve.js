import { Writable } from "stream";
import Request from "./Request.js";
import get_options from "./get-options.js";
import secure from "./secure.js";

const dedouble = url => url.replaceAll(/\/{1,}/ug, () => "/");

export default async (handler, conf) =>
  import(secure(conf) ? "https" : "http").then(async ({ createServer }) =>
    createServer(await get_options(conf), async (req, res) => {
      // handler gets a WHATWG Request, and returns a WHATWG Response
      //
      // 1. wrap a node request in a WHATWG request
      const url = new URL(dedouble(req.url), `http://${req.headers.host}`);
      const request = new Request(`${url}`, req);

      const response = await handler(request);

      [...response.headers.entries()].forEach(([name, value]) => {
        res.setHeader(name, value);
      });

      res.writeHead(response.status);

      // 2. copy from a WHATWG response into a node response
      const { body } = response;
      try {
        await body.pipeTo(Writable.toWeb(res));
      } catch (error) {
        await body.cancel();
      }
    }).listen(conf.port, conf.host));
