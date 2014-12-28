var React = require("react");
var Router = require('react-router');
var Link = Router.Link;
var flux = require("../../fluxy")
require("./style.css");
var _each = require("lodash").forEach;

var Parking = React.createClass({
    mixins: [Router.State],

    getInitialState: function () {

        var store = flux.store("ParkingStore");
        return {
            loading: store.loading,
            error: store.error,
            words: _.values(store.words),
            currentParking: store.currentParking,
            currentParkingId: store.currentParkingId
        };
    },

    render: function () {
        return (
            <div className="sidebar__wrapper">
                <div className="sidebar__content">
                    Parking: { this.getParams().id }
                    <br/>
                    { this.state.loading ? <div>Loading...</div> : <div> {this.state.currentParking.title}</div> }

                    <Link to="Default">закрыть</Link>
                    <br />
                    <br />

                </div>
            </div>
        )
    },

    componentDidMount: function () {

        var storeNames = ["ParkingStore"];
        _each(storeNames, function (store) {
            flux.store(store).on("change", this._setStateFromFlux);
        }, this);

        flux.actions.loadCurrentParking(this.getParams().id);
    },

    componentWillUnmount: function () {
        var storeNames = ["ParkingStore"];
        _each(storeNames, function (store) {
            flux.store(store).removeListener("change", this._setStateFromFlux);
        }, this);
    },

    componentWillReceiveProps: function (nextProps) {
        flux.actions.loadCurrentParking(this.getParams().id);
    },

    _setStateFromFlux: function () {
        if (this.isMounted()) {
            var store = flux.store("ParkingStore");

            this.setState({
                loading: store.loading,
                error: store.error,
                currentParking: store.currentParking,
                currentParkingId: store.currentParkingId
            });
        }
    }

});

module.exports = Parking;
