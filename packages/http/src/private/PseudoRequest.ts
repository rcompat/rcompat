import is from "@rcompat/invariant/is";
import busboy from "busboy";
import type { IncomingMessage } from "node:http";
import { Readable } from "node:stream";
import { arrayBuffer, blob, json, text } from "node:stream/consumers";
import type { RequestDuplex } from "undici-types";

export type CallableEntriesFn = {entries: ()
  => Iterable<readonly [PropertyKey, any]>};

const no_body = ["GET", "HEAD"];

const unimplemented = () => {
  throw new Error("unimplemented");
};

export default class PseudoRequest {
  #incoming: IncomingMessage;
  #body: ReadableStream<any> | null = null;
  #body_used = false;
  #headers = new Headers();
  #url;
  #method;

  constructor(url: string, incoming: IncomingMessage) {
    this.#incoming = incoming;

    const { headers, method = "GET" } = incoming;

    is(url).string();
    this.#url = url;

    is(method).string();
    this.#method = method;

    is(headers).object();
    Object.entries(headers)
      .filter((header): header is [string, string] => typeof header[1] === "string")
      .forEach(entry => this.#headers.set(...entry));
  }

  get #parsable() {
    return this.#body === null && !no_body.includes(this.#method);
  }

  get body() {
    if (this.#parsable) {
      this.#body = Readable.toWeb(this.#incoming);
    }
    return this.#body;
  }

  get bodyUsed() {
    return this.#body_used;
  }

  get cache() {
    return "default";
  }

  get credentials() {
     return "same-origin";
  }

  get destination() {
    return "";
  }

  get duplex(): RequestDuplex {
    return "half";
  }

  get headers(): unknown {
    return this.#headers;
  }

  get integrity() {
    return "";
  }

  get keepalive() {
    return true;
  }

  get method() {
    return this.#method;
  }

  get mode() {
    return "same-origin";
  }

  get redirect() {
    return "follow";
  }

  get referrer() {
    return this.#incoming.headers.referer;
  }

  get referrerPolicy() {
    return "";
  }

  get signal() {
    unimplemented();
    // ts;
    return new AbortSignal();
  }

  get url() {
    return this.#url;
  }

  // not in spec
  get original() {
    return this.#incoming;
  }

  #use_body() {
    if (this.#body_used) {
      throw new Error("ERR_BODY_ALREADY_USED");
    }
    this.#body_used = true;
  }

  arrayBuffer() {
    this.#use_body();
    return arrayBuffer(this.#incoming);
  }

  blob() {
    this.#use_body();
    return blob(this.#incoming);
  }

  clone() {
    unimplemented();
    // ts
    return this;
  }

  async formData(): Promise<FormData> {
    const bb = busboy({ headers: this.#incoming.headers });
    const form_data = new FormData();
    let resolve: (value: FormData) => void;

    bb.on("file", (name, file, info) => {
      const buffers: any[]= [];
      const { mimeType: type } = info;

      file.on("data", data => {
        buffers.push(data);
      }).on("close", () => {
        form_data.set(name, new Blob([Buffer.concat(buffers)], { type }));
      });
    });
    bb.on("field", (name, value) => {
      form_data.set(name, value);
    });
    bb.on("close", () => {
      resolve(form_data);
    });
    this.#incoming.pipe(bb);

    return new Promise($resolve => {
      resolve = $resolve;
    });
  }

  async json() {
    this.#use_body();
    return json(this.#incoming);
  }

  async text() {
    this.#use_body();
    return text(this.#incoming);
  }
}
