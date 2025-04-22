import type Body from "#Body";
import type StaticBody from "#StaticBody";
import repository from "#repository";

export default {
  case(name: string, body: Body) {
    repository.put(name, body);
  },
  static(_body: StaticBody) {
    // noop
  },
};
