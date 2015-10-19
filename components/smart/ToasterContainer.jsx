var React = require("react");
var Fluxxor = require("fluxxor");

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Toaster = require("../dump/Toaster/Toaster");


var ToasterContainer = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ToastStore")],

  getStateFromFlux: function() {
    var toastStore = this.getFlux().store("ToastStore");
    return {
      toasts: toastStore.toasts
    };
  },

  render: function() {
    return (
      <Toaster toasts={ this.state.toasts } />
    );
  }
});

module.exports = ToasterContainer;
