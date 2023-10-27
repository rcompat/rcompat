export default {
  encode: decoded => btoa(decoded),
  decode: encoded => atob(encoded),
};
