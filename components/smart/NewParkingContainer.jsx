var React = require("react");
var Fluxxor = require("fluxxor");

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var NewParking = require("../dump/NewParking/NewParking");


var NewParkingContainer = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ParkingStore")],

  componentDidMount: function() {
    this.getFlux().actions.newParking();
  },

  componentWillReceiveProps: function(nextProps) { // eslint-disable-line no-unused-vars
    this.getFlux().actions.newParking();
  },

  onIsMotoQuestionCallback: function(value) {
    this.getFlux().actions.newParkingUpdateData({isSecure: "yes", isMoto: value});
  },

  onNewParkingDone: function() {
    var store = this.getFlux().store("ParkingStore");
    this.getFlux().actions.saveNewParking(store.newParking);
  },

  onPriceChange: function(dictWithPrices) {
    this.getFlux().actions.newParkingUpdateData(dictWithPrices);
  },

  getStateFromFlux: function() {
    var store = this.getFlux().store("ParkingStore");

    return {
      newParking: store.newParking,
      savingNewParking: store.savingNewParking
    };
  },

  render: function() {
    return (
      <NewParking
        newParking={ this.state.newParking }
        savingNewParking={ this.state.savingNewParking }
        onIsMotoQuestionCallback={ this.onIsMotoQuestionCallback }
        onNewParkingDone={ this.onNewParkingDone }
        onPriceChange={ this.onPriceChange }/>
    );
  }
});

module.exports = NewParkingContainer;
