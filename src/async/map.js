export default (array, mapper) => Promise.all(array.map(mapper));
