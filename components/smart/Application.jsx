var React = require("react/addons");
var Fluxxor = require("fluxxor");
var TimeoutTransitionGroup = require("react-components/js/timeout-transition-group");

var Map = require("./Map/map");
var ToasterContainer = require("./ToasterContainer");

var Router = require("react-router");
var RouteHandler = Router.RouteHandler;

var FluxMixin = Fluxxor.FluxMixin(React);

var ControlsHandler = require("./ControlsHandler");

var moment = require("moment");
moment.locale("ru");

require("normalize.css/normalize.css");
require("./style.css");


var Application = React.createClass({
  mixins: [FluxMixin, Router.State],

  getHandlerKey: function() {
    var childDepth = 1;
    return this.getRoutes()[childDepth].name;
  },

  render: function() {
    return (
      <div>
        <Map/>
        <ControlsHandler />
        <TimeoutTransitionGroup
          enterTimeout={500}
          leaveTimeout={500}
          transitionName="page"
          className="one-more-wrapper">
          <RouteHandler  key={this.getHandlerKey()} />
        </TimeoutTransitionGroup>
        <ToasterContainer />
      </div>
    );
  }
});

module.exports = Application;
