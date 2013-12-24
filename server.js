"use strict";

var spdy = require('spdy'),
	fs = require('fs');

var options = {
		ca: fs.readFileSync(__dirname + "/keys/server.csr"),
		key: fs.readFileSync(__dirname + "/keys/server.key"),
		cert: fs.readFileSync(__dirname + "/keys/server.crt")
	};

var resourceFiles = [],
	numberOfJsFiles = 100,
	numberOfCssFiles = 10,
	MAX_CONCURRENT_STREAMS = 50,
	indexhtml = fs.readFileSync('index.html'),
	server = spdy.createServer(options, clientRequestReceived);

server.listen(8081, function(){
	console.log("SPDY Server started on 8081");
});

resourceFiles.push({name: "/", file: indexhtml, contentType: "text/html"});

preloadResourceFiles(numberOfCssFiles, "/css/css", ".css", "text/css");

console.info("Loaded all Css files");

preloadResourceFiles(numberOfJsFiles, "/js/javascript", ".js", "application/javascript");

console.info("Loaded all Js files");

function clientRequestReceived(request, response) {
	console.info("Request", request.url);

	if (request.isSpdy) {
		console.info("SPDY!", request.spdyVersion);
	}

	var indexOfFile = findIndexOfResouceFile(request.url),
		requestedFileInfo = resourceFiles[indexOfFile];
	
	pushMaxConcurrentStreamResourcesToClient(indexOfFile, response);	
	sendFileRequestedToClient(response, requestedFileInfo);
};

/**
 * Pre-load all files that will be requested by client, to allow us to push the files to the browser
 * as soon as we receive a request.
 * 
 * @param {type} numberOfFiles
 * @param {type} prepend
 * @param {type} append
 * @param {type} contentType
 * @returns {undefined}
 */
function preloadResourceFiles(numberOfFiles, prepend, append, contentType) {
	for (var file = 0; file < numberOfFiles; file++) {
		var fileName = prepend + file + append,
			resourceFile = fs.readFileSync(__dirname + fileName);

		resourceFiles.push({name: fileName, file: resourceFile, contentType: contentType});
	}
}

function findIndexOfResouceFile(fileName) {
	var files = resourceFiles.length;

	for (var file = 0; file < files; file++) {
		if(resourceFiles[file].name === fileName) {
			return file;
		}
	}
};

function pushMaxConcurrentStreamResourcesToClient(indexOfFile, response) {
	var pushedFile = indexOfFile + 1,
		maxPossiblePushedResource = Math.min(pushedFile + MAX_CONCURRENT_STREAMS, resourceFiles.length);

	for (; pushedFile < maxPossiblePushedResource; pushedFile++) {		
		var fileInfo = resourceFiles[pushedFile];
		
		console.info("Pushing", fileInfo.contentType, fileInfo.name, fileInfo.file);

		pushResource(fileInfo.contentType, response, fileInfo.name, fileInfo.file);
	}
}

function pushResource(contentType, serverResponse, resourceName, resourceFile) {
	var headers = {
		"Content-Type": contentType
	};
	headers["Content-Length"] = resourceFile.length;

	serverResponse.push(resourceName, headers, function(err, stream) {
		if (err) {
			console.info("Error loading", resourceName);
		} else {
			console.info("Pushed", resourceName);

			stream.end(resourceFile);
		}
	});
}

function sendFileRequestedToClient(response, requestedFileInfo) {
	var headers = {};
	headers["Content-Type"] = requestedFileInfo.contentType;
	headers["Content-Length"] = requestedFileInfo.file.length;

	response.writeHead(200, headers);
	response.end(requestedFileInfo.file);
}
