var React = require("react/addons");
var Fluxxor = require("fluxxor");
var TimeoutTransitionGroup = require("react-components/js/timeout-transition-group");
var Router = require("react-router");

var Map = require("./Map/map");
var ToasterContainer = require("./ToasterContainer");
var ControlsContainer = require("./ControlsContainer");

var FluxMixin = Fluxxor.FluxMixin(React);


var Application = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
    routes: React.PropTypes.array
  },

  mixins: [FluxMixin, Router.State],

  render: function() {
    return (
      <div>
        <Map/>
        <ControlsContainer />
        <TimeoutTransitionGroup
          enterTimeout={500}
          leaveTimeout={500}
          transitionName="page"
          className="one-more-wrapper">
          { React.Children.map(this.props.children, function(child) {
            return React.cloneElement(child, { key: this.props.routes[this.props.routes.length - 1].path });
          }.bind(this)) }
        </TimeoutTransitionGroup>
        <ToasterContainer />
      </div>
    );
  }
});

module.exports = Application;
