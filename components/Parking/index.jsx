var React = require("react");
var Router = require('react-router');
var Link = Router.Link;

require("./style.css");

var Parking = React.createClass({
  	mixins: [Router.State],
	render: function() {
		return (
			<div className="sidebar__wrapper">
				<div className="sidebar__content">
					Parking: { this.getParams().id }
					<br/>

					<Link to="Default">закрыть</Link>
				</div>
			</div>
		)
	}
});

module.exports = Parking;
