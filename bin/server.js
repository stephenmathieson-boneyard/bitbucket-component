#!/usr/bin/env node

var bc = require('..'),
    express = require('express'),
    path = require('path'),
    Command = require('commander').Command;

var program = new Command('bitbucket-component');

program
  .version(require('../package.json').version)
  .option('-u, --username [username]', 'bitbucket.org username')
  .option('-w, --password [password]', 'bitbucket.org password')
  .option('-d, --directory [directory]', 'directory for repositories')
  .option('-p, --port [port]', 'port for server', 3000)
  .parse(process.argv);

if (!program.directory) program.directory = path.join(process.cwd(), 'repos');

var app = express();

app.use(express.logger('dev'));
app.use(bc({
  username: program.username,
  password: program.password,
  directory: program.directory
}));

app.listen(program.port);
