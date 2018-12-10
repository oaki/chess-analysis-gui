const rewireWorkboxGenerate = require('react-app-rewire-workbox');

const rewireTypescript = require('react-app-rewire-typescript');

module.exports = function override(config, env) {
  // ...
  config = rewireTypescript(config, env);
  console.log("Production build - Adding Workbox for PWAs");
console.log('config', config);
  if (env === "production") {
    console.log("Production build - Adding Workbox for PWAs");
    config = rewireWorkboxGenerate.rewireWorkboxGenerate()(config, env);
  }
  // ...
  return config;
}