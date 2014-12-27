var React = require("react");

require("./style.css");
var Map = require('../Map');


// Require React-Router
var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;


var Application = React.createClass({
    render: function () {
        return (
            <div>
                <Map/>
                <RouteHandler/>
            </div>
        );
    }
});

module.exports = Application;
