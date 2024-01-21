import { Headers } from "./exports.js";
import { IncomingMessage } from "http";
import { Readable } from "stream";
import { is } from "rcompat/invariant";
import busboy from "busboy";

export default class Request {
  #original;
  #body;
  #headers = new Headers();
  #url;
  #method;

  constructor(input, request) {
    this.#original = request;

    const { headers, method = "GET" } = request;

    is(input).string();
    this.#url = input;

    is(method).string();
    this.#method = method;

    is(headers).object();
    Object.entries(headers).forEach(header => this.#headers.set(...header));

    this.#setBody(request ?? null);
  }

  async formData() {
    const bb = busboy({ headers: this.#original.headers });
    const fields = [];
    let resolve;

    bb.on("file", (name, file, info) => {
      const buffers = [];
      const { mimeType: type } = info;

      file.on("data", data => {
        buffers.push(data);
      }).on("close", () => {
        fields.push([name, new Blob([Buffer.concat(buffers)], { type })]);
      });
    });
    bb.on("field", (name, value) => {
      fields.push([name, value]);
    });
    bb.on("close", () => {
      resolve({
        entries() {
          return fields;
        },
      });
    });
    this.#original.pipe(bb);

    return new Promise($resolve => {
      resolve = $resolve;
    });
  }

  #setBody(input) {
    if (input instanceof IncomingMessage) {
      this.#body = Readable.toWeb(input);
    }
  }

  get headers() {
    return this.#headers;
  }

  get url() {
    return this.#url;
  }

  get body() {
    return this.#body;
  }

  get method() {
    return this.#method;
  }
}
