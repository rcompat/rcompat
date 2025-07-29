// @ts-expect-error analysis
const webview = await import("../../../platform/darwin-x64/webview.bin", {
  with: { type: "file" }
});
export default webview.default;
