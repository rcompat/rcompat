import FileRef from "#FileRef";
import is from "@rcompat/invariant/is";

export default (left: FileRef, right: FileRef) => {
  is(left.path).string();
  is(right.path).string();

  return left.path === right.path;
}
