import { webcrypto as node_crypto } from "node:crypto";
import { platform } from "@rcompat/core";

export default platform() === "bun" ? crypto : node_crypto;
