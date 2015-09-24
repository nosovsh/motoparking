var React = require("react/addons"),
  Fluxxor = require("fluxxor"),
  TimeoutTransitionGroup = require("react-components/js/timeout-transition-group"),
  _ = require("lodash");

var FluxMixin = Fluxxor.FluxMixin(React),
  StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Toaster = require("../Toaster");

var ToasterContainer = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin("ToastStore")],

  getStateFromFlux: function() {
    var toastStore = this.getFlux().store("ToastStore");
    return {
      toasts: toastStore.toasts
    };
  },

  render: function () {
    return (
      <Toaster toasts={ this.state.toasts } />
    );
  }
});

module.exports = ToasterContainer;
