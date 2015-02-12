var React = require("react/addons"),
    Fluxxor = require("fluxxor");

require("./style.css");

var Router = require('react-router');
var Link = Router.Link;

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Button = require("../Button"),
    IsMotoQuestion = require("../IsMotoQuestion");

var NewParkingEditInfo = React.createClass({

    mixins: [Router.State, FluxMixin, StoreWatchMixin("ParkingStore")],

    render: function () {
        return (
            <div className="edit_location__wrapper">
                <div className="edit_location__content">
                    <div className="my-opinion__row">
                        <IsMotoQuestion callback={ this.onIsMotoQuestionCallback } value={ this.state.newParking.isMoto }/>
                    </div>
                    { this.state.newParking.isMoto ?
                        <div>
                            <div className="my-opinion__row">
                                <div className="my-opinion__row__text" onClick={ this.onEditLocation }>
                                    Изменить местоположение
                                </div>
                            </div>
                            <div className="my-opinion__row">
                                <Button text="Отмена" callback={ this.onNewParkingEditInfoCancel }/>
                                <Button text="Создать" callback={ this.onNewParkingEditInfoDone }/>
                            </div>
                        </div>
                        : <div />
                        }
                </div>
            </div>
        )
    },

    getStateFromFlux: function () {
        var store = this.getFlux().store("ParkingStore");

        return {
            newParking: store.newParking
        }
    },

    onNewParkingEditInfoDone: function () {
        var store = this.getFlux().store("ParkingStore");
        this.getFlux().actions.saveNewParking(store.newParking)
    },

    onNewParkingEditInfoCancel: function () {
        this.getFlux().actions.onNewParkingEditInfoCancel()
    },

    onIsMotoQuestionCallback: function (value) {
        var store = this.getFlux().store("ParkingStore");
        this.getFlux().actions.newParkingUpdateData({isMoto: value});
    },

    onEditLocation: function () {
        this.getFlux().actions.newParkingEditLocation()
    }


});

module.exports = NewParkingEditInfo;
