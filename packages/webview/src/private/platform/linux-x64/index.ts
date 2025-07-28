// @ts-expect-error analysis
const webview = await import("./webview.bin", { with: { type: "file" } });
export default webview.default;
