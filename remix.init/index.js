const inquirer = require("inquirer");
const fs = require("fs/promises");
const { join } = require("path");
const PackageJson = require("@npmcli/package-json");

const foldersToExclude = [".github"];

const filesToCopy = [
  ["README.md"],
  ["netlify.toml"],
  ["server.js"],
  ["remix.config.js"],
  ["vscode.json", join(".vscode", "settings.json")],
];

const filesToModify = ["app/entry.server.tsx", "app/root.tsx"];

async function modifyFilesForEdge(files, rootDirectory) {
  const filePaths = files.map((file) => join(rootDirectory, file));
  const contents = await Promise.all(
    filePaths.map((path) => fs.readFile(path, "utf8"))
  );

  await Promise.all(
    contents.map((content, index) => {
      const newContent = content.replace(
        /@remix-run\/node/g,
        "@netlify/remix-runtime"
      );
      return fs.writeFile(filePaths[index], newContent);
    })
  );
}

async function copyEdgeTemplateFiles(files, rootDirectory) {
  for (const [file, target] of files) {
    await fs.copyFile(
      join(rootDirectory, "remix.init", file),
      join(rootDirectory, target || file)
    );
  }
}

async function updatePackageJsonForEdge(directory) {
  const packageJson = await PackageJson.load(directory);
  const {
    dependencies: {
      "@remix-run/netlify": _netlify,
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
      dev: scripts["start"],
    },
    ...restOfPackageJson,
    dependencies: {
      ...dependencies,
      "@netlify/edge-functions": "^2.0.0",
      "@netlify/remix-edge-adapter": "1.0.0",
    },
  });

  await packageJson.save();
}

async function removeNonTemplateFiles({ rootDirectory, folders }) {
  try {
    await Promise.allSettled(
      folders.map((folder) =>
        fs.rm(join(rootDirectory, folder), { recursive: true })
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

async function main({ rootDirectory }) {
  await removeNonTemplateFiles({
    rootDirectory,
    folders: foldersToExclude,
  });

  if (!(await shouldUseEdge())) {
    return;
  }

  await Promise.all([
    fs.mkdir(join(rootDirectory, ".vscode")),
    copyEdgeTemplateFiles(filesToCopy, rootDirectory),
  ]);

  await Promise.all([
    modifyFilesForEdge(filesToModify, rootDirectory),
    updatePackageJsonForEdge(rootDirectory),
  ]);
}

async function shouldUseEdge() {
  const { edge } = await inquirer.prompt([
    {
      name: "edge",
      type: "list",
      message: "Run your Remix site with:",
      choices: [
        {
          name: "Netlify Functions - Choose this for stable support for production sites",
          value: false,
        },
        {
          name: "Netlify Edge Functions (beta) - Try this for improved performance on non-critical sites",
          value: true,
        },
      ],
    },
  ]);

  return edge;
}

module.exports = main;
