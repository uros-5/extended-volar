#!/bin/bash
tsdir="/home/uros/.nvm/versions/node/v18.16.0/lib/node_modules/typescript/lib"
startjs="var ts ="
temppImport='const tempp = require("../lib/temp");'
resultsStart="withoutExpandos : filteredDeclarations;"
nuxtComp="tempp.nuxtComp(results, node);"
fromNameFn="(function createDefinitionInfoFromName\(.*\).*\n.*getSourceFile.*;)"
fromNameFn2="(function createDefinitionInfoFromName\(.*\).*\n.*return\{fileName:);"
changedFile="sourceFile tfn = sourceFile.tempFileName;sourceFile fileName = tfn ? tfn : sourceFile.fileName; "

cp -r "$tsdir/typescript.js" "$tsdir/original-typescript.js"
cp -r temp.js "$tsdir"
sd "$startjs" "$temppImport\n$startjs" "$tsdir/typescript.js"
sd "$resultsStart" "$resultsStart\n  $nuxtComp\n" "$tsdir/typescript.js"
sd "$fromNameFn" '$1
  let tfn = sourceFile.tempFileName;
  let fileName = tfn ? tfn : sourceFile.fileName;' "$tsdir/typescript.js"

sd -f ms "(function createDefinitionInfoFromName\(.*?fileName:).*?,(.*?;.*?\})" '$1 fileName, $2' "$tsdir/typescript.js"
