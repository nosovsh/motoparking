var React = require("react/addons"),
    Fluxxor = require("fluxxor");


require("./style.css");

var NewParkingEditInfo = require('../NewParkingEditInfo'),
    NewParkingEditLocation = require('../NewParkingEditLocation');

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;


var NewParking = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("ParkingStore")],

    render: function () {
        return (
            <div>
                { this.state.newParkingEditingLocation ? <NewParkingEditLocation /> : <div /> }
                { this.state.newParkingEditInfo ? <NewParkingEditInfo /> : <div /> }
            </div>
        )
    },

    componentDidMount: function () {
        this.getFlux().actions.newParkingEditLocation();
    },

    componentWillReceiveProps: function (nextProps) {
        this.getFlux().actions.newParkingEditLocation();
    },

    getStateFromFlux: function () {
        var store = this.getFlux().store("ParkingStore");

        return {
            newParkingEditingLocation: store.newParkingEditingLocation,
            newParkingEditInfo: store.newParkingEditInfo
        };
    }
});

module.exports = NewParking;
