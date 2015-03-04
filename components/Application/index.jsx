var React = require("react/addons"),
    Fluxxor = require("fluxxor"),
    CSSTransitionGroup = React.addons.CSSTransitionGroup;

require("normalize.css/normalize.css");
require("./style.css");

var Map = require('../Map'),
    Controls = require('../Controls');


// Require React-Router
var Router = require('react-router');
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;


var InnerApplication = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("ParkingStore")],
    render: function () {
        return (
            <div>
                <Controls />
            </div>
        );
    },

    getStateFromFlux: function () {
        var store = this.getFlux().store("ParkingStore");

        return {
        };
    }
});


var Application = React.createClass({
    mixins: [FluxMixin,  Router.State ],
    render: function () {
        var name = this.getRoutes().reverse()[0].name;
        return (
            <div>
                <Map/>
                <InnerApplication />
                <CSSTransitionGroup transitionName="page" className="one-more-wrapper">

                    <RouteHandler key={name} />
                </CSSTransitionGroup>

            </div>
        );
    }
});

module.exports = Application;
