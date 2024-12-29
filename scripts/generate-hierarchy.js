#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const { minimatch } = require("minimatch");

// Where we will write the final tree
const OUTPUT_PATH = path.join(__dirname, "..", "docs", "hierarchy.md");

/**
 * Reads .gitignore and returns an array of "positive" ignore patterns (no '!' lines).
 * Also transforms lines starting with "/" into something minimatch can handle, e.g. "/android" -> "android/**".
 */
function getIgnorePatterns(rootDir) {
  const gitignorePath = path.join(rootDir, ".gitignore");
  if (!fs.existsSync(gitignorePath)) {
    console.log("[DEBUG] No .gitignore file found.");
    return [];
  }

  const rawLines = fs.readFileSync(gitignorePath, "utf8").split("\n");
  const cleanedLines = rawLines
    .map((line) => line.trim())
    // skip blank lines, lines with "#", or lines that start with "!"
    .filter((line) => line && !line.startsWith("#") && !line.startsWith("!"))
    .map((line) => {
      // If it starts with a slash, remove slash, then append "**" to match all subfiles
      // e.g. "/android" -> "android/**"
      if (line.startsWith("/")) {
        const noSlash = line.slice(1); // remove leading slash
        // If it doesn't already end with "/", let's ensure it matches entire sub-tree
        return noSlash.endsWith("/")
          ? `${noSlash}**`
          : `${noSlash}/**`;
      }
      return line; // unchanged if it doesn’t start with slash
    });

  console.log("[DEBUG] Using these .gitignore patterns:", cleanedLines);
  return cleanedLines;
}

/**
 * Converts an array of file paths into a nested object, then prints as ASCII tree.
 */
function buildTree(paths) {
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

  function printNode(node, depth = 0) {
    const indent = "  ".repeat(depth);
    const entries = Object.keys(node).sort();
    let output = "";

    entries.forEach((entry) => {
      const value = node[entry];
      output += `${indent}├── ${entry}\n`;
      if (value && typeof value === "object") {
        output += printNode(value, depth + 1);
      }
    });

    return output;
  }

  return printNode(tree);
}

function generateHierarchy() {
  const rootDir = path.join(__dirname, "..");
  const ignorePatterns = getIgnorePatterns(rootDir);

  // Grab all files/folders except node_modules & .git
  const allPaths = glob.sync("**/*", {
    cwd: rootDir,
    dot: false,    // skip hidden files/folders
    nodir: false,  // match directories too
    ignore: [
      "node_modules/**",
      ".git/**",
      "assets/icons/**",
      "assets/images/**",
    ],
  });

  console.log(`[DEBUG] Found ${allPaths.length} items in allPaths.`);

  // Filter out anything matching the ignore patterns from .gitignore
  const filtered = allPaths.filter((relPath) => {
    // If it matches any pattern, exclude it
    const isIgnored = ignorePatterns.some((pattern) =>
      minimatch(relPath, pattern, { dot: true })
    );
    return !isIgnored;
  });

  console.log(`[DEBUG] After ignoring patterns, ${filtered.length} remain.`);

  // Also exclude docs/hierarchy.md and this script itself
  const finalPaths = filtered.filter(
    (p) =>
      !p.includes("docs/hierarchy.md") &&
      !p.includes("scripts/generate-hierarchy.js")
  );

  console.log(`[DEBUG] finalPaths has ${finalPaths.length} items.`);

  // Build the final ASCII tree
  const treeText = buildTree(finalPaths);

  // Prepare the output Markdown
  const outputContent = `# Project File Hierarchy

\`\`\`
${treeText.trim()}
\`\`\`
`;

  fs.writeFileSync(OUTPUT_PATH, outputContent, "utf8");
  console.log(`Updated file hierarchy written to: ${OUTPUT_PATH}`);
}

// Run
generateHierarchy();
