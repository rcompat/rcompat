// @ts-expect-error analysis
const webview = await import("../../../platform/darwin-arm64/webview.bin", {
  with: { type: "file" },
});
export default webview.default;
