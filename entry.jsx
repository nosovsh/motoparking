var React = require("react");
var routes = require("./routes");

// Require React-Router
var Router = require("react-router");

var analytics = require("./utils/analytics");

window.React = React; // For chrome dev tool support

var flux = require("./fluxy");

Router.run(routes, Router.HistoryLocation, function(Handler, state) {
  React.render(<Handler flux={ flux }/>, document.body);
  analytics.pageView(state.path);
});

