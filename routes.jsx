var React = require("react");

var App = require("./components/smart/Application");
var Default = require("./components/smart/Default");
var ParkingContainer = require("./components/smart/ParkingContainer");
var NewParkingContainer = require("./components/smart/NewParkingContainer");
var Modal = require("./components/dump/Modal/Modal");

var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var Routes = (
  <Route handler={ App }>
    <DefaultRoute name="Default" handler={ Default } addHandlerKey />
    <Route name="Parking" path="/p/:id" handler={ ParkingContainer } addHandlerKey />
    <Route name="NewParking" path="/add" handler={ NewParkingContainer } addHandlerKey />
    <Route name="Info" path="/about" handler={ Modal } addHandlerKey />
  </Route>
);

module.exports = Routes;
