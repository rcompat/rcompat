function $new<T extends object>(obj: T): Readonly<T> {
  return Object.freeze(Object.assign(Object.create(null), obj));
}

export default $new;
