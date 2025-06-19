const { execSync } = require("node:child_process");
const commitAndTagVersion = require("commit-and-tag-version");
const bump = require("commit-and-tag-version/lib/lifecycles/bump");
const { bumpFiles } = require("commit-and-tag-version/defaults");
function getMainLatestTag() {
  try {
    execSync("git fetch origin --tags", { stdio: "ignore" });

    const tag = execSync("git describe --tags origin/main --abbrev=0", {
      encoding: "utf-8",
    }).trim();

    return tag;
  } catch (error) {
    console.warn(
      "⚠️ Could not get latest tag from origin/main:",
      error.message,
    );
    return null;
  }
}

function getMainVersion() {
  try {
    execSync("git fetch origin main", { stdio: "ignore" });

    const raw = execSync("git show origin/main:package.json", {
      encoding: "utf-8",
    });

    const parsed = JSON.parse(raw);
    return parsed.version;
  } catch (error) {
    console.warn("⚠️ Could not get version from origin/main:", error.message);
    return null;
  }
}

function getCurrentBranch() {
  return (
    process.env.GITHUB_REF?.split("/").pop() ||
    process.env.BRANCH_NAME ||
    execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim()
  );
}

function main() {
  const currentBranch = getCurrentBranch();
  const mainVersion = getMainVersion();
  const latestTag = getMainLatestTag();
  console.log(mainVersion, latestTag);
  bump(
    {
      bumpFiles: bumpFiles,
      commitAll: false,
      dryRun: true,
      header: "# Changelog\n\n",
      silent: true,
      skip: {
        changelog: true,
        tag: true,
      },
    },
    latestTag,
  )
    .then((nextVersion) => {
      commitAndTagVersion({
        header: "# Changelog\n\n",
        prerelease: currentBranch === "dev" ? "dev" : false,
        "release-as": currentBranch === "dev" ? `v${nextVersion}` : mainVersion,
        silent: currentBranch === "dev",
        skip: {
          changelog: currentBranch === "dev",
          tag: currentBranch === "dev",
        },
      });
    })
    .catch((err) => {
      console.error(
        `commit-and-tag-version failed with message: ${err.message}`,
      );
    });
}

main();
