const dirname = import.meta.dirname;

const i = await import(`${dirname}/../${process.platform}-${process.arch}/index.js`);

export default i.default;
