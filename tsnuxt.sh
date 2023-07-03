#!/bin/bash

tsdir="/home/uros/Documents/programiranje/vue/ui-lishuuro/node_modules/typescript/lib"
oldstart="var ts ="
newstart='const tempp = require("../lib/temp");'

oldexpands="withoutExpandos : filteredDeclarations;"
newexpands="tempp.nuxtComp(results, node); tempp.autoImport(results, node); "

oldcreatedef="(function createDefinitionInfoFromName\(.*\).*\n.*getSourceFile.*;)"

olddefssymbol="(const defs = getDefinitionFromSymbol.*;)"

oldTextSpan="(textSpan = createTextSpanFromNode\(name, sourceFile\);)"

tsfile="$tsdir/typescript.js"

echo "$tsfile"

cp -r "$tsfile" "$tsdir/original-typescript.js"
cp -r temp.js "$tsdir"
sd "$oldstart" "$newstart\n$oldstart" "$tsfile"
sd "$oldexpands" "$oldexpands\n  $newexpands\n" "$tsfile"
sd "$oldcreatedef" '$1
    let tfn = sourceFile.tempFileName;
    let fileName = tfn ? tfn : sourceFile.fileName;' "$tsfile"

sd -f ms "(function createDefinitionInfoFromName\(.*?fileName:).*?,(.*?;.*?\})" '$1 fileName, $2' "$tsfile"
sd -f ms "$oldTextSpan" '
    $1
    if(tfn) {
        textSpan.start = 0;
        textSpan.length = 0;
    }' "$tsfile"

sd "$olddefssymbol" '$1
    if(defs.length > 0) { return defs }' "$tsfile"
