#!/usr/bin/env node

var bc = require('..'),
    express = require('express'),
    path = require('path'),
    fs = require('fs'),
    Command = require('commander').Command;

var program = new Command('bitbucket-component');

program
  .version(require('../package.json').version)
  .option('-u, --username [username]', 'bitbucket.org username')
  .option('-w, --password [password]', 'bitbucket.org password')
  .option('-d, --directory [directory]', 'directory for repositories')
  .option('-p, --port [port]', 'port for server', 3000)
  .option('-c, --config [file]', 'config file')
  .option('--verbose', 'verbose output')
  .parse(process.argv);

var config = {
  port: program.port,
  username: program.username,
  password: program.password,
  directory: program.directory || path.join(process.cwd(), 'repos'),
  verbose: program.verbose
};

if (program.config) {
  var json = JSON.parse(fs.readFileSync(program.config));
  for (var opt in json) {
    config[opt] = json[opt];
  }
}

var app = module.exports = express();

app.use(bc(config));

if (config.verbose) app.use(express.logger('dev'));

app.listen(config.port, function () {
  if (config.verbose) {
    console.log('component server listening on %d', config.port);
  }
});
