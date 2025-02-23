import type Actions from "#Actions";
import get_options from "#get-options";
import handle_ws from "#handle-ws";
import is_secure from "#is-secure";
import PseudoRequest from "#PseudoRequest";
import type Server from "#Server";
import Status from "#Status";
import type Conf from "#types/Conf";
import tryreturn from "@rcompat/async/tryreturn";
import override from "@rcompat/record/override";
import type { IncomingMessage, ServerResponse } from "node:http";
import { Writable } from "node:stream";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

const get_url = (request: IncomingMessage) => {
  try {
    return new URL(request.url as string, `http://${request.headers.host}`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const defaults: Conf = {
  host: "localhost",
  port: 6161,
};

type NullableHandler = (request: Request | PseudoRequest) =>
  Response | Promise<Response> | Promise<null>;

export default async (handler: NullableHandler, conf?: Conf): Promise<Server> => {
  const $conf = override(defaults, conf ?? {});

  const module = await import(is_secure($conf) ? "https" : "http");
  const options = await get_options($conf);

  module.createServer(options,
    async (node_request: IncomingMessage, node_response: ServerResponse) => {

    // handler gets a WHATWG Request, and returns a WHATWG Response
    //
    // 1. wrap a node request in a WHATWG request
    const url = get_url(node_request);

    if (url === null) {
      node_response.end();
      return;
    }

    const request = new PseudoRequest(`${url}`, node_request);

    const response = await tryreturn(async () => await handler(request))
      .orelse(async () =>
        new Response(null, { status: Status.INTERNAL_SERVER_ERROR }));

    // keep the connection alive (101 switching protocols)
    if (response === null) {
      return;
    }

    [...response.headers.entries()].forEach(([name, value]) => {
      node_response.setHeader(name, value);
    });

    node_response.writeHead(response.status);

    // no body, end response
    if (response.body === null) {
      return node_response.end();
    }

    // 2. copy from a WHATWG response into a node response
    const { body } = response;

    try {
      await body.pipeTo(Writable.toWeb(node_response));
    } catch {
      await body.cancel();
    }
  }).listen($conf.port, $conf.host);

  return {
    upgrade(request: PseudoRequest, actions: Actions) {
      const { original } = request;
      const null_buffer = Buffer.from([]);
      wss.handleUpgrade(original, original.socket, null_buffer, socket => {
        handle_ws(socket, actions);
      });
    },
    // currently noop
    stop() {},
  };
};
