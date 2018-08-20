const rewireSass = require('react-app-rewire-scss');

module.exports = function override(config, env) {
  config = rewireSass(config, env);
  console.log('config', config);
  //do stuff with the webpack config...
  return config;
}