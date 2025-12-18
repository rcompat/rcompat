import assert from "@rcompat/assert";
import busboy from "busboy";
import type { IncomingMessage } from "node:http";
import { Readable } from "node:stream";
import { arrayBuffer, blob, json, text } from "node:stream/consumers";
import type { ReadableStream } from "node:stream/web";
import type { RequestDuplex } from "undici-types";

const no_body = ["GET", "HEAD"];

const unimplemented = () => {
  throw new Error("unimplemented");
};

export default class PseudoRequest {
  #incoming: IncomingMessage;
  #body: null | ReadableStream<any> = null;
  #body_used = false;
  #headers = new Headers();
  #url;
  #method;

  constructor(url: string, incoming: IncomingMessage) {
    assert.string(url);
    assert.string(incoming.method);
    assert.object(incoming.headers);

    this.#url = url;
    this.#incoming = incoming;
    this.#method = incoming.method ?? "GET";

    Object.entries(incoming.headers)
      .filter((header): header is [string, string] => typeof header[1] === "string")
      .forEach(entry => this.#headers.set(...entry));
  }

  get #parsable() {
    return this.#body === null && !no_body.includes(this.#method);
  }

  get body() {
    if (this.#parsable) {
      this.#body = Readable.toWeb(this.#incoming) as ReadableStream;
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

  async bytes() {
    this.#use_body();
    const buffer = await arrayBuffer(this.#incoming);
    return new Uint8Array(buffer);
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
    this.#use_body();

    const bb = busboy({ headers: this.#incoming.headers });
    const formData = new FormData();

    return new Promise((resolve, reject) => {
      bb.on("file", (name, file, info) => {
        const chunks: Buffer[] = [];
        const { filename, mimeType } = info;

        file.on("data", chunk => chunks.push(chunk));
        file.on("close", () => {
          const buffer = Buffer.concat(chunks);

          formData.append(name, new File([buffer], filename, {
            type: mimeType,
          }));
        });
      });
      bb.on("field", (key, value) => {
        formData.set(key, value);
      });

      bb.on("close", () => {
        resolve(formData);
      });

      bb.once("error", reject);

      this.#incoming.pipe(bb);
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
