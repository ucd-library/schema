const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

let config = require('@ucd-lib/cork-app-build').dist({
    // root directory, all paths below will be relative to root
    target: 'web',
    root : __dirname,
    // path to your entry .js file
    entry : './src/index.js',
    // folder where bundle.js and ie-bundle.js will be written
    dist : './src/dist',
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
    ],
    resolve: {
      fallback: {
          buffer: require.resolve('buffer/'),
      },
    },
    // plugins: [
    //     new webpack.DefinePlugin({
    //         'process.env.NODE_ENV': JSON.stringify('development')
    //     })
    // ],
  });
  
  module.exports = config;