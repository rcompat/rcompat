import multiselect from "@rcompat/cli/prompts/multiselect";
import confirm from "@rcompat/cli/prompts/confirm";
import intro from "@rcompat/cli/prompts/intro";
import outro from "@rcompat/cli/prompts/outro";
import select from "@rcompat/cli/prompts/select";
import text from "@rcompat/cli/prompts/text";

(async () => {
  intro("Demo");
  const name = await text({ message: "Project name?", initial: "my-app" });
  const ok = await confirm({ message: "Proceed?", initial: true });
  const tpl = await select({
    message: "Template:", options: [
      { label: "App", value: "app" },
      { label: "Module", value: "module" },
    ]
  });
  const extras = await multiselect({
    message: "Extras:", options: [
      { label: "ESLint", value: "eslint" },
      { label: "Prettier", value: "prettier" },
    ]
  });
  outro(`name=${name}, ok=${ok}, tpl=${tpl}, extras=${extras.join(",")}`);
})();
