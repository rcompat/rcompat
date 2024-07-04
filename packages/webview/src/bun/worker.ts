const url = `../platform/${process.platform}-${process.arch}-webview.bin`;
const { default: library } = await import(url, { with: { type: "file" } });
// @ts-expect-error asset import
import worker_logic from "./worker/init.js" with { type: "file" };
import type { Size } from "./Webview.js";

export default class {
  #worker: any;

  constructor(debug = false) {
    this.#worker = new Worker(URL.createObjectURL(Bun.file(worker_logic)));
    this.message("construct", [debug, library]);
  }

  message(name: string, params: any[]) {
    this.#worker.postMessage({ name, params });
  }

  navigate(url: string) {
    this.#worker.postMessage({ name: "navigate", params: [url]});
  }

  set html(html: string) {
    this.#worker.postMessage({ name: "set_html", params: [html]});
  }

  set size(size: Size) {
    this.#worker.postMessage({ name: "set_size", params: [size]});
  }

  run() {
    this.#worker.postMessage({ name: "run" });
  }
}

