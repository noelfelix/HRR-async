var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var http = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.url = '/' && req.method === 'GET') {
    http.serveAssets(res, 'index.html');
  }

  if (req.method === "POST") {
    var body = '';
    req.on('data', function(chunk){
      body += chunk;
    });
    req.on('end', function(){
      body = body.replace(/^(url=)/, '');
      if (!archive.isUrlInList(body)) {
        archive.addUrlToList(body);
      }
      res.writeHead(302, http.headers);
      res.end()
    });
  };
  req.on('end', function() {
    console.log('request ending');
    res.end();
  });
  // res.end(archive.paths.list);
};
