var React = require("react/addons"),
    Fluxxor = require("fluxxor"),
    CSSTransitionGroup = React.addons.CSSTransitionGroup;

require("./style.css");

var Router = require('react-router'),
    Link = Router.Link;

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var StatusCover = require("../StatusCover"),
    MyOpinion = require("../MyOpinion"),
    EditLocation = require("../EditLocation"),
    Icon = require("../Icon"),
    Photo = require("../Photo");


var Parking = React.createClass({
    mixins: [Router.State, FluxMixin, StoreWatchMixin("ParkingStore")],

    render: function () {
        if (this.state.editingLocation) {
            return (
                <div className="edit-location">
                    <EditLocation />
                </div>
            )
        } else {
            return (
                <div className="sidebar__wrapper">
                    <div className="sidebar__content">
                        <Link to="Default">
                            <div className="close-wrapper">
                                <Icon name="close" />
                            </div>
                        </Link>

                        <StatusCover isSecure={ this.state.currentParking.isSecure }  isMoto={ this.state.currentParking.isMoto }/>

                        { this.state.currentParking.isFullParkingLoaded ? (
                            <div>
                                <div className="Prices">
                                    <div className="Prices__Price">
                                        <div className="Prices__Price__Label">
                                            День
                                        </div>
                                        <div className="Prices__Price__Value">
                                            70<Icon name="rouble" style={ {fontSize: "14px"} } />
                                        </div>
                                    </div>

                                    <div className="Prices__Price">

                                        <div className="Prices__Price__Label">
                                            Месяц
                                        </div>
                                        <div className="Prices__Price__Value">
                                            3500<Icon name="rouble" style={ {fontSize: "14px"} } />
                                        </div>
                                    </div>

                                </div>
                                <Photo url="/static/test-garaj.jpg" />
                                <div className="InfoRow">
                                    ул. Ленина д. 6, владение 17
                                <Icon name="edit" style={ {float: "right", cursor: "pointer"} } onClick={ this.editLocation }/>
                                </div>

                                <MyOpinion parking={ this.state.currentParking }/>
                            </div>) :
                            <div className="loading">Loading...</div> }
                    </div>
                </div>
            )
        }
    },

    componentDidMount: function () {
        this.getFlux().actions.loadCurrentParking(this.getParams().id);
        //this.getFlux().actions.loadOpinions(this.getParams().id);
    },

    componentWillReceiveProps: function (nextProps) {
        this.getFlux().actions.loadCurrentParking(this.getParams().id);
        //this.getFlux().actions.loadOpinions(this.getParams().id);
    },

    getStateFromFlux: function () {
        var store = this.getFlux().store("ParkingStore");
        var opinionStore = this.getFlux().store("OpinionStore");

        return {
            loading: store.loading,
            error: store.error,
            currentParking: store.getCurrentParking(),
            currentParkingId: store.currentParkingId,
            currentParkingOpinions: opinionStore.opinionsByParking[this.getParams().id] ? opinionStore.opinionsByParking[this.getParams().id] : [],
            editingLocation: store.editingLocation
        };
    },
    editLocation: function () {
        this.getFlux().actions.editLocation();
    }

});

module.exports = Parking;
