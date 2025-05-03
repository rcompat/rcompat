const s_name = Symbol("Name");

class Printable<Name extends string> {
  get [s_name](): Name {
    return undefined as unknown as Name;
  }
}

export { Printable as default };
