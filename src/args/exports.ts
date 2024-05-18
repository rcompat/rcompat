import { runtime } from "rcompat/meta";

const [,, ...args] = runtime === "bun" ? Bun.argv : process.argv;
export default args;
