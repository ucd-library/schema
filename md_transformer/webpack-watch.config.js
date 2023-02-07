const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');


let config = require('@ucd-lib/cork-app-build').watch({
    // root directory, all paths below will be relative to root
    target: 'web',
    root : "",
    // path to your entry .js file
    entry : './src/index.js',
    // folder where bundle.js will be written
    preview : './src/dist',
    // path your client (most likely installed via yarn) node_modules folder.
    // Due to the flat:true flag of yarn, it's normally best to separate 
    // client code/libraries from all other modules (ex: build tools such as this).
    // will take an array of relative paths as well
    clientModules : 'node_modules',
    plugins: [
      new HtmlWebpackPlugin({
          title: "Index",
          filename: "index.html",
          template: "./src/index.html",
          chunks: ["index"],
        }),
      new webpack.DefinePlugin({
          process: {env: {}}
      }), 
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
          process: 'process/browser',
      }),
    ]
  });


  config.resolve.fallback =  {  
        buffer: 'buffer/',
        stream: "stream-browserify",
        process: "process/browser",
        fs: 'browserify-fs',
        "crypto": "crypto-browserify",
        "tty": "tty-browserify"
      }
  
    
  // optionaly you can run:
  // require('@ucd-lib/cork-app-build').watch(config, true)
  // Adding the second flag will generate a ie build as well as a modern
  // build when in development.  Note this slows down the build process.
  
  module.exports = config;