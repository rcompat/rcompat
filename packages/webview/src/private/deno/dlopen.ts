import symbols from "#deno/symbols";
import dict from "@rcompat/dict";

export default (path: string) => Deno.dlopen(path,
  dict.mapKey(symbols, key => `webview_${key}`));
