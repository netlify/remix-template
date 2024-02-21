const {
  intro,
  outro,
  select,
  isCancel,
  cancel,
  spinner,
} = require("@clack/prompts");
const argh = require("argh");
const process = require("node:process");
const { relative, join, dirname } = require("node:path");
const fs = require("fs/promises");
const PackageJson = require("@npmcli/package-json");
const execa = require("execa");

const foldersToRemove = [".github"];

const packagesToRemove = {
  edge: ["@netlify/remix-adapter", "@netlify/functions"],
  functions: [
    "@netlify/edge-functions",
    "@netlify/remix-edge-adapter",
    "@netlify/remix-runtime",
  ],
};

async function mergeDirs(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  let entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      await mergeDirs(srcPath, destPath);
    } else {
      await fs.mkdir(dirname(destPath), { recursive: true });
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function copyTemplateFiles(rootDirectory) {
  const source = join(rootDirectory, "remix.init", "edge");
  await mergeDirs(source, rootDirectory);
}

async function removeDependencies(directory, dependencies) {
  const packageJson = await PackageJson.load(directory);

  const { dependencies: currentDependencies = {} } = packageJson.content;

  packageJson.update({
    dependencies: Object.fromEntries(
      Object.entries(currentDependencies).filter(
        ([dependency]) => !dependencies.includes(dependency)
      )
    ),
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
    const result = await execa(packageManager, ["install"], {
      cwd: rootDirectory,
      stdio: "ignore",
    });
    if (result.failed) {
      return false;
    }
  } catch (e) {
    return false;
  }
  // return true;
}

async function shouldUseEdge(rootDirectory) {
  const { "netlify-edge": netlifyEdge } = argh.argv;

  let useEdge = netlifyEdge;

  if (useEdge === undefined) {
    const projectType = await select({
      message: "Run your Remix site with:",
      options: [
        {
          value: "functions",
          label: "Netlify Functions",
          hint: "A Node-based runtime, running in one region",
        },
        {
          value: "edge",
          label: "Netlify Edge Functions",
          hint: "A web-based runtime, running at the edge",
        },
      ],
    });
    if (isCancel(projectType)) {
      cancel(
        `Project setup cancelled. Run remix init inside "${relative(
          process.cwd(),
          rootDirectory
        )}" to complete setup.`
      );
      process.exit(1);
    }
    useEdge = projectType === "edge";
  }
  return useEdge;
}

async function main({ rootDirectory, packageManager }) {
  intro(`Welcome to Remix on Netlify`);

  const useEdge = await shouldUseEdge(rootDirectory);
  const spin = spinner();
  spin.start("Setting up your project");
  if (useEdge) {
    await copyTemplateFiles(rootDirectory);
  }
  await removeNonTemplateFiles({
    rootDirectory,
    folders: foldersToRemove,
  });
  await fs.copyFile(
    join(rootDirectory, "remix.init", "README.md"),
    join(rootDirectory, "README.md")
  );
  spin.stop("Setup complete");

  spin.start("Updating dependencies");
  await removeDependencies(
    rootDirectory,
    packagesToRemove[useEdge ? "edge" : "functions"]
  );

  const result = await installAdditionalDependencies({
    rootDirectory,
    packageManager,
  });

  if (!result) {
    spin.stop("Failed");

    cancel(
      `Failed to install additional dependencies. Run "${packageManager} install" inside "${relative(
        process.cwd(),
        rootDirectory
      )}" to complete setup.`
    );
  } else {
    spin.stop("Dependencies updated");
    outro(`Project setup for Netlify complete. Happy Remixing!`);
  }
}

module.exports = main;
