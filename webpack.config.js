var webpack = require("webpack");
var path = require("path");

module.exports = {
  // Entry point for static analyzer:
  entry: [
    "webpack-dev-server/client?http://localhost:3005",
    "webpack/hot/only-dev-server",
    "./entry.jsx"
  ],

  output: {
    path: path.join(__dirname, "./build/"),
    filename: "[name].js",
    publicPath: "http://localhost:3005/build/"
  },

  resolve: {
    // Allow to omit extensions when requiring these files
    extensions: ["", ".js", ".jsx"],
    root: __dirname
  },

  module: {
    loaders: [
      // Pass *.jsx files through jsx-loader transform
      {test: /\.jsx$/, loaders: ["react-hot", "jsx"]},
      {test: /\.css$/, loader: "style!css"},
      {test: /\.png$/, loader: "file"},
      {test: /\.jpg$/, loader: "file"},
      {test: /\.gif/, loader: "file"},
      {test: /\.(ttf|eot|svg|woff|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"},
      // {	test: "png|jpg|jpeg|gif|svg", loader: "url-loader?limit=10000",}
      {test: /\.scss$/, loader: "style!css!sass"},
      {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}

    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      // GA_TRACKING_CODE: undefined,
      DEBUG: true,
      YANDEX_API_KEY: JSON.stringify("AHMEKVUBAAAAdcQIfQIA6t3GMOs3_4bbwjkyhyBbjTpnP0cAAAAAAAAAAACGT93VehWe6n5wXG-tL7Gv_61nSw==")
    })
  ]
};
