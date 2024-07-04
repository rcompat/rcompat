import type { BunFile } from "bun";
import { FFIType as T, dlopen } from "bun:ffi";

export default (name: string | BunFile) => dlopen(name, {
  webview_create:    { returns: T.ptr, args: [T.i32, T.ptr] },
  webview_destroy:   { returns: T.void, args: [T.ptr] },
  webview_run:       { returns: T.void, args: [T.ptr] },
  webview_terminate: { returns: T.void, args: [T.ptr] },
  webview_navigate:  { returns: T.void, args: [T.ptr, T.ptr] },
  webview_set_title: { returns: T.void, args: [T.ptr, T.ptr] },
  webview_set_size:  { returns: T.void, args: [T.ptr, T.i32, T.i32, T.i32] },
  webview_set_html:  { returns: T.void, args: [T.ptr, T.ptr] },
});
