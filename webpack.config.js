
var webpack = require('webpack');

module.exports = {
  // Entry point for static analyzer:
  entry: [
    'webpack-dev-server/client?http://localhost:3005',
    'webpack/hot/only-dev-server',
    './entry.jsx',
  ],

  output: {
    path: __dirname + '/build/',
    filename: 'bundle.js',
    publicPath: 'http://localhost:3005/build/'
  },

  resolve: {
    // Allow to omit extensions when requiring these files
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      // Pass *.jsx files through jsx-loader transform
      { test: /\.jsx$/, loaders: ['react-hot', 'jsx'] },
      { test: /\.css$/, loader: "style!css" },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};