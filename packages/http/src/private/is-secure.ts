import type Conf from "#Conf";
import assert from "@rcompat/assert";
import fs from "@rcompat/fs";

export default (conf: Conf) => {
  assert.dict(conf);

  const { ssl } = conf;

  return ssl?.key instanceof fs.FileRef && ssl.cert instanceof fs.FileRef;
};
