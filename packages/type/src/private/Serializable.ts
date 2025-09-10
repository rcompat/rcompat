import type JSONValue from "#JSONValue";

export default interface Serializable {
  toJSON(): JSONValue;
}
