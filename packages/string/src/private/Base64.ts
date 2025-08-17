export default {
  decode: (encoded: string): string => atob(encoded),
  encode: (decoded: string): string => btoa(decoded),
};
