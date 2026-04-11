import assert from "@rcompat/assert";

function $new<T extends object>(dict: T): T {
  assert.dict(dict);

  return Object.freeze(Object.assign(Object.create(null), dict));
}

export default $new;
