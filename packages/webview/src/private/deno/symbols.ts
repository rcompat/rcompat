export default {
  create: { parameters: ["i32", "pointer"], result: "pointer" },
  destroy: { parameters: ["pointer"], result: "void" },
  navigate: { parameters: ["pointer", "pointer"], result: "void" },
  run: { parameters: ["pointer"], result: "void" },
  set_html: { parameters: ["pointer", "pointer"], result: "void" },
  set_size: { parameters: ["pointer", "i32", "i32", "i32"], result: "void" },
  set_title: { parameters: ["pointer", "pointer"], result: "void" },
  terminate: { parameters: ["pointer"], result: "void" },
} as const;
