var React = require("react/addons"),
    Fluxxor = require("fluxxor");

require("./style.css");

var Router = require('react-router');
var Link = Router.Link;

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Comment = require("../Comment");
var StatusCover = require("../StatusCover");
var MyOpinion = require("../MyOpinion");

var Parking = React.createClass({
    mixins: [Router.State, FluxMixin, StoreWatchMixin("ParkingStore")],

    render: function () {
        var comments = this.state.currentParkingOpinions.map(function (opinion) {
           return <Comment key={ opinion.tempId || opinion.id } opinion={ opinion } />
        });

        var sidebarWrapperClasses = {
            'sidebar__wrapper': true,
            'sidebar__wrapper__hidden': this.state.editingLocation || this.state.newParkingEditingLocation || this.state.newParkingEditInfo
        };

        return (
            <div className={ React.addons.classSet(sidebarWrapperClasses) }>
                <div className="sidebar__content">
                    <StatusCover status={ this.state.currentParking.status } />

                    <MyOpinion parking={ this.state.currentParking }/>
                    { this.state.loading ? <div>Loading...</div> : <div /> }
                    <br/>
                    <form onSubmit={this.handlePostComment}>
                      <input type="text" value={this.state.newCommentText}
                             onChange={this.handleNewCommentTextChange} />
                      <input type="submit" value="Add" />
                    </form>
                    { comments }

                    <Link to="Default">закрыть</Link>
                    <br />
                    <br />

                </div>
            </div>
        )
    },

    handleNewCommentTextChange: function (e) {
        this.setState({newCommentText: e.target.value});
    },

    handlePostComment: function (e) {
        e.preventDefault();
        if (this.state.newCommentText.trim()) {
            this.getFlux().actions.postOpinion({comment: this.state.newCommentText, parkingId: this.getParams().id});
            this.setState({newCommentText: ""});
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
            editingLocation: store.editingLocation,
            newParkingEditingLocation: store.newParkingEditingLocation,
            newParkingEditInfo: store.newParkingEditInfo
        };
    }

});

module.exports = Parking;
