var React = require("react");

require("./style.css");

// Require React-Router
var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;


var Map = React.createClass({
	render: function() {
		return <div>
			map
			<Link to='Parking'>Padrking</Link>
			<Link to='Default'>Default</Link>


		</div>;
	}
});
module.exports = Map;
