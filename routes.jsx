var React = require("react");

var App = require("./components/smart/Application");
var Default = require("./components/smart/Default");
var ParkingContainer = require("./components/smart/ParkingContainer");
var NewParkingContainer = require("./components/smart/NewParkingContainer");
var Modal = require("./components/dump/Modal/Modal");

var Router = require("react-router");
var Route = Router.Route;
var IndexRoute = Router.IndexRoute;

var Routes = (
  <Route path="/" component={ App } >
    <IndexRoute component={ Default }/>
    <Route path="/p/:id" component={ ParkingContainer }/>
    <Route path="/add" component={ NewParkingContainer }/>
    <Route path="/about" component={ Modal }/>
  </Route>
);

module.exports = Routes;
