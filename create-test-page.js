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

bower.commands.
        list({paths: true}).
        on("end", function (results){
            var firstPackage = Object.keys(results)[0];
            var locationOfSeedFile = results[firstPackage];

            createDirectoryForTestFiles("js");
            createDirectoryForTestFiles("css");

            createTestFiles(locationOfSeedFile, numberOfJSFilesToLoad, "/js/javascript", ".js");
            createTestFiles("csstemplate.css", numberOfCSSFilesToLoad, "/css/css", ".css");
        });

function createTestFiles (locationOfSeedFile, numberOfFilesToLoad, prepend, append) {
    var stream = fs.createReadStream(__dirname + "/" + locationOfSeedFile);
    stream.setMaxListeners(numberOfFilesToLoad + 10);

    for (var i = 0; i < numberOfFilesToLoad; i++) {
        var writeStream = fs.createWriteStream(__dirname + prepend + i + append);
        stream.pipe(writeStream);
        
        writeStream.on("error", function () {
            console.dir(arguments)
        });
    }
};

function createDirectoryForTestFiles (directoryName) {
    try {
        fs.mkdirSync("./" + directoryName);
    } catch (e) {
        console.info(directoryName, "directory already exists will not create it.");
    }
};
