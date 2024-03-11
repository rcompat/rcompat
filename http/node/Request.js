import { Readable } from "node:stream";
import { is } from "rcompat/invariant";
import { stringify } from "rcompat/streams";
import busboy from "busboy";
import { Headers } from "../shared/exports.js";

export default class Request {
  #original;
  #body;
  #headers = new Headers();
  #url;
  #method;
  #parsed = false;

  constructor(url, original) {
    this.#original = original;

    const { headers, method = "GET" } = original;

    is(url).string();
    this.#url = url;

    is(method).string();
    this.#method = method;

    is(headers).object();
    Object.entries(headers).forEach(header => this.#headers.set(...header));

    this.#init_body();
  }

  get #has_body() {
    return["GET", "HEAD"].includes(this.#method);
  }

  #init_body() {
    // unparsed
    this.#body = this.#has_body ? null : this.#original;
  }

  #parse_body() {
    if (this.#has_body && !this.#parsed) {
      this.#body = Readable.toWeb(this.#original);
      this.#parsed = true;
    }
  }

  text() {
    this.#body = Readable.toWeb(this.#original);
    return stringify(this.#body);
  }

  async json() {
    this.#body = Readable.toWeb(this.#original);
    return JSON.parse(await stringify(this.#body));
  }

  async formData() {
    this.#parse_body();
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

  get original() {
    return this.#original;
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
