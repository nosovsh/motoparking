
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
      { test: /\.png$/, loader: "file" },
      { test: /\.jpg$/, loader: "file" },
      { test: /\.(ttf|eot|svg|woff|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
      //{	test: "png|jpg|jpeg|gif|svg", loader: "url-loader?limit=10000",}

    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};