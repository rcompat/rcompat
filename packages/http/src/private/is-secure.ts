import { FlatFile } from "@rcompat/fs";
import type Conf from "@rcompat/http/#/conf";
import is from "@rcompat/invariant/is";

export default (conf: Conf) => {
  is(conf).object();

  const { ssl } = conf;

  return ssl?.key instanceof FlatFile && ssl.cert instanceof FlatFile;
}
