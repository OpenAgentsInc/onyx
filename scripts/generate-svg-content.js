const fs = require("fs");
const pathModule = require("path");

const svgDir = pathModule.join(process.cwd(), "assets/images/design");
const files = fs.readdirSync(svgDir).filter(f => f.endsWith(".svg"));
const svgContent = {};

files.forEach(file => {
  const content = fs.readFileSync(pathModule.join(svgDir, file), "utf8");
  const name = pathModule.basename(file, ".svg").toLowerCase();

  // Extract viewBox
  const viewBox = content.match(/viewBox="([^"]+)"/)?.[1] || "0 0 24 24";

  // First try to find path in a group with FILL
  let pathData = content.match(/id="[^"]*FILL[^"]*">\s*<path[^>]*d="([^"]+)"/)?.[1];

  // If not found, try regular path
  if (!pathData) {
    pathData = content.match(/<path[^>]*d="([^"]+)"[^>]*>/)?.[1];
  }

  // Extract other attributes, prioritizing those from FILL group
  const fillGroupMatch = content.match(/id="[^"]*FILL[^"]*">\s*<path([^>]*)>/);
  const regularPathMatch = content.match(/<path([^>]*)>/);
  const pathAttributes = fillGroupMatch?.[1] || regularPathMatch?.[1] || "";

  const fill = pathAttributes.match(/fill="([^"]+)"/)?.[1] || "#666666";
  const stroke = pathAttributes.match(/stroke="([^"]+)"/)?.[1];
  const strokeWidth = pathAttributes.match(/stroke-width="([^"]+)"/)?.[1];
  const strokeLinecap = pathAttributes.match(/stroke-linecap="([^"]+)"/)?.[1];
  const strokeLinejoin = pathAttributes.match(/stroke-linejoin="([^"]+)"/)?.[1];
  const strokeOpacity = pathAttributes.match(/stroke-opacity="([^"]+)"/)?.[1];

  // Get original width and height for scaling calculation
  const originalWidth = parseFloat(content.match(/width="([^"]+)px"/)?.[1] || "24");
  const originalHeight = parseFloat(content.match(/height="([^"]+)px"/)?.[1] || "24");

  if (pathData) {
    svgContent[name] = {
      viewBox: `0 0 ${originalWidth} ${originalHeight}`,
      path: pathData,
      ...(fill && { fill }),
      ...(stroke && { stroke }),
      ...(strokeWidth && { strokeWidth: parseFloat(strokeWidth) }),
      ...(strokeLinecap && { strokeLinecap }),
      ...(strokeLinejoin && { strokeLinejoin }),
      ...(strokeOpacity && { strokeOpacity: parseFloat(strokeOpacity) })
    };
  }
});

const output = `export const SVG_CONTENT = ${JSON.stringify(svgContent, null, 2)} as const;\n`;
fs.writeFileSync("app/hyperview/components/LocalSvg/svg-content.ts", output);
console.log("SVG content has been updated!");
