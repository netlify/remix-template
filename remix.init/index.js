const inquirer = require("inquirer");
const fs = require("fs/promises");
const { join } = require("path");
const PackageJson = require("@npmcli/package-json");
const execa = require("execa");
const { Command } = require("commander");

const foldersToExclude = [".github"];

// Netlify Edge Functions template file changes
const edgeFilesToCopy = [
  ["README-edge.md", "README.md"],
  ["netlify-edge-toml", "netlify.toml"],
  ["server.ts"],
  ["remix.config.js"],
  ["entry.server.tsx", "app/entry.server.tsx"],
  ["root.tsx", "app/root.tsx"],
  ["vscode.json", ".vscode/settings.json"],
];

// Netlify Functions template file changes
const filesToCopy = [
  ["README.md"],
  ["netlify-toml", "netlify.toml"],
  ["redirects", ".redirects"],
];

async function copyTemplateFiles({ files, rootDirectory }) {
  for (const [file, target] of files) {
    let sourceFile = file;
    let targetFile = target || file;

    await fs.copyFile(
      join(rootDirectory, "remix.init", sourceFile),
      join(rootDirectory, targetFile)
    );
  }
}

async function updatePackageJsonForEdge(directory) {
  const packageJson = await PackageJson.load(directory);
  const {
    dependencies: { "@remix-run/node": _node, ...dependencies },
    scripts,
    ...restOfPackageJson
  } = packageJson.content;

  packageJson.update({
    // dev script is the same as the start script for Netlify Edge, "cross-env NODE_ENV=production netlify dev"
    scripts: {
      ...scripts,
      dev: 'remix dev --manual -c "ntl dev --framework=#static"',
    },
    ...restOfPackageJson,
    dependencies: {
      ...dependencies,
      "@netlify/edge-functions": "^2.0.0",
      "@netlify/remix-edge-adapter": "^3.0.0",
      "@netlify/remix-runtime": "^2.0.0",
    },
  });

  await packageJson.save();
}

async function updatePackageJsonForFunctions(directory) {
  const packageJson = await PackageJson.load(directory);
  const {
    dependencies: { "@remix-run/node": _node, ...dependencies },
    scripts,
    ...restOfPackageJson
  } = packageJson.content;

  packageJson.update({
    ...restOfPackageJson,
    scripts: {
      ...scripts,
      build: "npm run redirects:enable && remix build",
      dev: "npm run redirects:disable && remix dev",
      "redirects:enable": "shx cp .redirects public/_redirects",
      "redirects:disable": "shx rm -f public/_redirects",
    },
    dependencies: {
      ...dependencies,
      "@netlify/functions": "^2.0.0",
      "@netlify/remix-adapter": "^2.0.0",
      shx: "^0.3.4",
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

async function installAdditionalDependencies({
  rootDirectory,
  packageManager,
}) {
  try {
    console.log(`Installing additional dependencies with ${packageManager}.`);
    const npmInstall = await execa(packageManager, ["install"], {
      cwd: rootDirectory,
      stdio: "inherit",
    });
  } catch (e) {
    console.log(
      `Unable to install additional packages. Run ${packageManager} install in the root of the new project, "${rootDirectory}".`
    );
  }
}

async function main({ rootDirectory, packageManager }) {
  await removeNonTemplateFiles({
    rootDirectory,
    folders: foldersToExclude,
  });

  if (!(await shouldUseEdge())) {
    await copyTemplateFiles({
      files: filesToCopy,
      rootDirectory,
    });
    await updatePackageJsonForFunctions(rootDirectory);
    await installAdditionalDependencies({ rootDirectory, packageManager });
    return;
  }

  await Promise.all([
    fs.mkdir(join(rootDirectory, ".vscode")),
    copyTemplateFiles({ files: edgeFilesToCopy, rootDirectory }),
  ]);

  await updatePackageJsonForEdge(rootDirectory);

  await installAdditionalDependencies({ rootDirectory, packageManager });
}

async function shouldUseEdge() {
  // parse the top level command args to see if edge was passed in
  const program = new Command();
  program
    .option(
      "--netlify-edge",
      "explicitly use Netlify Edge Functions to serve this Remix site.",
      undefined
    )
    .option(
      "--no-netlify-edge",
      "explicitly do NOT use Netlify Edge Functions to serve this Remix site - use Serverless Functions instead.",
      undefined
    );
  program.allowUnknownOption().parse();

  const passedEdgeOption = program.opts().netlifyEdge;

  if (passedEdgeOption !== true && passedEdgeOption !== false) {
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

  return passedEdgeOption;
}

module.exports = main;
