
var bc = require('..'),
    express = require('express'),
    path = require('path'),
    program = require('commander');


program
  .option('-u, --username <username>', 'bitbucket.org username')
  .option('-w, --password <password>', 'bitbucket.org password')
  .option('-d, --directory [directory]', 'directory for repositories')
  .option('-p, --port [port]', 'port for server', 3000)
  .parse(process.argv);

if (!program.username || !program.password) {
  program.help();
}

if (!program.directory) program.directory = path.join(process.cwd(), 'repos');

var app = express();

app.use(express.logger('dev'));
app.use(bc({
  username: program.username,
  password: program.password,
  directory: program.directory
}));

app.listen(program.port);
