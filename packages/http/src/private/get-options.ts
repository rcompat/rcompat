import type Conf from "#Conf";
import is_secure from "#is-secure";
import assert from "@rcompat/assert";

export default async (conf: Conf) => {
  assert.dict(conf);

  return is_secure(conf)
    ? {
      cert: await conf.ssl!.cert.text(),
      key: await conf.ssl!.key.text(),
    } : {};
};
