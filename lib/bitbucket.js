
'use strict';

var fs = require('fs'),
    path = require('path'),
    tar = require('tar'),
    zlib = require('zlib'),
    mkdirp = require('mkdirp'),
    https = require('https'),
    os = require('os'),
    once = require('once');


/**
 * Download a tarball from `opts.url`, parsing out `owner`,
 * `name`, and `version`.  Invokes `cb(err, directory_to_untarred_repo)`.
 *
 * @api private
 * @param {Options} opts
 * @param {String} owner
 * @param {String} name
 * @param {String} version
 * @param {Function} cb
 */
exports.get = function (opts, owner, name, version, cb) {
  // only fire once
  cb = once(cb);

  var url = opts.url
        .replace('{owner}', owner)
        .replace('{name}', name)
        .replace('{version}', version);

  var temp = path.join(os.tmpDir(), owner + '-' + name + '-' + version);

  var dir = path.join(opts.directory, owner, name, version);


  /**
   * Callback for completion.  Moves the extracted tarball
   * to its desired location (`{directory}/owner/component/version`).
   *
   * Added complexity as the tarball directly from bitbucket
   * contains an arbitrary directory.
   *
   * @api private
   * @param {http.IncomingMessage} res
   */
  function onEnd(res) {
    var attachment = path.join(temp, exports.attachmentName(res));

    mkdirp(dir, function (err) {
      if (err) return cb(err);

      fs.rename(attachment.split('.tar.gz')[0], dir, function (err) {
        if (err) return cb(err);

        cb(null, dir);
      });
    });
  }

  /**
   * Callback for errors.  Adds useful properties to
   * the given error, allowing for easier debugging.
   *
   * @api private
   * @param {Error} err
   */
  function error(err) {
    err.repo = owner + '/' + name;
    err.version = version;
    cb(err);
  }

  /**
   * Handle the given `res`
   *
   * @api private
   * @param {http.IncomingMessage} res
   */
  function handleResponse(res) {
    res.on('error', error);
    res.pipe(zlib.createGunzip())
      .on('error', error)
      .pipe(tar.Extract(temp))
        .on('error', error)
        .on('end', onEnd.bind(null, res));
  }

  // don't re-download the tarball if it already exists
  fs.exists(dir, function (exists) {
    if (exists) return cb(null, dir);
    https.get(url, handleResponse).on('error', error);
  });
};

/**
 * Parse the attacement name from the given `res`
 *
 * @api private
 * @param {http.IncomingMessage} res
 * @return {String}
 */
exports.attachmentName = function (res) {
  if (!res.headers || !res.headers['content-disposition']) return null;
  return res
    .headers['content-disposition']
    .split('attachment; filename=')[1];
};
