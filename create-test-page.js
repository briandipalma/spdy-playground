//I want to call this like so
// node create-test-page 100 10
//and it spits out an index.html file with 100 script tags with src="js/jsfile0-100.js"
//and 10 link tags with src="css/cssfile0-100.css"
"use strict";

var fs = require("fs");
var bower = require("bower");

var numberOfJSFilesToLoad = parseInt(process.argv[2], 10);
var numberOfCSSFilesToLoad = parseInt(process.argv[3], 10);

if(Number.isNaN(numberOfJSFilesToLoad)) {
    numberOfJSFilesToLoad = 100;

    console.info("Number of JS files not provided as first argument using default of", numberOfJSFilesToLoad);
}

if(Number.isNaN(numberOfCSSFilesToLoad)) {
    numberOfCSSFilesToLoad = numberOfJSFilesToLoad / 10;

    console.info("Number of CSS files not provided as second argument using default of", numberOfCSSFilesToLoad);
}

var scriptBlock = "";

for (var i = 0; i < numberOfJSFilesToLoad; i++) {
    scriptBlock += '        <script src="js/javascript' + i + '.js"></script>\n';
}

var cssBlock = "";

for (var i = 0; i < numberOfCSSFilesToLoad; i++) {
    cssBlock += '       <link rel="stylesheet" href="css/css' + i + '.css">\n';
}

var htmlTemplate = "<!DOCTYPE html>\n" +
                   "<html>\n" +
                   "    <head>\n" +
                   "        <title>Title</title>\n" +
                   '        <meta charset="UTF-8">\n' +
                   "{{ CSSBlock }}\n" +
                   "{{ JSBlock }}\n" +
                   "    </head>\n" +
                   "    <body>\n" +
                   "    </body>\n" +
                   "</html>";

var htmlTestPageMarkup = htmlTemplate.
        replace("{{ CSSBlock }}", cssBlock).
        replace("{{ JSBlock }}", scriptBlock);

fs.writeFileSync("index.html", htmlTestPageMarkup);

