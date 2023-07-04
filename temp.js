const fs = require("fs");
const nuxtFolder = ".nuxt/components.d.ts";
const autoImport = ".nuxt/types/imports.d.ts"
let re = new RegExp("'(.*)' has no exported member .* '(.*)'.")
module.exports.re = new RegExp("typeof import.*\.\.\/components\/(.*\.vue)\"");
module.exports.re2 = new RegExp("typeof import.*\.\.\/\.\.\/(.*)'\\\)");
let logCounter = 0;
/**
  @param msg {string}
  @return {void}
**/
module.exports.log2 = (msg) => {
  if (logCounter == 0) {
    fs.unlink("ts504-vue.txt", () => { });
    logCounter += 1;
  }
  let content = `\n${new Date().toString()}:\n\t msg:[${msg}]\n`;
  fs.appendFile("ts504-vue.txt", content, (_err) => {
  });
}

/**
* find error
*  @param {string} msg
*  @return {string[] | undefined}
*/
module.exports.find = (msg) => {
  return re.exec(msg)
}
/**
    @param module {string}
    @return {string}
*/
module.exports.formatModule = (module) => {
  return module.replaceAll('\"', "")
}
/**
* @param item {Object}
* @return {{mod: string, sym: string} | undefined}
*/
module.exports.findSymbol = (item) => {
  let symbol = module.exports.find(item.message);
  if (symbol) {
    let mod = module.exports.formatModule(symbol.at(1));
    let sym = symbol.at(2)
    return { mod, sym }
  }
}
/**
    @param errors {Object[]}
    @return {boolean}
*/
module.exports.hasError = (errors) => {
  if (errors) {
    return errors.length != 0;
  }
  return false
}

/**
  * @return {[] | undefined}
**/
module.exports.getDiagnostics = (plugin, doc, token) => {
  return plugin.provideSemanticDiagnostics?.(doc, token);
}

/**
 * @param items {Object[]}
 * @return { any | undefined }
**/
module.exports.findMessage = (items) => {
  return items.find(item => {
    if (item.message.includes("exported")) {
      return item;
    }
  })
}

/**
  show error
  *
**/
module.exports.showError = (plugin, doc, token) => {
  let diagnostics = module.exports.getDiagnostics(plugin, doc, token);
  if (diagnostics) {
    let messageItem = module.exports.findMessage(diagnostics);
    if (messageItem) {
      let symbol = module.exports.findSymbol(messageItem);
      if (symbol) {
        module.exports.log2(`symbol: ${JSON.stringify(symbol)}`)
      }
    }
  }
}

module.exports.nuxtComp = (results, node) => {
  if (results && node.getSourceFile().fileName.includes(".vue")) {
    let res = results.find(item => {
      item.getSourceFile().tempFileName = undefined; 
      const fullText = item.getFullText();
      let comp = module.exports.re.exec(fullText);
      if (comp) {
        let newItem = replacing(item, nuxtFolder, "components/", "", comp, false)
        if (newItem) {
          return newItem
        }
      }
      comp = module.exports.re2.exec(fullText);
      if (comp) {
        let newItem = replacing(item, autoImport, "", ".ts", comp, true)
        if (newItem) {
          return newItem
        }
      }
    });
    if (res) {
      results.length = 0;
      results.push(res);
    }
  }
}
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
  module.exports.log2(`check temp: ${item.getSourceFile().tempFileName}`)
  if (fileName.endsWith(folder)) {
    fileName = fileName.replace(folder, `${replaced}${comp.at(1)}${extension}`)
    if (checkIsNode) {
      if (fileName.startsWith("node_modules")) {
        module.exports.log2('its node file')
        return undefined;
      }
    }
    module.exports.log2(fileName)
    item.getSourceFile().tempFileName = fileName;
    item.getStart = (sf, i) => 0;
    item.getEnd = (sf, i) => 0;

    return item;
  }
}
