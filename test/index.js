
var app = require('..');
var request = require('supertest');

describe('app', function () {
  before(function (done) {
    app.listen(5000, done);
  });

  after(function (done) {
    app.close(done);
  });

  describe('POST /', function () {
    it('should 405', function (done) {
      request(app)
      .post('/')
      .expect(405, done);
    });
  });

  describe('GET /', function () {
    it('should 404', function (done) {
      request(app)
      .get('/')
      .expect(404, done);
    });
  });

  describe('GET /owner', function () {
    it('should 404', function (done) {
      request(app)
      .get('/owner')
      .expect(404, done);
    });
  });

  describe('GET /owner/name', function () {
    it('should 404', function (done) {
      request(app)
      .get('/owner/name')
      .expect(404, done);
    });
  });

  describe('GET /owner/name/version', function () {
    it('should 404', function (done) {
      request(app)
      .get('/owner/name/version')
      .expect(404, done);
    });
  });

  describe('GET /stephenmathieson/nope/4.5.6/file.js', function () {
    it('should 404', function (done) {
      request(app)
      .get('/stephenmathieson/node/4.5.6/file.js')
      .expect(404, done);
    });
  });

  describe('GET /stephenmathieson/testything/0.0.4/component.json', function () {
    it('should 200', function (done) {
      request(app)
      .get('/stephenmathieson/testything/0.0.4/component.json')
      .expect(200, done);
    });

    it('should set headers', function (done) {
      request(app)
      .get('/stephenmathieson/testything/0.0.4/component.json')
      .expect('content-type', /.+/)
      .expect('content-length', /.+/)
      .expect('last-modified', /.+/, done);
    });

    it('should provide component.json', function (done) {
      var json = {
        name: 'testything',
        repo: 'stephenmathieson/testything',
        description: 'a testy thing',
        version: '0.0.4',
        keywords: [],
        dependencies: {},
        development: {},
        license: 'MIT',
        main: 'index.js',
        scripts: ['index.js', 'lib/apples.js'],
        styles: ['testything.css']
      };
      var str = JSON.stringify(json, null, 2);

      request(app)
      .get('/stephenmathieson/testything/0.0.4/component.json')
      .expect(str + '\n', done);
    });
  });

  describe('GET /stephenmathieson/testything/0.0.4/lib/apples.js', function () {
    it('should 200', function (done) {
      request(app)
      .get('/stephenmathieson/testything/0.0.4/lib/apples.js')
      .expect(200, done);
    });

    it('should set headers', function (done) {
      request(app)
      .get('/stephenmathieson/testything/0.0.4/lib/apples.js')
      .expect('content-type', /.+/)
      .expect('content-length', /.+/)
      .expect('last-modified', /.+/, done);
    });

    it('should provide lib/apples.js', function (done) {
      var str = '\nmodule.exports = \'apples\'';

      request(app)
      .get('/stephenmathieson/testything/0.0.4/lib/apples.js')
      .expect(str + '\n', done);
    });
  });
});

