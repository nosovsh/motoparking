var React = require("react/addons");
var Fluxxor = require("fluxxor");

var Router = require("react-router");

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Parking = require("../Parking");
var EditLocation = require("../dump/EditLocation/EditLocation");


var ParkingContainer = React.createClass({
  mixins: [Router.State, FluxMixin, StoreWatchMixin("ParkingStore", "OpinionStore", "CommentStore", "CurrentUserStore")],

  componentDidMount: function() {
    this.getFlux().actions.loadCurrentParking(this.getParams().id);
  },

  componentWillReceiveProps: function(nextProps) { // eslint-disable-line no-unused-vars
    this.getFlux().actions.loadCurrentParking(this.getParams().id);
  },

  onEditLocationDone: function() {
    var store = this.getFlux().store("ParkingStore");
    var myOpinion = store.getMyOpinionOfCurrentParking();
    myOpinion.latLng = {
      type: "Point",
      coordinates: [store.currentParkingTemporaryPosition.lat, store.currentParkingTemporaryPosition.lng]
    };
    this.getFlux().actions.editLocationDone(myOpinion);
  },

  onEditLocationCancel: function() {
    this.getFlux().actions.editLocationCancel();
  },

  onEditLocation: function() {
    this.getFlux().actions.editLocation();
  },

  onDeleteParking: function() {
    this.getFlux().actions.deleteParking(this.state.currentParking.id);
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

  render: function() {
    if (this.state.editingLocation) {
      return (
          <EditLocation
            onEditLocationDone={ this.onEditLocationDone }
            onEditLocationCancel={ this.onEditLocationCancel }/>
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
        onEditLocation={ this.onEditLocation }
        onDeleteParking={ this.onDeleteParking }
      />
    );
  }
});

module.exports = ParkingContainer;
