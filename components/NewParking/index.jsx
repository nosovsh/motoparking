var React = require("react/addons"),
    Fluxxor = require("fluxxor");


require("./style.css");

var Button = require("../Button"),
    IsMotoQuestion = require("../IsMotoQuestion"),
    PriceQuestion = require("../PriceQuestion"),
    ButtonRow = require("../ButtonRow"),
    Icon = require("../Icon");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Router = require('react-router'),
    Link = Router.Link;


var NewParking = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("ParkingStore")],

    render: function () {
        var newParkingDoneIconClasses = {
            "animate-spin": this.state.savingNewParking
        };
        return (
            <div className="new-parking">

                <Link to="Default">
                    <div className="close-wrapper">
                        <Icon name="close" />
                    </div>
                </Link>

                <div className="my-opinion__row">
                    <p>Вы добавляете охраняемую <br/>парковку.</p>
                    <IsMotoQuestion
                        callback={ this.onIsMotoQuestionCallback }
                        value={ this.state.newParking.isMoto }
                        text="На неё пускают мотоциклы?"/>
                </div>
                { this.state.newParking.isMoto == "yes" ?
                    <div className="my-opinion__row">
                        <PriceQuestion
                            pricePerDay={ this.state.newParking.pricePerDay }
                            pricePerMonth={ this.state.newParking.pricePerMonth }
                            callback={ this.onPriceChange } />

                    </div> : null }

                <ButtonRow callback={ this.onNewParkingDone }>
                    <Icon name="rocket" additionalClasses={ [React.addons.classSet(newParkingDoneIconClasses)] }/>Создать парковку
                </ButtonRow>

            </div>
        )
    },

    componentDidMount: function () {
        this.getFlux().actions.newParking();
    },

    componentWillReceiveProps: function (nextProps) {
        this.getFlux().actions.newParking();
    },

    getStateFromFlux: function () {
        var store = this.getFlux().store("ParkingStore");

        return {
            newParkingEditingLocation: store.newParkingEditingLocation,
            newParkingEditInfo: store.newParkingEditInfo,
            newParking: store.newParking,
            savingNewParking: store.savingNewParking
        };
    },

    onIsMotoQuestionCallback: function (value) {
        this.getFlux().actions.newParkingUpdateData({isSecure: "yes", isMoto: value});
    },

    onNewParkingDone: function () {
        var store = this.getFlux().store("ParkingStore");
        this.getFlux().actions.saveNewParking(store.newParking)
    },

    onPriceChange: function (dictWithPrices) {
        this.getFlux().actions.newParkingUpdateData(dictWithPrices)
    }

});

module.exports = NewParking;
