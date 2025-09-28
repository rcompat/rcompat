import type Serializable from "#Serializable";
import test from "@rcompat/test";

test.case("pass", assert => {
  class User implements Serializable {
    #id: number;
    #name: string;

    constructor(id: number, name: string) {
      this.#id = id;
      this.#name = name;
    }

    toJSON() {
      return {
        id: this.#id,
        name: this.#name,
      };
    }
  }

  const user = new User(1, "John");
  assert(user.toJSON())
    .type<{ id: number; name: string }>()
    .equals({ id: 1, name: "John" });
});
