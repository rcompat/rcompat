import { platform } from "rcompat/package";
import { webcrypto as node_crypto } from "node:crypto";

export default platform() === "bun" ? crypto : node_crypto;
