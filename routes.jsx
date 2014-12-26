/** @jsx React.DOM */

var React = require('react');

// Require view components. One for each route.
var App = require('./components/Application');
var Default = require('./components/Default');
var Map = require('./components/Map');
var Parking = require('./components/Parking');

var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var Routes = (
  <Route handler={App}>
    <DefaultRoute name="Default" handler={Default}/>
    <Route name="Parking" path="/p/:id" handler={Parking}/>
  </Route>
);

module.exports = Routes;