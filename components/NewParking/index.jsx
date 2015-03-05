var React = require("react/addons"),
    Fluxxor = require("fluxxor");


require("./style.css");

var Button = require("../Button"),
    IsMotoQuestion = require("../IsMotoQuestion"),
    ButtonRow = require("../ButtonRow"),
    TextInput = require("../TextInput"),
    Icon = require("../Icon");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Router = require('react-router'),
    Link = Router.Link;


var NewParking = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("ParkingStore")],

    render: function () {
        return (
            <div className="new-parking">

                <Link to="Default">
                    <div className="close-wrapper">
                        <Icon name="close" />
                    </div>
                </Link>

                <div className="my-opinion__row">
                    <p>Вы добавляете охраняемую парковку.</p>
                    <IsMotoQuestion
                        callback={ this.onIsMotoQuestionCallback }
                        value={ this.state.newParking.isMoto }
                        text="На неё пускают мотоциклы?"/>
                </div>
                { this.state.newParking.isMoto == "yes" ?
                    <div className="my-opinion__row">

                        <div className="PricesEditing">
                            <div className="PricesEditing__Price">
                                <div className="PricesEditing__Price__Label">
                                    День
                                </div>
                                <div className="PricesEditing__Price__Value">
                                    <TextInput onChange={ this.onPricePerDayChange } value={ this.state.newParking.pricePerDay }/>

                                    <Icon name="rouble"  additionalClasses={ ["Rouble"] } />
                                </div>
                            </div>

                            <div className="PricesEditing__Price">

                                <div className="PricesEditing__Price__Label">
                                    Месяц
                                </div>
                                <div className="PricesEditing__Price__Value">
                                    <TextInput onChange={ this.onPricePerMonthChange } value={ this.state.newParking.pricePerMonth }/>

                                    <Icon name="rouble"  additionalClasses={ ["Rouble"] } />
                                </div>
                            </div>

                        </div>
                    </div> : null }

                <ButtonRow text="Создать парковку" callback={ this.onNewParkingDone } />

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
            newParking: store.newParking
        };
    },

    onIsMotoQuestionCallback: function (value) {
        this.getFlux().actions.newParkingUpdateData({isSecure: "yes", isMoto: value});
    },

    onNewParkingDone: function () {
        var store = this.getFlux().store("ParkingStore");
        this.getFlux().actions.saveNewParking(store.newParking)
    },

    onPricePerDayChange: function (e) {
        var price = parseInt(e.target.value);
        price = isNaN(price) ? "" : price;
        this.getFlux().actions.newParkingUpdateData({pricePerDay: price});
    },

    onPricePerMonthChange: function (e) {
        var price = parseInt(e.target.value);
        price = isNaN(price) ? "" : price;
        this.getFlux().actions.newParkingUpdateData({pricePerMonth: price});
    }
});

module.exports = NewParking;
