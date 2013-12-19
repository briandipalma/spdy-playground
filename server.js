"use strict";

var spdy = require('spdy'),
    fs = require('fs');

var options = {
        ca: fs.readFileSync(__dirname + "/keys/server.csr"),
        key: fs.readFileSync(__dirname + "/keys/server.key"),
        cert: fs.readFileSync(__dirname + "/keys/server.crt")
    };

var resourceFiles = {},
    indexhtml = fs.readFileSync('index.html'),
    server = spdy.createServer(options, requestReceived);

loadAllResourceFiles(100, "/js/javascript", ".js");

console.info("Loaded all Js files");

loadAllResourceFiles(10, "/css/css", ".css");

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
function loadAllResourceFiles(numberOfFiles, prepend, append) {
	for (var file = 0; file < numberOfFiles; file++) {
		var fileName = prepend + file + append,
			resourceFile = fs.readFileSync(__dirname + fileName);

		resourceFiles[fileName] = resourceFile;
	}
}

function requestReceived(request, response) {
    console.info("Request", request.url);
    
    if(request.url === "/") {
        var headers = {
            "Content-Type": "text/html"
        };
        headers["Content-Length"] = indexhtml.length;

        response.writeHead(200, headers);
        response.end(indexhtml);

		if (request.isSpdy) {
			console.info("YAY! SPDY Works!");
		}
    } else {
		response.end(resourceFiles[request.url]);
	}
};

function pushRequiredResource(contentType, resourceName, resourceFile) {
	//"application/javascript"
	
	var headers = {
		"content-type": contentType
	};

	response.push(resourceName, headers, function(err, stream){
		if (err) {
			console.info("Error loading", resourceName);
		};

		stream.end(resourceFile);
	});
}

server.listen(8081, function(){
  console.log("SPDY Server started on 8081");
});
