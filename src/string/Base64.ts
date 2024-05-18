export default {
  encode: (decoded: string): string => btoa(decoded),
  decode: (encoded: string): string => atob(encoded),
};
