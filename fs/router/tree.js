import Node from "./Node.js";

export default objects => {
  const tree = {
    root: new Node("$"),
    add(node, parts, file) {
      // anchor
      if (parts.length === 1) {
        node.filed(parts[0], file);
      } else {
        const next = node.interim(parts[0]);
        this.add(next, parts.slice(1), file);
      }
    },
    match(path) {
      const [_, ...parts] = path.split("/").map(p => p === "" ? "index" : p);
      const $parts = parts.filter((part, i) => i === 0 || part !== "index");
      return this.root.match($parts.concat("index"), false) ?? this.root.match($parts);
    },
    print() {
      this.root.print();
    },
  };
  for (const [path, file] of objects) {
    tree.add(tree.root, path.split("/"), file);
  }
  return tree;
};
