export default (argv: string[]) => {
  const [,, ...args] = argv;
  return args;
};
