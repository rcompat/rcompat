export default {
  encode: (decoded: string) => btoa(decoded),
  decode: (encoded: string) => atob(encoded),
};
