import { platform } from "rcompat/package";

const [,, ...args] = platform() === "bun" ? Bun.argv : process.argv;
export default args;
