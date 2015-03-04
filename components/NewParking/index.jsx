var React = require("react/addons"),
    Fluxxor = require("fluxxor");


require("./style.css");

var Button = require("../Button"),
    IsMotoQuestion = require("../IsMotoQuestion"),
    ButtonRow = require("../ButtonRow"),
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
    }
});

module.exports = NewParking;
