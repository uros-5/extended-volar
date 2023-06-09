#!/bin/bash
tsdir="/home/uros/.nvm/versions/node/v18.16.0/lib/node_modules/typescript/lib"
startjs="var ts ="
temppImport='const tempp = require("../lib/temp");'
resultsStart="withoutExpandos : filteredDeclarations;"
nuxtComp="tempp.nuxtComp(results, node);"

cp -r "$tsdir/typescript.js" "$tsdir/original-typescript.js"
mv temp.js "$tsdir"
sd "$startjs" "$temppImport\n$startjs" "$tsdir/typescript.js"
sd "$resultsStart" "$resultsStart\n  $nuxtComp\n" "$tsdir/typescript.js"
