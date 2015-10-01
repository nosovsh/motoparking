var React = require("react");
var routes = require("./routes");

// Require React-Router
var Router = require("react-router");

var analytics = require("./utils/analytics");

window.React = React; // For chrome dev tool support

var flux = require("./fluxy");

var moment = require("moment");
moment.locale("ru");

require("normalize.css/normalize.css");
require("styles/style.css");


Router.run(routes, Router.HistoryLocation, function(Handler, state) {
  React.render(<Handler flux={ flux }/>, document.body);
  analytics.pageView(state.path);
});
