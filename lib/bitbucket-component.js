
'use strict';

var bitbucket = require('./bitbucket'),
    express = require('express'),
    path = require('path'),
    merge = require('util')._extend;


/**
 * Create an express app for serving components from bitbucket.org
 *
 * Options:
 *
 *   - `directory` the directory to download repositories in
 *   - `password` bitbucket password
 *   - `username` bitbucket username
 *
 * @api public
 * @param {Object} opts
 * @return {Function}
 */
exports = module.exports = function (opts) {
  opts = merge({
    url: 'https://{username}:{password}@bitbucket.org/{owner}/{name}/get/{version}.tar.gz',
    directory: null,
    username: null,
    password: null
  }, opts);

  var app = express();

  app.get('/:owner/:name/:version/:file(*)', function (req, res, next) {
    var owner = req.param('owner'),
        name = req.param('name'),
        version = req.param('version'),
        file = req.param('file');

    bitbucket.get(opts, owner, name, version, function (err, directory) {
      if (err) return next(err);
      res.sendfile(path.join(directory, file));
    });
  });

  return app;
};

exports.bitbucket = bitbucket;
