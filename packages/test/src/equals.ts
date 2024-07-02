const array = (left: any, right: any) =>
  left.reduce((to: any, _: any, i: any) => to && equals(left[i], right[i]), true);

const deepCompare = (left: any, right: any): any =>
  Object.keys(left).reduce((to, key) =>
    to && equals(left[key], right[key]), true);

const object = (left: any, right: any) =>
  deepCompare(left, right) && deepCompare(right, left);

const date = (left: any, right: any) =>
  left instanceof Date ? `${left}` === `${right}` : object(left, right);

const arrays = (left: any, right: any) =>
  Array.isArray(left) && Array.isArray(right);

const deep = (left: any, right: any) => arrays(left, right)
  ? array(left, right)
  : date(left, right);

const isNull = (left: any, right: any) =>
  left === null ? right === null : deep(left, right);

const compare = (left: any, right: any) =>
  typeof left === "object" ? isNull(left, right) : left === right;

const equals = (left: any, right: any) =>
  typeof left === typeof right ? compare(left, right) : false;

export default equals;
