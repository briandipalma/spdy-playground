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
    
//    headers['Content-Type'] = 'text/html';
//     headers['Content-Length'] = body.length;
//
//  response.writeHead(status, headers);
//
//  response.end(body);

function requestReceived(request, response) {
    switch(request.url){
        case "/":
            headers['Content-Type'] = 'text/html';
            body = indexhtml
            break;
    }
    
    if(request.url === "/") {
        
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
}

function pushRequiredResource() {
    
}

server.listen(8081, function(){
  console.log("SPDY Server started on 8081");
});
