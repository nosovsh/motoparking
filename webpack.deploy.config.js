var config = require("./webpack.config");
var webpack = require('webpack');


config["entry"] = [
    './entry.jsx',
];
config["output"] = {
    path: __dirname + '/static/build/',
    filename: '[name].js',
    publicPath: '/static/build/',
    chunkFilename: "[id].js"
};

config["module"] = {
    loaders: [
        // Pass *.jsx files through jsx-loader transform
        {test: /\.jsx$/, loaders: ['jsx']},
      { test: /\.css$/, loader: "style!css" },
        {test: /\.png$/, loader: "file"},
        {test: /\.jpg$/, loader: "file"},
        {test: /\.(ttf|eot|svg|woff|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"}
        //{	test: "png|jpg|jpeg|gif|svg", loader: "url-loader?limit=10000",}

    ]
};
config["plugins"] = [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
];

module.exports = config;