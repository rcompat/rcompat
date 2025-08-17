import type { BunFile } from "bun";
import { FFIType as T, dlopen } from "bun:ffi";

export default (name: BunFile | string) => dlopen(name, {
  webview_create: { args: [T.i32, T.ptr],  returns: T.ptr },
  webview_destroy: { args: [T.ptr], returns: T.void },
  webview_navigate: { args: [T.ptr, T.ptr], returns: T.void },
  webview_run: { args: [T.ptr], returns: T.void },
  webview_set_html: { args: [T.ptr, T.ptr], returns: T.void },
  webview_set_size: { args: [T.ptr, T.i32, T.i32, T.i32], returns: T.void },
  webview_set_title: { args: [T.ptr, T.ptr], returns: T.void },
  webview_terminate: { args: [T.ptr], returns: T.void },
});
