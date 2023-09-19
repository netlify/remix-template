const inquirer = require("inquirer");
const fs = require("fs/promises");
const { join } = require("path");
const PackageJson = require("@npmcli/package-json");
const execa = require("execa");

const foldersToExclude = [".github", ".git"];

// Netlify Edge Functions template file changes
const edgeFilesToCopy = [
  ["README-edge.md", "README.md"],
  ["netlify-edge-toml", "netlify.toml"],
  ["server.js"],
  ["remix.config.js"],
  ["entry.server.tsx", "app/entry.server.tsx"],
  ["root.tsx", "app/root.tsx"],
  ["vscode.json", ".vscode/settings.json"],
];

// Netlify Functions template file changes
const filesToCopy = [
  ["README.md"],
  ["netlify-toml", "netlify.toml"],
  ["_app_redirects"],
];

const tsExtensionMatcher = /\.ts(x?)$/;

function convertToJsExtension(file) {
  return file.replace(tsExtensionMatcher, ".js$1");
}

async function copyTemplateFiles({ files, rootDirectory, isTypeScript }) {
  for (const [file, target] of files) {
    let sourceFile = file;
    let targetFile = target || file;

    // change the target file extension .tsx to .jsx only if the project has been converted to JavaScript
    if (!isTypeScript && file.match(tsExtensionMatcher)) {
      // If they chose JavaScript, the source file is converted to .js or .jsx and
      // we need the target file to be .js or .jsx for the same reason.
      sourceFile = convertToJsExtension(file);
      targetFile = convertToJsExtension(targetFile);
    }

    await fs.copyFile(
      join(rootDirectory, "remix.init", sourceFile),
      join(rootDirectory, targetFile)
    );
  }
}

async function updatePackageJsonForEdge(directory) {
  const packageJson = await PackageJson.load(directory);
  const {
    dependencies: {
      "@remix-run/node": _node,
      ...dependencies
    },
    scripts,
    ...restOfPackageJson
  } = packageJson.content;

  packageJson.update({
    // dev script is the same as the start script for Netlify Edge, "cross-env NODE_ENV=production netlify dev"
    scripts: {
      ...scripts,
      predev: "rimraf ./.netlify/edge-functions/",
    },
    ...restOfPackageJson,
    dependencies: {
      ...dependencies,
      "@netlify/edge-functions": "^2.0.0",
      "@netlify/remix-edge-adapter": "1.2.0",
    },
  });

  await packageJson.save();
}

async function updatePackageJsonForFunctions(directory) {
  const packageJson = await PackageJson.load(directory);
  const {
    dependencies: {
      "@remix-run/node": _node,
      ...dependencies
    },
    scripts,
    ...restOfPackageJson
  } = packageJson.content;

  packageJson.update({
    ...restOfPackageJson,
    dependencies: {
      ...dependencies,
      "@netlify/remix-adapter": "^1.0.0",
    },
  });

  await packageJson.save();
}

async function removeNonTemplateFiles({ rootDirectory, folders }) {
  try {
    await Promise.allSettled(
      folders.map((folder) =>
        fs.rm(join(rootDirectory, folder), { recursive: true, force: true })
      )
    );
  } catch (e) {
    console.log(
      `Unable to remove folders ${folders.join(
        ", "
      )}. You can remove them manually.`
    );
  }
}

async function main({ rootDirectory, isTypeScript }) {
  await removeNonTemplateFiles({
    rootDirectory,
    folders: foldersToExclude,
  });

  if (!(await shouldUseEdge())) {
    await copyTemplateFiles({
      files: filesToCopy,
      rootDirectory,
      isTypeScript,
    });
    await updatePackageJsonForFunctions(rootDirectory);
    return;
  }

  await Promise.all([
    fs.mkdir(join(rootDirectory, ".vscode")),
    copyTemplateFiles({ files: edgeFilesToCopy, rootDirectory, isTypeScript }),
  ]);

  await updatePackageJsonForEdge(rootDirectory);

  // This is temporary as a workaround for a bug I encountered with the Remix CLI
  // import isbot from "isbot" converts to const isbot = require("isbot").default
  // instead of to const isbot = require("isbot")
  //
  // Remove this if the issue in the Remix CLI gets sorted.
  (async () => {
    if (!isTypeScript) {
      const path = join(rootDirectory, "/app/entry.server.jsx");
      const contents = await fs.readFile(path, "utf8");
      const newContent = contents.replace(
        `require("isbot").default`,
        `require("isbot")`
      );

      await fs.writeFile(path, newContent);
    }
  })();

  // The Netlify Edge Functions template has different and additional dependencies to install.
  try {
    console.log("installing additional npm packages...");
    const npmInstall = await execa("npm", ["install"], { cwd: rootDirectory });
    console.log(npmInstall.stdout);
  } catch (e) {
    console.log(
      `Unable to install additional packages. Run npm install in the root of the new project, "${rootDirectory}".`
    );
  }
}

async function shouldUseEdge() {
  const { edge } = await inquirer.prompt([
    {
      name: "edge",
      type: "list",
      message: "Run your Remix site with:",
      choices: [
        {
          name: "Netlify Functions",
          value: false,
        },
        {
          name: "Netlify Edge Functions",
          value: true,
        },
      ],
    },
  ]);

  return edge;
}

module.exports = main;
