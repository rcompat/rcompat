declare const self: Worker;

import Webview from "../../default/bun/Webview.js";
import type { Size } from "../../default/bun/Webview.js";

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

self.addEventListener("message", (event: MessageEvent) => {
  const { name, params = [] } = event.data;
  events[name](...params);
});
