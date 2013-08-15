
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
 *   - `maxAge` max age for file cache; see http://expressjs.com/api.html#res.sendfile
 *
 * @api public
 * @param {Object} opts
 * @return {Function}
 */

exports = module.exports = function (opts) {
  opts = merge({
    directory: null,
    username: null,
    password: null,
    maxAge: 0
  }, opts);

  if (opts.password && !opts.username) throw new Error('must provide a username');
  if (opts.username && !opts.password) throw new Error('must provide a password');

  opts.url = opts.username
    ? 'https://' + opts.username + ':' + opts.password
      + '@bitbucket.org/{owner}/{name}/get/{version}.tar.gz'
    : 'https://bitbucket.org/{owner}/{name}/get/{version}.tar.gz';

  var app = express();

  app.get('/:owner/:name/:version/:file(*)', function (req, res, next) {
    var owner = req.param('owner'),
        name = req.param('name'),
        version = req.param('version'),
        file = req.param('file');

    bitbucket.get(opts, owner, name, version, function (err, directory) {
      if (err) return next(err);
      res.sendfile(path.join(directory, file), { maxAge: opts.maxAge });
    });
  });

  return app;
};

exports.bitbucket = bitbucket;
