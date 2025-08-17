import type Conf from "#Conf";
import is_secure from "#is-secure";
import is from "@rcompat/assert/is";

export default async (conf: Conf) => {
  is(conf).object();

  return is_secure(conf)
    ? {
      cert: await conf.ssl!.cert.text(),
      key: await conf.ssl!.key.text(),
    } : {};
};
