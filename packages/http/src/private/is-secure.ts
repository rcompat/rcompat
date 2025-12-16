import type Conf from "#Conf";
import FileRef from "@rcompat/fs/FileRef";
import assert from "@rcompat/assert";

export default (conf: Conf) => {
  assert.dict(conf);

  const { ssl } = conf;

  return ssl?.key instanceof FileRef && ssl.cert instanceof FileRef;
};
