import type Conf from "#Conf";
import FileRef from "@rcompat/fs/FileRef";
import is from "@rcompat/invariant/is";

export default (conf: Conf) => {
  is(conf).object();

  const { ssl } = conf;

  return ssl?.key instanceof FileRef && ssl.cert instanceof FileRef;
}
