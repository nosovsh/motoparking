var React = require('react');
var routes = require('./routes');

// Require React-Router
var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var analytics = require('ga-react-router');

window.React = React; // For chrome dev tool support

var flux = require("./fluxy");

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  React.render(<Handler flux={flux}/>, document.body);
  analytics(state);
});

