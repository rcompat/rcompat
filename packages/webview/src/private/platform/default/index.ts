const webview = await import(`../${process.platform}-${process.arch}/webview.bin`, { with: { type: "file" } });
export default webview.default;
