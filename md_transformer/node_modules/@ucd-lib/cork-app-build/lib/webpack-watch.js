const generator = require('./webpack-root');

module.exports = (config, ie=false) => {
  config.env = 'development';
  config.outputPath = config.preview;

  config.outputFile = config.modern;
  let webpackConfig = generator(config);

  if( ie ) {
    config.outputFile = config.ie || 'bundle-ie.js';
    let webpackConfigIE = generator(config, true);

    webpackConfig = [webpackConfig, webpackConfigIE];
  }

  return webpackConfig;
}