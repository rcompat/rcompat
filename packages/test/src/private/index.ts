import type Body from "#Body";
import type End from "#End";
import repository from "#repository";
import type { Newable } from "@rcompat/type";

export default {
  case(name: string, body: Body) {
    repository.put(name, body);
  },
  ended(end: End) {
    repository.ended(end);
  },
};
