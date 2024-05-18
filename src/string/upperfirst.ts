export default (string: string): string => `${string.at(0)!.toUpperCase()}${string.slice(1)}`;
