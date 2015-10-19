var React = require("react");
var Fluxxor = require("fluxxor");

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var config = require("../../config");

var Parking = require("../dump/Parking/Parking");


var ParkingContainer = React.createClass({
  propTypes: {
    params: React.PropTypes.object
  },

  mixins: [FluxMixin, StoreWatchMixin("ParkingStore", "OpinionStore", "CommentStore", "CurrentUserStore", "ParkingImageStore")],

  componentDidMount: function() {
    // delaying load a little bit so that animation be smooth
    setTimeout(function() {
      this.getFlux().actions.loadCurrentParking(this.props.params.id);
    }.bind(this), 600);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      this.getFlux().actions.loadCurrentParking(nextProps.params.id);
    }
  },

  onEditLocation: function() {
    this.getFlux().actions.editLocation();
  },

  onDeleteParking: function() {
    this.getFlux().actions.deleteParking(this.state.currentParking.id);
  },

  onSlideParkingImage: function(index) {
    this.getFlux().actions.slideParkingImage(index);
  },

  onAuthorizationRequired: function() {
    this.getFlux().actions.authorizationRequired();
  },

  onPostParkingImage: function(parkingImage) {
    this.getFlux().actions.postParkingImage(parkingImage);
  },

  getStateFromFlux: function() {
    var store = this.getFlux().store("ParkingStore");
    var opinionStore = this.getFlux().store("OpinionStore");
    var commentStore = this.getFlux().store("CommentStore");
    var currentUserStore = this.getFlux().store("CurrentUserStore");
    var parkingImageStore = this.getFlux().store("ParkingImageStore");

    var currentParkingId = this.props.params.id;
    return {
      loading: store.loading,
      error: store.error,
      currentParking: store.getParking(currentParkingId),
      currentParkingOpinions: opinionStore.opinionsByParking[currentParkingId] ? opinionStore.opinionsByParking[currentParkingId] : [],
      parkingImages: parkingImageStore.getParkingImages(currentParkingId),
      editingLocation: store.editingLocation,
      comments: commentStore.getComments(currentParkingId),
      loadingAddress: store.loadingAddress,
      loadingAddressError: store.loadingAddressError,
      currentUser: currentUserStore.currentUser,
      currentUserIsAuthorized: currentUserStore.isAuthorized()
    };
  },

  render: function() {
    return (
      <Parking
        loading={ this.state.loading }
        error={ this.state.error }
        currentParking={ this.state.currentParking }
        currentParkingId={ this.state.currentParkingId }
        currentParkingOpinions={ this.state.currentParkingOpinions }
        parkingImages={ this.state.parkingImages }
        comments={ this.state.comments }
        loadingAddress={ this.state.loadingAddress }
        loadingAddressError={ this.state.loadingAddressError }
        currentUser={ this.state.currentUser }
        currentUserIsAuthorized={ this.state.currentUserIsAuthorized }
        onEditLocation={ this.onEditLocation }
        onDeleteParking={ this.onDeleteParking }
        onSlideParkingImage={ this.onSlideParkingImage }
        onAuthorizationRequired={ this.onAuthorizationRequired }
        onPostParkingImage={ this.onPostParkingImage }
        cloudinaryConfig={ config.cloudinary }
        actions={ this.getFlux().actions }
      />
    );
  }
});

module.exports = ParkingContainer;
