import { is } from "@rcompat/invariant";
import type { Conf } from "../types.js";

export default (conf: Conf) => {
  is(conf).object();

  const { ssl } = conf;

  return ssl?.key !== undefined && ssl.cert !== undefined;
}
