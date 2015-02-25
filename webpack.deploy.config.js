var config = require("./webpack.config");

config["entry"] = [
    './entry.jsx',
];
config["output"] = {
    path: __dirname + '/static/build/',
    filename: 'bundle.js',
    publicPath: '/static/build/bundle.js'
};
config["plugins"] = [];

module.exports = config;