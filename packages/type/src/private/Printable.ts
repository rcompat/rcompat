class Printable<Name extends string> {
  get Name(): Name {
    return undefined as unknown as Name;
  }
}

export { Printable as default };
