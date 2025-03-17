export default <T>(a: T | T[]) => Array.isArray(a) ? a : [a];
