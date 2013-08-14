
module.exports = process.env.BC_COV
  ? require('./lib-cov/bitbucket-component')
  : require('./lib/bitbucket-component');

