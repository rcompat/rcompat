import { runtime } from "rcompat/meta";
import { webcrypto as node_crypto } from "node:crypto";

export default runtime === "bun" ? crypto : node_crypto;
