import symbols from "#deno/symbols";
import entries from "@rcompat/dict/entries";

export default (path: string) => Deno.dlopen(path,
  entries(symbols).keymap(([key]) => `webview_${key}` as any).get());
