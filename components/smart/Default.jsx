var React = require("react");
var Fluxxor = require("fluxxor");

var FluxMixin = Fluxxor.FluxMixin(React);

var Default = React.createClass({
  mixins: [FluxMixin],

  componentDidMount: function() {
    this.getFlux().actions.unselectCurrentParking();
  },

  componentWillReceiveProps: function() {
    this.getFlux().actions.unselectCurrentParking();
  },

  render: function() {
    return <div></div>;
  }
});

module.exports = Default;
