var fs = require('fs');
var url = require('url');
var path = require('path');
var http = require('http');
var server;

function pipeFileToResponse(res, file, type) {
  if (type) {
    res.writeHead(200, {
      'Content-Type': type
    });
  }

  fs.createReadStream(path.join(__dirname, file)).pipe(res);
}

server = http.createServer(function (req, res) {
  req.setEncoding('utf8');

  var parsed = url.parse(req.url, true);
  var pathname = parsed.pathname;

  console.log('[' + new Date() + ']', req.method, pathname);

  if (pathname === '/') {
    pathname = '/index.html';
  }

  if (pathname === '/index.html') {
    pipeFileToResponse(res, './index.html');
  } else if (pathname === '/beauty-request.js') {
    pipeFileToResponse(res, '../build/beauty-request.js', 'text/javascript');
  } else if (pathname === '/beauty-request.map') {
    pipeFileToResponse(res, '../build/beauty-request.map', 'text/javascript');
  } else if (pathname === '/api') {
    var status;
    var result;
    var data = '';

    req.on('data', function (chunk) {
      data += chunk;
    });

    req.on('end', function () {
      try {
        status =Math.random()>0.5?200:401;
        result = {
          code:10000,
          msg:'success',
          data:'ok'
        };
      } catch (e) {
        console.error('Error:', e.message);
        status = 400;
        result = {
           error: e.message
         };
      }

      res.writeHead(status, {
        'Content-Type': 'application/json'
      });
      setTimeout(function(){
        res.end(JSON.stringify(result));
      },3000)
    });
  } else {
    res.writeHead(404);
    res.end('<h1>404 Not Found</h1>');
  }
});

server.listen(3000);