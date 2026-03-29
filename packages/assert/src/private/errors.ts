import error from "@rcompat/error";

function s(x: unknown): string {
  try {
    const stringified = JSON.stringify(x) as string | undefined;
    if (stringified !== undefined) {
      return stringified;
    }
  } catch {
    // bigint will throw
  }
  if (x?.toString !== undefined) {
    return x!.toString();
  }
  return `${x}`;
}

const t = error.template;

function primitive(x: unknown, type: string) {
  return error.template`${s(x)} must be of type ${type}`;
}

// primitives
function invalid_bigint(x: unknown) { return primitive(x, "bigint"); }
function invalid_boolean(x: unknown) { return primitive(x, "boolean"); }
function invalid_function(x: unknown) { return primitive(x, "function"); }
function invalid_number(x: unknown) { return primitive(x, "number"); }
function invalid_string(x: unknown) { return primitive(x, "string"); }
function invalid_symbol(x: unknown) { return primitive(x, "symbol"); }
function invalid_undefined(x: unknown) { return primitive(x, "undefined"); }

const PRIMITIVES = {
  invalid_bigint,
  invalid_boolean,
  invalid_function,
  invalid_number,
  invalid_string,
  invalid_symbol,
  invalid_undefined,
};

// conditions
function invalid_array(x: unknown) { return t`${s(x)} must be array`; }
function invalid_date(x: unknown) { return t`${s(x)} must be Date`; }
function invalid_dict(x: unknown) {
  return t`${s(x)} must be a plain object (dictionary)`;
}
function invalid_error(x: unknown) { return t`${s(x)} must be Error`; }
function invalid_false(x: unknown) { return t`${s(x)} must be false`; }
function invalid_finite(x: unknown) { return t`${s(x)} must be finite number`; }
function invalid_int(x: unknown) { return t`${s(x)} must be integer`; }
function invalid_map(x: unknown) { return t`${s(x)} must be Map`; }
function invalid_nan(x: unknown) { return t`${s(x)} must be NaN`; }
function invalid_newable(x: unknown) { return t`${s(x)} must be newable`; }
function invalid_null(x: unknown) { return t`${s(x)} must be null`; }
function invalid_nullish(x: unknown) {
  return t`${s(x)} must be null or undefined`;
}
function invalid_object(x: unknown) { return t`${s(x)} must be object`; }
function invalid_promise(x: unknown) { return t`${s(x)} must be Promise`; }
function invalid_regexp(x: unknown) { return t`${s(x)} must be RegExp`; }
function invalid_safeint(x: unknown) { return t`${s(x)} must be safe integer`; }
function invalid_set(x: unknown) { return t`${s(x)} must be Set`; }
function invalid_true(x: unknown) { return t`${s(x)} must be true`; }
function invalid_uint(x: unknown) { return t`${s(x)} must be unsigned integer`; }
function invalid_url(x: unknown) { return t`${s(x)} must be URL`; }
function invalid_uuid(x: unknown) {
  return t`${s(x)} must be a valid UUIDv4 string`;
}
function invalid_empty(x: unknown) { return t`${s(x)} must be empty`; }
function invalid_nonempty(x: unknown) { return t`${s(x)} must not be empty`; }
function invalid_defined(x: unknown) { return t`${s(x)} must be defined`; }
function invalid_instance(x: unknown, name: string) {
  return t`${s(x)} must be instance of ${name}`;
}
function invalid_shape_dict(x: unknown) {
  return t`${s(x)} must be a plain object`;
}
function invalid_shape_property(key: string, type: string, x: unknown) {
  return t`property ${key} must be of type ${type}, got ${s(x)}`;
}

const CONDITIONS = {
  invalid_defined,
  invalid_array,
  invalid_date,
  invalid_dict,
  invalid_error,
  invalid_false,
  invalid_finite,
  invalid_int,
  invalid_map,
  invalid_nan,
  invalid_newable,
  invalid_null,
  invalid_nullish,
  invalid_object,
  invalid_promise,
  invalid_regexp,
  invalid_safeint,
  invalid_set,
  invalid_true,
  invalid_uint,
  invalid_url,
  invalid_uuid,
  invalid_empty,
  invalid_nonempty,
  invalid_instance,
  invalid_shape_dict,
  invalid_shape_property,
};

export default error.coded({
  ...PRIMITIVES,
  ...CONDITIONS,
});
