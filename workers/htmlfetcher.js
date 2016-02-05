// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var _ = require('underscore');
var CronJob = require('cron').CronJob;

exports.job = new CronJob('30 * * * * *', function() {
  archive.readListOfUrls(function(list){
    var results = [];
    _.each(list, function(url){
      archive.isUrlArchived(url, function(isArchived){
        if (isArchived === false) {
          archive.downloadUrls([url]);
        }
      });
    });
  });
}, null, true, 'America/Los_Angeles');