declare const self: Worker;

import type { Size } from "../../public/bun/Webview.js";
import Webview from "../../public/bun/Webview.js";

let webview: Webview;

const events: any = {
  construct(debug: boolean, library: string) {
    webview = new Webview({ debug, library: Bun.file(library) });
  },
  navigate(url: string) {
    webview.navigate(url);
  },
  run() {
    webview.run();
  },
  destroy() {
    webview.destroy();
  },
  set_html(html: string) {
    webview.html = html;
  },
  set_size(size: Size) {
    webview.size = size;
  }
};

self.addEventListener("message", (event: Bun.MessageEvent) => {
  const { name, params = [] } = event.data;
  events[name](...params);
});
