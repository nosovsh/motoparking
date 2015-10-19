var React = require("react");
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

  /**
   * Returns key that should be assigned to `this.props.children`.
   * Users and parkings have the same key because there should be no animation between them.
   *
   * @returns {*}
   */
  getKey: function() {
    var sidebarPaths = [
      "/p/:id",
      "/u/:userId"
    ];
    var path = this.props.routes[this.props.routes.length - 1].path;
    if (sidebarPaths.indexOf(path) !== -1) {
      return "sidebar";
    }
    return path;
  },

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
            return React.cloneElement(child, { key: this.getKey() });
          }.bind(this)) }
        </TimeoutTransitionGroup>
        <ToasterContainer />
      </div>
    );
  }
});

module.exports = Application;
