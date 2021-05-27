const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    watch: "true",
    watchOptions: {
        aggregateTimeout: 600,
      },
    mode: "development",
    entry: './src/index.js',
    devtool: 'inline-source-map',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };