
var spawn = require('win-fork'),
    path = require('path'),
    fs = require('fs'),
    request = require('supertest'),
    rimraf = require('rimraf');

var bin = path.join(__dirname, '../../bin/server.js'),
    conf = path.join(__dirname, 'gh-6-config.json'),
    repos = path.join(__dirname, 'gh-6-repos');


describe('bitbucket-component(1)', function () {

  var server;

  before(function (done) {

    // write config file
    fs.writeFileSync(conf, JSON.stringify({
      directory: repos,
      port: 5000
    }, null, 2));

    // start server
    server = spawn(bin, [ '-c', conf, '--verbose' ]);

    server
      .stdout
      // assuming the first data received is
      // the "im listening" message
      .once('data', function () {
        done();
      });
  });

  after(function () {
    fs.unlinkSync(conf);
    rimraf.sync(repos);
    process.kill(server);
  });

  it('should support a config file', function (done) {

    var file = '/stephenmathieson/testything/0.0.4/component.json';

    request('http://localhost:5000')
      .get(file)
      .expect(200, function (err) {
        if (err) return done(err);
        fs.existsSync(repos).should.be.true;
        fs.existsSync(path.join(repos, file)).should.be.true;
        done();
      });
  });
});
