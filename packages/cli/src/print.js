import stdout from "@rcompat/stdio/stdout";

export default (...messages) => stdout.write(messages.join(" "));
