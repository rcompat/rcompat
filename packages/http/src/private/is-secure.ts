import FileRef from "@rcompat/fs/#/file-ref";
import type Conf from "@rcompat/http/#/conf";
import is from "@rcompat/invariant/is";

export default (conf: Conf) => {
  is(conf).object();

  const { ssl } = conf;

  return ssl?.key instanceof FileRef && ssl.cert instanceof FileRef;
}
