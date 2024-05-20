export default (object: unknown): object is Record<PropertyKey, unknown> => typeof object === "object" && object !== null;

