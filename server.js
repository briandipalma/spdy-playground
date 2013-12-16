"use strict";

var spdy = require('spdy'),
    fs = require('fs');

var options = {
        ca: fs.readFileSync(__dirname + "/keys/server.csr"),
        key: fs.readFileSync(__dirname + "/keys/server.key"),
        cert: fs.readFileSync(__dirname + "/keys/server.crt")
    };

var indexhtml = fs.readFileSync('index.html'),
    server = spdy.createServer(options, requestReceived);

function requestReceived(request, response) {
    console.info(request.url, "Request");
    
    if(request.url === "/") {
        var headers = {
            "Content-Type": "text/html"
        }
        headers["Content-Length"] = indexhtml.length;

        response.writeHead(200, headers);
        response.end(indexhtml);
    }

//    var headers = {
//        "content-type": "application/javascript"
//    };

//    response.push('/backbone.js', headers, function(err, stream){
//      if (err) return;
//
//      stream.end(backbone);
//    });
    
    
//    if (request.isSpdy){
//    message = "YAY! SPDY Works!"
//  }
};

function pushRequiredResource() {
    
}

server.listen(8081, function(){
  console.log("SPDY Server started on 8081");
});
