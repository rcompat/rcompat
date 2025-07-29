// @ts-expect-error analysis
const webview = await import("../../../platform/window-x64/webview.bin", {
  with: { type: "file" }
});
export default webview.default;
