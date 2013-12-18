"use strict";

var spdy = require('spdy'),
    fs = require('fs');

var options = {
        ca: fs.readFileSync(__dirname + "/keys/server.csr"),
        key: fs.readFileSync(__dirname + "/keys/server.key"),
        cert: fs.readFileSync(__dirname + "/keys/server.crt")
    };

var jsFiles = [],
    cssFiles = [],
    indexhtml = fs.readFileSync('index.html'),
    server = spdy.createServer(options, requestReceived);

loadAllResourceFiles(100, jsFiles, "/js/javascript", ".js");

console.info("Loaded all Js files");

loadAllResourceFiles(10, cssFiles, "/css/css", ".css");

console.info("Loaded all Css files");

/**
 * Load all files that will be requested on index load, to allow us to push the files to the browser.
 * 
 * @param {type} numberOfFiles
 * @param {type} fileArray
 * @param {type} prepend
 * @param {type} append
 * @returns {undefined}
 */
function loadAllResourceFiles(numberOfFiles, fileArray, prepend, append) {
	for (var file = 0; file < numberOfFiles; file++) {
		fileArray.push(fs.readFileSync(__dirname + prepend + file + append));
	}
}

function requestReceived(request, response) {
    console.info(request.url, "Request");
    
    if(request.url === "/") {
        var headers = {
            "Content-Type": "text/html"
        };
        headers["Content-Length"] = indexhtml.length;

        response.writeHead(200, headers);
        response.end(indexhtml);
    }

    
    
//    if (request.isSpdy){
//    message = "YAY! SPDY Works!"
//  }
};

function pushRequiredResource() {
//    var headers = {
//        "content-type": "application/javascript"
//    };

//    response.push('/backbone.js', headers, function(err, stream){
//      if (err) return;
//
//      stream.end(backbone);
//    });
    
}

server.listen(8081, function(){
  console.log("SPDY Server started on 8081");
});
