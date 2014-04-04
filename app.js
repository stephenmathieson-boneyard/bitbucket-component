#!/usr/bin/env node

/**
 * Module dependencies.
 */

var http = require('http');
var request = require('hyperquest');
var url = require('url');
var ms = require('ms');

/**
 * Conf.
 */

var pkg = require('./package');
var config = module.parent
  ? require('./config')
  : require(process.cwd() + '/config');

// build host string based on credentials
var host = config.username && config.password
  ? 'https://' + config.username + ':' + config.password
    + '@' + 'bitbucket.org'
  : 'https://bitbucket.org';

/**
 * Expose our app.
 */

var app = module.exports = http.createServer();

// $ node app.js
if (!module.parent) {
  app.listen(config.port, function () {
    console.log();
    console.log('  bitbucket/component proxy v%s', pkg.version);
    console.log();
    console.log('    listening on port %d', config.port);
    console.log();
  });
}

// logger (disabled when testing)
if ('test' != config.env) {
  app.on('request', function (req, res) {
    var start = new Date;
    res.once('finish', function () {
      var end = new Date;
      var str =
          req.method
        + ' '
        + req.url
        + ' '
        + res.statusCode
        + ' ('
        + ms(end - start)
        + ')';
      console.log(str);
    });
  });
}

// "main" request handler
app.on('request', function (req, res) {
  if ('GET' != req.method) return methodNotSupported(req, res);

  var component = parse(req);

  if (!component) {
    return notFound(req, res);
  }

  // https://{host}/{owner}/{name}/raw/{version}/{file}
  var url = host
    + '/'
    + component.author
    + '/'
    + component.name
    + '/raw/'
    + component.version
    + '/'
    + component.file;

  request(url)
  .once('response', function (response) {
    if (404 == response.statusCode) return notFound(req, res);

    // set relevant header fields
    var headers = response.headers;
    var relevant = [
      'content-type', 'content-length', 'last-modified'
    ];
    for (var i = relevant.length - 1; i >= 0; i--) {
      var header = relevant[i];
      if (headers[header]) {
        res.setHeader(header, headers[header]);
      }
    }

    res.statusCode = response.statusCode;
  })
  .on('error', interalError.bind(null, req, res))
  .pipe(res);
});

/**
 * Parse the requested URL for a matching component.
 *
 * @api private
 * @param {http.IncomingMessage} req
 * @return {Object}
 */

function parse(req) {
  var parsed = url.parse(req.url);
  var parts = parsed.pathname.split('/').filter(Boolean);
  if (4 > parts.length) return;
  return {
    author: parts[0],
    name: parts[1],
    version: parts[2],
    file: parts.slice(3).join('/')
  };
}

/**
 * 405 callback.
 */

function methodNotSupported(req, res) {
  res.statusCode = 405;
  res.end(req.method + ' not supported.');
}

/**
 * 500 callback.
 */

function interalError(req, res, err) {
  res.statusCode = 500;
  res.end(err.message);
}

/**
 * 404 callback.
 */

function notFound(req, res) {
  res.statusCode = 404;
  res.end('not found');
}
