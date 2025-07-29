const i = await import(`../${process.platform}-${process.arch}/index.js`);

export default i.default;
