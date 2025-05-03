import Printable from "#Printable";

const s_type = Symbol("Type");

class PrintableGeneric<Name extends string, Type> extends Printable<Name> {
  get [s_type]() {
    return undefined as Type;
  }
}

export { PrintableGeneric as default };
