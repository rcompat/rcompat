const webview = await import("../../../platform/darwin-arm64-webview.bin",
  {  with: { type: "file" } });
import base from "../base.js";

export default base(webview.default);
