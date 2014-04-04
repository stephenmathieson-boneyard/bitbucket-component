
var env = process.env.NODE_ENV || 'development';

exports = module.exports = require('./' + env + '.config.json');
exports.env = env;
