import type { Conf } from "../types.js";

export default ({ ssl } : Conf) => ssl?.key !== undefined && ssl.cert !== undefined;
