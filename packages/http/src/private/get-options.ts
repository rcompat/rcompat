import type Conf from "@rcompat/http/#/conf";
import is_secure from "@rcompat/http/#/is-secure";
import is from "@rcompat/invariant/is";

export default async (conf: Conf) => {
  is(conf).object();

  return is_secure(conf)
  ? {
    key: await conf.ssl!.key.text(),
    cert: await conf.ssl!.cert.text(),
  } : {};
}
