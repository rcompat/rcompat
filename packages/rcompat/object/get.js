export default (object, path) =>
  path.split(".").reduce((subobject, key) =>
    subobject?.[key], object);
