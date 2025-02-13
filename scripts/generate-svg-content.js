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

  // Extract path data
  const pathData = content.match(/<path[^>]*d="([^"]+)"[^>]*>/)?.[1];

  // Extract other attributes from path
  const fill = content.match(/fill="([^"]+)"/)?.[1] || "#666666";
  const stroke = content.match(/stroke="([^"]+)"/)?.[1];
  const strokeWidth = content.match(/stroke-width="([^"]+)"/)?.[1];
  const strokeLinecap = content.match(/stroke-linecap="([^"]+)"/)?.[1];
  const strokeLinejoin = content.match(/stroke-linejoin="([^"]+)"/)?.[1];
  const strokeOpacity = content.match(/stroke-opacity="([^"]+)"/)?.[1];

  if (pathData) {
    svgContent[name] = {
      viewBox,
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
