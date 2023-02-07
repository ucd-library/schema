const generator = require('./webpack-root');

module.exports = (config) => {
  config.env = 'production';
  config.outputPath = config.dist;

  config.outputFile = config.modern;
  let webpackConfig = generator(config);

  config.outputFile = config.ie || 'bundle-ie.js';
  let webpackConfigIE = generator(config, true);
  
  return [webpackConfig, webpackConfigIE];
}