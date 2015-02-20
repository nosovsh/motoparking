var React = require("react/addons"),
    Fluxxor = require("fluxxor");

require("./style.css");

var Router = require('react-router');
var Link = Router.Link;

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Button = require("../Button");

var NewParkingEditLocation = React.createClass({

    mixins: [Router.State, FluxMixin, StoreWatchMixin("ParkingStore")],

    render: function () {
        return (
            <div className="my-opinion__row">
                <p>Подвиньте маркер парковки</p>
                <Button text="Отмена" callback={ this.onNewParkingEditLocationCancel }/>
                <Button text="Продолжить" callback={ this.onNewParkingEditInfo } />
            </div>
        )
    },

    getStateFromFlux: function () {
        var flux = this.getFlux();
        return {
        }
    },

    onNewParkingEditInfo: function () {
        this.getFlux().actions.newParkingEditInfo()
    },

    onNewParkingEditLocationCancel: function () {
        this.getFlux().actions.newParkingEditLocationCancel()
    }

});

module.exports = NewParkingEditLocation;
