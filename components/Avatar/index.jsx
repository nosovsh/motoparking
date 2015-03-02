var React = require("react");

require("./style.css");


var Avatar = React.createClass({
    propTypes: {
        user: React.PropTypes.object.isRequired
    },
    render: function () {
        return (
            <img className="Avatar" src={ this.props.user.pictureUrl } />
        );
    }
});

module.exports = Avatar;
