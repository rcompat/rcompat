const webview = await import("../../../platform/windows-x64-webview.bin",
  {  with: { type: "file" } });
import base from "../base.js";

export default base(webview.default);
