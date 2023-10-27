import { Headers } from "./exports.js";
import { IncomingMessage } from "http";
import { Readable } from "stream";
import { is } from "rcompat/invariant";

export default class Request {
  #body;
  #headers = new Headers();
  #url;
  #method;

  constructor(input, { body = null, headers, method = "GET" } = {}) {
    is(input).string();
    this.#url = input;

    is(method).string();
    this.#method = method;

    is(headers).object();
    Object.entries(headers).forEach(header => this.#headers.set(...header));

    this.#setBody(body);
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
