import { fileURLToPath } from "node:url";

export default (p: string) => p.startsWith("file://") ? fileURLToPath(p) : p;

