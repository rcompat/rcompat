import { platform } from "@rcompat/core";

const [,, ...args] = platform() === "bun" ? Bun.argv : process.argv;
export default args;
