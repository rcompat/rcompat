import type { Size } from "../../default/bun/Webview.js";
// @ts-expect-error asset import
import worker from "./init.js" with { type: "file" };

export default (library: string) => class {
  #worker: any;
  #onclosed?: () => void;

  constructor(debug = false) {
    this.#worker = new Worker(URL.createObjectURL(Bun.file(worker)));
    this.#worker.onmessage = (event: MessageEvent) => {
      if (event.data === "destroyed") {
        this.#onclosed?.();
      }
    }
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

  closed(callback: () => void) {
    this.#onclosed = callback;
  }
}

