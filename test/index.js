
var bc = require('..'),
    assert = require('better-assert'),
    fs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf'),
    request = require('supertest');

function clean() {
  rimraf.sync(path.join(__dirname, 'temp'));
}

describe('bitbucket-component', function () {
  var opts = {
    directory: path.join(__dirname, 'temp'),
    url: 'https://bitbucket.org/{owner}/{name}/get/{version}.tar.gz',
    maxAge: Infinity
  };

  it('should return an express app', function () {
    var app = bc({});

    // cheap, but w/e
    app.should.be.a.function;
    app.get.should.be.a.function;
    app.post.should.be.a.function;
  });

  describe('.bitbucket', function () {
    it('should be an object', function () {
      bc.bitbucket.should.be.an.object;
    });

    describe('.get()', function () {
      before(clean);
      after(clean);

      it('should download and extract tarballs into opts.directory', function (done) {
        bc.bitbucket.get(opts, 'stephenmathieson', 'testything', '0.0.0', function (err, dir) {
          if (err) throw err;

          dir.should.be.equal(path.join(opts.directory, 'stephenmathieson', 'testything', '0.0.0'));
          fs.existsSync(path.join(dir, 'component.json')).should.be.true;
          fs.existsSync(path.join(dir, 'index.js')).should.be.true;
          fs.existsSync(path.join(dir, 'testything.css')).should.be.true;
          done();
        });
      });

      it('should allow for downloading multiple versions', function (done) {
        bc.bitbucket.get(opts, 'stephenmathieson', 'testything', '0.0.2', function (err, dir) {
          if (err) throw err;

          dir.should.be.equal(path.join(opts.directory, 'stephenmathieson', 'testything', '0.0.2'));
          fs.existsSync(path.join(dir, 'component.json')).should.be.true;
          // doesnt delete old stuff
          fs.existsSync(path.join(opts.directory, 'stephenmathieson', 'testything', '0.0.0', 'component.json')).should.be.true;
          done();
        });
      });

      it('should not re-download the same tag', function (done) {
        // should be super fast
        this.timeout(10);
        bc.bitbucket.get(opts, 'stephenmathieson', 'testything', '0.0.2', done);
      });

      it('should provide the repo and version on errors', function (done) {
        bc.bitbucket.get(opts, 'stephenmathieson', 'testything', 'notreal', function (err) {
          err.should.be.ok;
          err.repo.should.be.equal('stephenmathieson/testything');
          err.version.should.be.equal('notreal');
          done();
        });
      });
    });
  });

  describe('bitbucket-component()', function () {

    var app;

    before(function (done) {
      clean();
      app = bc(opts);
      app.use(require('express').logger('dev'));
      app.listen(9876, done);
    });

    after(clean);

    it('should serve files from bitbucket in github-style urls', function (done) {
      request(app)
        .get('/stephenmathieson/testything/0.0.0/index.js')
        .expect(200)
        .expect('module.exports = \'testything\'\n', done);
    });

    it('should respect tags', function (done) {
      request(app)
        .get('/stephenmathieson/testything/0.0.2/component.json')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          var json = JSON.parse(res.text);
          json.version.should.be.equal('0.0.2');
          done();
        });
    });

    it('should handle directories', function (done) {
      request(app)
        .get('/stephenmathieson/testything/0.0.4/lib/apples.js')
        .expect(200)
        .expect('\nmodule.exports = \'apples\'\n', done);
    });

    it('should set max-age', function (done) {
      var inf = 60 * 60 * 24 * 365;

      request(app)
        // first
        .get('/stephenmathieson/testything/master/index.js')
        .expect(200)
        .expect('cache-control', 'public, max-age=' + inf, done);
    });
  });
});
