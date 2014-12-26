var React = require("react");
var Router = require('react-router');

require("./style.css");

var Parking = React.createClass({
  	mixins: [Router.State],
	render: function() {
		return <div>
			Parking: { this.getParams().id }
		</div>;
	}
});
module.exports = Parking;
