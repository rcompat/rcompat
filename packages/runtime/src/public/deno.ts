export default {
  name: "deno",
  bin: Deno.execPath(),
  script: Deno.mainModule,
  args: Deno.args,
  exit: (code?: number) => Deno.exit(code),
};
