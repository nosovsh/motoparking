var config = require("./webpack.config");

config["entry"] = [
    './entry.jsx',
];
config["output"] = {
    path: __dirname + '/static/build/',
    filename: 'bundle.js',
    publicPath: '/static/build/bundle.js'
};

config["module"] = {
    loaders: [
        // Pass *.jsx files through jsx-loader transform
        {test: /\.jsx$/, loaders: ['jsx']},
        {test: /\.css$/, loader: "style!css"},
        {test: /\.png$/, loader: "file"},
        {test: /\.jpg$/, loader: "file"},
        {test: /\.(ttf|eot|svg|woff|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"}
        //{	test: "png|jpg|jpeg|gif|svg", loader: "url-loader?limit=10000",}

    ]
};
config["plugins"] = [];

module.exports = config;