import type FileRef from "#FileRef";
import error from "@rcompat/error";

const t = error.template;

function value_not_streamable(x: unknown) {
  return t`value ${x} is not Blob | ReadableStream | Streamable`;
}
function reached_fs_root() {
  return t`reached filesystem root`;
}
function missing_path_for_copy(file: FileRef) {
  return t`cannot copy missing path ${file.path}`;
}
function unknown_kind() {
  return t`unknown kind`;
}

const errors = error.coded({
  value_not_streamable,
  reached_fs_root,
  missing_path_for_copy,
  unknown_kind,
});

export default errors;
