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
			<Link to='Parking' params={{id:1}}>Parking 1</Link><br />
			<Link to='Parking' params={{id:2}}>Parking 2</Link><br />
			<Link to='Parking' params={{id:3}}>Parking 3</Link><br />
			<Link to='Default'>Default</Link>
		</div>;
	}
});
module.exports = Map;
