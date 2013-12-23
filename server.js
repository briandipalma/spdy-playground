"use strict";

var spdy = require('spdy'),
	fs = require('fs');

var options = {
		ca: fs.readFileSync(__dirname + "/keys/server.csr"),
		key: fs.readFileSync(__dirname + "/keys/server.key"),
		cert: fs.readFileSync(__dirname + "/keys/server.crt"),
		windowSize: 1024 * 1024,
		autoSpdy31: false
	};

var resourceFiles = {},
	numberOfJsFiles = 100,
	numberOfCssFiles = 10,
	indexhtml = fs.readFileSync('index.html'),
	server = spdy.createServer(options, requestReceived);

server.listen(8081, function(){
	console.log("SPDY Server started on 8081");
});

loadAllResourceFiles(numberOfCssFiles, "/css/css", ".css");

console.info("Loaded all Css files");

loadAllResourceFiles(numberOfJsFiles, "/js/javascript", ".js");

console.info("Loaded all Js files");

function requestReceived(request, response) {
	console.info("Request", request.url);

	if (request.url === "/") {
		handleRootClientRequest(request, response);
	} else {
		response.end(resourceFiles[request.url]);
	}
};

/**
 * Load all files that will be requested on index load, to allow us to push the files to the browser.
 * 
 * @param {type} numberOfFiles
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

function handleRootClientRequest(request, response) {
	if (request.isSpdy) {
		console.info("YAY! SPDY Works!");
		pushIndexHtmlResources(numberOfCssFiles, "/css/css", ".css", "text/css", response);
		pushIndexHtmlResources(numberOfJsFiles, "/js/javascript", ".js", "application/javascript", response);
	}

	var headers = {
		"Content-Type": "text/html"
	};
	headers["Content-Length"] = indexhtml.length;

	response.writeHead(200, headers);
	response.end(indexhtml);
}

function pushIndexHtmlResources(numberOfFiles, prepend, append, contentType, serverResponse) {
	for (var file = 0; file < numberOfFiles; file++) {
		var fileName = prepend + file + append,
			fileContents = resourceFiles[fileName];

		pushResource(contentType, serverResponse, fileName, fileContents);
	}
}

function pushResource(contentType, serverResponse, resourceName, resourceFile) {
	var headers = {
		"content-type": contentType
	};

	serverResponse.push(resourceName, headers, function(err, stream) {
		if (err) {
			console.info("Error loading", resourceName);
		};

		stream.end(resourceFile);
	});
}
