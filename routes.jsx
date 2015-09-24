/** @jsx React.DOM */

var React = require("react");

// Require view components. One for each route.
var App = require("./components/smart/Application");
var Default = require("./components/Default");
var Parking = require("./components/Parking");
var NewParking = require("./components/NewParking");
var Modal = require("./components/dump/Modal/Modal");

var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var Routes = (
  <Route handler={ App }>
    <DefaultRoute name="Default" handler={ Default } addHandlerKey={true} />
    <Route name="Parking" path="/p/:id" handler={ Parking } addHandlerKey={true} />
    <Route name="NewParking" path="/add" handler={ NewParking } addHandlerKey={true} />
    <Route name="Info" path="/about" handler={ Modal } addHandlerKey={true} />
  </Route>
);

module.exports = Routes;
