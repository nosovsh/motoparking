// Stupid simple server
var express = require('express');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var app = express();
var port = 3004;
var webPackPort = 3005;

app.get("/*", function (req, res) {
    res.end("<!DOCTYPE html>\n"+
"<html>\n" +
"  <head>\n" +
"    <meta charset='utf-8'/>\n" +
"    <title>Hello React</title>\n" +
"  </head>\n" +
"  <body>\n" +
"    <div id='content'></div>\n" +
"    <script src='http://localhost:" + webPackPort +"/build/bundle.js'></script>\n" +
"  </body>\n" +
"</html>");
});

app.listen(port, function () {
    console.log("Server listening on port " + port);
});

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true
}).listen(webPackPort, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:' + webPackPort);
});
