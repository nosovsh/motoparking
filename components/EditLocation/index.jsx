var React = require("react/addons"),
    Fluxxor = require("fluxxor");

require("./style.css");

var Router = require('react-router');
var Link = Router.Link;

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Button = require("../Button");

var EditLocation = React.createClass({

    mixins: [Router.State, FluxMixin],

    render: function () {
        return (
            <div className="edit_location__wrapper">
                <div className="edit_location__content">
                    <div className="my-opinion__row">
                        <p>Подвиньте маркер парковки</p>
                        <Button text="Отмена" callback={ this.onEditLocationCancel }/>
                        <Button text="Сохранить" callback={ this.onEditLocationDone }/>
                    </div>
                </div>
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
