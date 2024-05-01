// webpack.config.js
const path = require('path');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify'),
    url: require.resolve('url'),
    net: false, 
    tls: false,
    buffer: require.resolve('buffer/'),
    dns: false,
    process: require.resolve('process/browser'),
  };

  return config;
};
/* module.exports = {
    // other webpack configuration options...
    resolve: {
      fallback: {
        "buffer": require.resolve("buffer/"),
        "crypto": require.resolve("crypto-browserify")
      }
    }

  };  */
  
  /* const { addPolyfillPlugin } = require('customize-cra');

  module.exports = function override(config, env) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
    };
  
    config = addPolyfillPlugin(config, ['crypto']);
  
    return config;
  }; */