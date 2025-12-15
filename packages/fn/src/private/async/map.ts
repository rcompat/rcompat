export interface AsyncMapper<T, U> {
  (t: T, index: number, arr: T[]): Promise<U>;
}

export default <T, U>(array: T[], mapper: AsyncMapper<T, U>): Promise<U[]> =>
  Promise.all(array.map(mapper));
