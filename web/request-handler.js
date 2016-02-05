var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var http = require('./http-helpers');
var cron = require('../workers/htmlfetcher.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, http.headers);
    http.serveAssets(res, path.join(__dirname, "/public/index.html"), function(data){
      res.write(data);
      res.end();
    });
  } else if (req.method === "POST") {
    var body = '';
    req.on('data', function(chunk){
      body += chunk;
    });
    req.on('end', function(){
      var url = body.replace(/^(url=)/, '');
      archive.isUrlInList(url, function(inList){

        if (inList === false) {
          http.serveAssets(res, path.join(__dirname, '/public/loading.html'), function(data){
            res.writeHead(302, http.headers);
            res.write(data);
            res.end();
          });
          archive.addUrlToList(url, function(err){
            if (err) {
              console.log(err);
            }
          });
        } else {
          archive.isUrlArchived(url, function(inArchive) {

            if (inArchive === false) {
              http.serveAssets(res, path.join(__dirname, '/public/loading.html'), function(data){
                res.write(data);
                res.end();
              });
            } else {
              http.serveAssets(res, path.join(__dirname, '../archives/sites/') + url, function(data){
                res.write(data);
                res.end();
              });
            }

          });
        }
      });
    });
  } else if (req.method === "GET") {
    res.writeHead(404, http.headers);
    res.end();
  }
};
