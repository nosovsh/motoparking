var React = require("react/addons");
var Fluxxor = require("fluxxor");

var Router = require("react-router");

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Parking = require("../Parking");
var EditLocation = require("../EditLocation");


var ParkingContainer = React.createClass({
  mixins: [Router.State, FluxMixin, StoreWatchMixin("ParkingStore", "OpinionStore", "CommentStore", "CurrentUserStore")],

  componentDidMount: function() {
    this.getFlux().actions.loadCurrentParking(this.getParams().id);

    /**
     * Sending scroll event to analytics.
     * Temporary disable
     */
    /*
     var parkingContent = this.refs.parking__content.getDOMNode();
     var parkingContentInner = this.refs.parking__content__inner.getDOMNode();
     $(parkingContent).scroll(function () {
     if ($(parkingContent).scrollTop() + $(parkingContent).height() == $(parkingContentInner).height()) {
     this.getFlux().actions.parkingScrolled("bottom")
     }
     if ($(parkingContent).scrollTop() == 0) {
     this.getFlux().actions.parkingScrolled("top")
     }
     }.bind(this))
     */
  },

  componentWillReceiveProps: function(nextProps) { // eslint-disable-line no-unused-vars
    this.getFlux().actions.loadCurrentParking(this.getParams().id);
  },

  getStateFromFlux: function() {
    var store = this.getFlux().store("ParkingStore");
    var opinionStore = this.getFlux().store("OpinionStore");
    var commentStore = this.getFlux().store("CommentStore");
    var currentUserStore = this.getFlux().store("CurrentUserStore");

    return {
      loading: store.loading,
      error: store.error,
      currentParking: store.getCurrentParking(),
      currentParkingOpinions: opinionStore.opinionsByParking[store.currentParkingId] ? opinionStore.opinionsByParking[store.currentParkingId] : [],
      editingLocation: store.editingLocation,
      comments: commentStore.getComments(store.currentParkingId),
      loadingAddress: store.loadingAddress,
      loadingAddressError: store.loadingAddressError,
      currentUser: currentUserStore.currentUser
    };
  },

  editLocation: function() {
    this.getFlux().actions.editLocation();
  },

  deleteParking: function() {
    this.getFlux().actions.deleteParking(this.state.currentParking.id);
  },

  render: function() {
    if (this.state.editingLocation) {
      return (
          <EditLocation />
      );
    }
    return (
      <Parking
        loading={ this.state.loading }
        error={ this.state.error }
        currentParking={ this.state.currentParking }
        currentParkingId={ this.state.currentParkingId }
        currentParkingOpinions={ this.state.currentParkingOpinions }
        comments={ this.state.comments }
        loadingAddress={ this.state.loadingAddress }
        loadingAddressError={ this.state.loadingAddressError }
        currentUser={ this.state.currentUser }
        onEditLocation={ this.editLocation }
        onDeleteParking={ this.deleteParking }
      />
    );
  }
});

module.exports = ParkingContainer;
