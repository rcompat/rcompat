import { UnimplementedError } from "@rcompat/core";

const unimplemented = (platform_name: string) => {
  throw new UnimplementedError(platform_name);
}

export default () => unimplemented("deno");
