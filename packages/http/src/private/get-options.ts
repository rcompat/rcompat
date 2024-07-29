import is_secure from "#is-secure";
import type Conf from "#types/Conf";
import is from "@rcompat/invariant/is";

export default async (conf: Conf) => {
  is(conf).object();

  return is_secure(conf)
  ? {
    key: await conf.ssl!.key.text(),
    cert: await conf.ssl!.cert.text(),
  } : {};
}
