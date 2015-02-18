var React = require("react"),
    Fluxxor = require("fluxxor");

require("./style.css");

var Map = require('../Map'),
    EditLocation = require('../EditLocation'),
    Controls = require('../Controls'),
    NewParkingEditInfo = require('../NewParkingEditInfo'),
    NewParkingEditLocation = require('../NewParkingEditLocation');


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
                { this.state.editingLocation ? <EditLocation /> : <div /> }
            </div>
        );
    },

    getStateFromFlux: function () {
        var store = this.getFlux().store("ParkingStore");

        return {
            editingLocation: store.editingLocation,
            newParkingEditingLocation: store.newParkingEditingLocation,
            newParkingEditInfo: store.newParkingEditInfo
        };
    }
});


var Application = React.createClass({
    mixins: [FluxMixin],
    render: function () {
        return (
            <div>
                <Map/>
                <InnerApplication />
                <RouteHandler/>
            </div>
        );
    }
});

module.exports = Application;
