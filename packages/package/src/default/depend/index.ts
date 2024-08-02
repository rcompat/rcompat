import bold from "@rcompat/cli/color/bold";
import red from "@rcompat/cli/color/red";
import yellow from "@rcompat/cli/color/yellow";
import print from "@rcompat/cli/print";
import manifest from "@rcompat/package/manifest";

const error_message = (pkg: string, dependencies: string[]) =>
  `${red("ERROR")} missing peer dependencies for package \`${yellow(pkg)}\`
  -> install with ${bold(`npm install ${dependencies.join(" ")}`)}
`;

type R = Record<PropertyKey, unknown>;

export default async (needed: string[], loader: string) => {
  const { devDependencies, dependencies } = (await manifest()) as
    { devDependencies: R, dependencies: R};
  const missing = needed
    .filter(dependency =>
      dependencies[dependency] === undefined
   && devDependencies[dependency] === undefined);

  if (missing.length > 0) {
    print(error_message(loader, missing));
  }
};
