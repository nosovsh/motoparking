var React = require("react"),
    Fluxxor = require("fluxxor");

require("./style.css");

var Map = require('../Map'),
    EditLocation = require('../EditLocation');

var FluxMixin = Fluxxor.FluxMixin(React);


// Require React-Router
var Router = require('react-router');
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;


var Application = React.createClass({
    mixins: [FluxMixin],
    render: function () {
        return (
            <div>
                <Map/>
                <EditLocation />
                <RouteHandler/>
            </div>
        );
    }
});

module.exports = Application;
