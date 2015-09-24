var config = require("./webpack.config");
var webpack = require("webpack");
var path = require("path");

config.entry = [
  "./entry.jsx"
];

config.output = {
  path: path.join(__dirname, "./static/build/"),
  filename: "[name].js",
  publicPath: "/static/build/",
  chunkFilename: "[id].js"
};

config.module = {
  loaders: [
    // Pass *.jsx files through jsx-loader transform
    {test: /\.jsx$/, loaders: ["jsx"]},
    {test: /\.css$/, loader: "style!css"},
    {test: /\.png$/, loader: "file"},
    {test: /\.jpg$/, loader: "file"},
    {test: /\.(ttf|eot|svg|woff|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"}
    // {	test: "png|jpg|jpeg|gif|svg", loader: "url-loader?limit=10000",}

  ]
};

config.plugins = [
  new webpack.optimize.UglifyJsPlugin({minimize: true}),
  new webpack.DefinePlugin({
    GA_TRACKING_CODE: JSON.stringify("UA-59996600-1"),
    DEBUG: false,
    YANDEX_API_KEY: JSON.stringify("AHMEKVUBAAAAdcQIfQIA6t3GMOs3_4bbwjkyhyBbjTpnP0cAAAAAAAAAAACGT93VehWe6n5wXG-tL7Gv_61nSw==")
  })

];

module.exports = config;
