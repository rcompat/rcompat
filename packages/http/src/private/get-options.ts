import { is } from "@rcompat/invariant";
import type { Conf } from "../types.js";
import is_secure from "./is-secure.js";

export default async (conf: Conf) => {
  is(conf).object();

  return is_secure(conf)
  ? {
    key: await conf.ssl!.key.text(),
    cert: await conf.ssl!.cert.text(),
  } : {};
}
