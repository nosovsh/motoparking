var React = require("react/addons"),
    Fluxxor = require("fluxxor");

require("./style.css");

var Router = require('react-router');
var Link = Router.Link;

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ButtonRow = require("../dump/ButtonRow/ButtonRow"),
    Icon = require("../dump/Icon/Icon");

var EditLocation = React.createClass({

    mixins: [Router.State, FluxMixin],

    render: function () {
        return (
            <div className="edit-location">
                <div className="close-wrapper">
                    <Icon name="close" onClick={ this.onEditLocationCancel }/>
                </div>
                <div className="my-opinion__row">
                    Передвиньте парковку, если она расположена неточно.
                </div>
                <ButtonRow callback={ this.onEditLocationDone }><Icon name="thumbup" />Так лучше</ButtonRow>
            </div>
        )
    },

    onEditLocationDone: function () {
        var store = this.getFlux().store("ParkingStore");
        var myOpinion = store.getMyOpinionOfCurrentParking();
        myOpinion.latLng = {
            type: "Point",
            coordinates: [store.currentParkingTemporaryPosition.lat, store.currentParkingTemporaryPosition.lng]
        };
        this.getFlux().actions.editLocationDone(myOpinion)
    },

    onEditLocationCancel: function () {
        this.getFlux().actions.editLocationCancel()
    }

});

module.exports = EditLocation;
