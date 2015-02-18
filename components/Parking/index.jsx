var React = require("react/addons"),
    Fluxxor = require("fluxxor");

require("./style.css");

var Router = require('react-router'),
    Link = Router.Link;

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var StatusCover = require("../StatusCover"),
    MyOpinion = require("../MyOpinion"),
    Icon = require("../Icon");


var Parking = React.createClass({
    mixins: [Router.State, FluxMixin, StoreWatchMixin("ParkingStore")],

    render: function () {

        var sidebarWrapperClasses = {
            'sidebar__wrapper': true,
            'sidebar__wrapper__hidden': this.state.editingLocation || this.state.newParkingEditingLocation || this.state.newParkingEditInfo
        };

        return (
            <div className={ React.addons.classSet(sidebarWrapperClasses) }>
                <div className="sidebar__content">
                    <Link to="Default"><div className="close-wrapper"><Icon name="close" /></div></Link>

                    <StatusCover isSecure={ this.state.currentParking.isSecure }  isMoto={ this.state.currentParking.isMoto }/>

                    { this.state.currentParking.isFullParkingLoaded ? <MyOpinion parking={ this.state.currentParking }/> : <div>Loading...</div> }
                    <br/>
                </div>
            </div>
        )
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
            editingLocation: store.editingLocation,
            newParkingEditingLocation: store.newParkingEditingLocation,
            newParkingEditInfo: store.newParkingEditInfo
        };
    }

});

module.exports = Parking;
