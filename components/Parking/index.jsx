var React = require("react");
var Router = require('react-router');
var Link = Router.Link;
var flux = require("../../fluxy")
require("./style.css");
var _each = require("lodash").forEach;
var Comment = require("../Comment");

var Parking = React.createClass({
    mixins: [Router.State],

    getInitialState: function () {
        var store = flux.store("ParkingStore");
        var opinionStore = flux.store("OpinionStore");

        return {
            loading: store.loading,
            error: store.error,
            words: _.values(store.words),
            currentParking: store.currentParking,
            currentParkingId: store.currentParkingId,
            currentParkingOpinions: opinionStore.opinionsByParking[this.getParams().id] ? opinionStore.opinionsByParking[this.getParams().id] : []
        };
    },

    render: function () {
        var comments = this.state.currentParkingOpinions.map(function (opinion) {
           return <Comment key={ opinion.tempId || opinion.id } opinion={ opinion } />
        });
        return (
            <div className="sidebar__wrapper">
                <div className="sidebar__content">
                    Parking: { this.getParams().id }
                    <br/>
                    { this.state.loading ? <div>Loading...</div> : <div> {this.state.currentParking.title}</div> }
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
            flux.actions.postOpinion({comment: this.state.newCommentText, parkingId: this.getParams().id});
            this.setState({newCommentText: ""});
        }
    },
    componentDidMount: function () {
        var storeNames = ["ParkingStore", "OpinionStore"];
        _each(storeNames, function (store) {
            flux.store(store).on("change", this._setStateFromFlux);
        }, this);

        flux.actions.loadCurrentParking(this.getParams().id);
        flux.actions.loadOpinions(this.getParams().id);

    },

    componentWillUnmount: function () {
        var storeNames = ["ParkingStore", "OpinionStore"];
        _each(storeNames, function (store) {
            flux.store(store).removeListener("change", this._setStateFromFlux);
        }, this);
    },

    componentWillReceiveProps: function (nextProps) {
        flux.actions.loadCurrentParking(this.getParams().id);
        flux.actions.loadOpinions(this.getParams().id);
    },

    _setStateFromFlux: function () {
        if (this.isMounted()) {
            var store = flux.store("ParkingStore");
            var opinionStore = flux.store("OpinionStore");

            this.setState({
                loading: store.loading,
                error: store.error,
                currentParking: store.currentParking,
                currentParkingId: store.currentParkingId,
                currentParkingOpinions: opinionStore.opinionsByParking[this.getParams().id] ? opinionStore.opinionsByParking[this.getParams().id] : []
            });
        }
    }

});

module.exports = Parking;
