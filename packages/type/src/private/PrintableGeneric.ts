import type Printable from "#Printable";

export default interface PrintableGeneric<Type> extends Printable {
  readonly Type: Type;
}
