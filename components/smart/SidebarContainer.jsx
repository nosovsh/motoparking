var React = require("react/addons");
var Fluxxor = require("fluxxor");

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Sidebar = require("../dump/Sidebar/Sidebar");
var EditLocation = require("../dump/EditLocation/EditLocation");


var SidebarContainer = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
    location: React.PropTypes.string
  },

  mixins: [FluxMixin, StoreWatchMixin("ParkingStore")],

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

  getStateFromFlux: function() {
    var parkingStore = this.getFlux().store("ParkingStore");

    return {
      editingLocation: parkingStore.editingLocation
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
      <Sidebar location={ this.props.location }>
        { this.props.children}
      </Sidebar>
    );
  }
});

module.exports = SidebarContainer;
