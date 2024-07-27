const webview = await import("../../../platform/darwin-x64-webview.bin",
  {  with: { type: "file" } });
import base from "../base.js";

export default base(webview.default);
