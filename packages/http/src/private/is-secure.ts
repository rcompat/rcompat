import type Conf from "#Conf";
import assert from "@rcompat/assert";
import fs from "@rcompat/fs";

export default (conf: Conf) => {
  assert.dict(conf);

  const { ssl } = conf;

  return ssl !== undefined && fs.isRef(ssl.key) && fs.isRef(ssl.cert);
};
