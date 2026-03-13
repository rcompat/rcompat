import extension from "#mime/extensions";
import resolve from "#mime/resolve";
import type from "#mime/types";

export default {
  extension,
  resolve,
  ...type,
};
