import Printable from "#Printable";

class PrintableGeneric<Name extends string, Type> extends Printable<Name> {
  get Infer() {
    return undefined as Type;
  }
}

export { PrintableGeneric as default };
