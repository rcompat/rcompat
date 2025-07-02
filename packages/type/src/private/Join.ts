type Join<T extends string[], Separator extends string = ","> =
  T extends [] ? "" :
    T extends [infer First extends string] ? First :
      T extends [infer First extends string, ...infer Rest extends string[]]
        ? `${First}${Separator} ${Join<Rest, Separator>}` : string;

export type { Join as default };
