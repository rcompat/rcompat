type Primitive = boolean | number | string | null;

type Serializable = Primitive | Serializable[] | {
  [key: string]: Serializable;
};

export { Serializable as default };
