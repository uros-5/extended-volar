const nuxtFolder = ".nuxt/components.d.ts";
const autoImport = ".nuxt/types/imports.d.ts";
module.exports.re = new RegExp('typeof import.*../components/(.*.vue)"');
module.exports.re2 = new RegExp("typeof import.*../../(.*)'\\)");

module.exports.nuxtComp = (results, node) => {
  if (results && node.getSourceFile().fileName.includes(".vue")) {
    let res = results.find((item) => {
      item.getSourceFile().tempFileName = undefined;
      const fullText = item.getFullText();
      let comp = module.exports.re.exec(fullText);
      if (comp) {
        let newItem = replacing(
          item,
          nuxtFolder,
          "components/",
          "",
          comp,
          false
        );
        if (newItem) {
          return newItem;
        }
      }
      comp = module.exports.re2.exec(fullText);
      if (comp) {
        let newItem = replacing(item, autoImport, "", ".ts", comp, true);
        if (newItem) {
          return newItem;
        }
      }
    });
    if (res) {
      results.length = 0;
      results.push(res);
    }
  }
};
/**

* @param {string} Object
* @param {string} folder
* @param {string} replaced
* @param {Boolean} checkIsNode
* @param {string} extension
* @param {string} comp
* @returns {Object}

*/
function replacing(item, folder, replaced, extension, comp, checkIsNode) {
  let fileName = item.getSourceFile().fileName;
  if (fileName.endsWith(folder)) {
    fileName = fileName.replace(folder, `${replaced}${comp.at(1)}${extension}`);
    if (checkIsNode) {
      if (fileName.startsWith("node_modules")) {
        return undefined;
      }
    }
    item.getSourceFile().tempFileName = fileName;
    item.getStart = (sf, i) => 0;
    item.getEnd = (sf, i) => 0;

    return item;
  }
}
