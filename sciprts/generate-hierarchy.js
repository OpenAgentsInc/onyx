#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const minimatch = require("minimatch").minimatch;

// Where we will write the final tree
const OUTPUT_PATH = path.join(__dirname, "..", "docs", "hierarchy.md");

// Read and parse .gitignore file into patterns
function getIgnorePatterns(rootDir) {
  const gitignorePath = path.join(rootDir, ".gitignore");
  if (!fs.existsSync(gitignorePath)) {
    return [];
  }

  const lines = fs
    .readFileSync(gitignorePath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#")); // ignore comments & empty lines

  return lines;
}

// Build an ASCII tree (or similar) for the given list of paths
// Expects an array of file paths (relative) like ["app.js", "src/index.js", "src/utils/test.js"]
function buildTree(paths) {
  // Convert to a nested object structure for easy printing
  const tree = {};

  paths.forEach((filePath) => {
    const segments = filePath.split(path.sep);

    let currentNode = tree;
    segments.forEach((segment, idx) => {
      const isLast = idx === segments.length - 1;
      if (!currentNode[segment]) {
        currentNode[segment] = isLast ? null : {};
      }
      if (!isLast) {
        currentNode = currentNode[segment];
      }
    });
  });

  // Recursive printer
  function printNode(node, depth = 0) {
    const indent = "  ".repeat(depth);
    const entries = Object.keys(node).sort(); // sort alphabetically
    let output = "";

    entries.forEach((entry) => {
      const value = node[entry];
      output += `${indent}├── ${entry}\n`;
      if (value && typeof value === "object") {
        // It's a folder
        output += printNode(value, depth + 1);
      }
    });

    return output;
  }

  return printNode(tree);
}

// Main driver
function generateHierarchy() {
  const rootDir = path.join(__dirname, "..");
  const ignorePatterns = getIgnorePatterns(rootDir);

  // Grab all files and folders except .git, node_modules, etc.
  // We'll use glob's pattern "**/*" to get everything (including subfolders).
  // We pass glob options to avoid matching dotfiles or special directories automatically
  const allPaths = glob.sync("**/*", {
    cwd: rootDir,
    dot: false,         // skip hidden files
    nodir: false,       // include directories in the match
    ignore: [
      // We'll ignore node_modules, .git, etc. as a fallback
      "node_modules/**",
      ".git/**",
      // The user’s .gitignore patterns will also be applied
    ],
  });

  // Filter out anything matching .gitignore patterns
  const filtered = allPaths.filter((relPath) => {
    // If any pattern matches, we exclude the path
    return !ignorePatterns.some((pattern) =>
      minimatch(relPath, pattern, { dot: true })
    );
  });

  // Filter out the docs/hierarchy.md file itself to avoid recursion
  const finalPaths = filtered.filter(
    (p) => !p.includes("docs/hierarchy.md") && !p.includes("scripts/generate-hierarchy.js")
  );

  // Build the hierarchical tree structure in text
  const treeText = buildTree(finalPaths);

  // Prepare final markdown content
  const outputContent = `# Project File Hierarchy

\`\`\`
${treeText.trim()}
\`\`\`
`;

  fs.writeFileSync(OUTPUT_PATH, outputContent, "utf8");
  console.log(`Updated file hierarchy written to: ${OUTPUT_PATH}`);
}

generateHierarchy();
