// esbuild.js

const esbuild = require("esbuild");
const path = require("path");

const isWatch = process.argv.includes("--watch");

const buildOptions = {
  entryPoints: ["src/extension.ts"], // Your extension's entry point
  bundle: true,
  platform: "node", // Platform should be 'node' for VSCode extensions
  target: "node14", // Target the node version compatible with VSCode
  outfile: "out/extension.js", // Output file
  external: ["vscode", "hygen"], // Exclude the 'vscode' and 'hygen' modules
  format: "cjs", // CommonJS format
  sourcemap: true, // Generate source maps
  loader: {
    ".ejs.t": "text", // If you have template files, ensure they are loaded as text
  },
};

async function build() {
  try {
    if (isWatch) {
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log("Watching for changes...");
    } else {
      await esbuild.build(buildOptions);
      console.log("Build completed.");
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

build();
