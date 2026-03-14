import load from "#load";
import type { Dict } from "@rcompat/type";

const env: Dict<string> = {
  ...process.env as Dict<string>,
  ...await load(),
};

export default env;
