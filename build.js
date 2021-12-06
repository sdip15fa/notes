const { minify } = require("terser");
const fs = require("fs");
const config = {
  compress: {
    dead_code: true,
    drop_console: false,
    drop_debugger: true,
    keep_classnames: true,
    keep_fargs: true,
    keep_fnames: true,
    keep_infinity: true,
  },
  mangle: {
    eval: false,
    keep_classnames: true,
    keep_fnames: true,
    toplevel: false,
    safari10: false,
  },
  module: false,
  sourceMap: false,
  output: {
    comments: "",
  },
};
function main() {
  fs.readdir("assets/js", async (err, files) => {
    files.forEach(async (file) => {
      if (file !== "min") {
        file = `assets/js/${file}`;
        const code = fs.readFileSync(file, "utf8");
        const minified = await minify(code, config);
        fs.writeFileSync(
          file.replace("js/", "js/min/").replace(".js", ".min.js"),
          minified.code
        );
      }
    });
  });
}
main();
