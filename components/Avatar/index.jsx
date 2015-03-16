var React = require("react");

require("./style.css");

var placeholder = "/static/test/predator.svg"


var Avatar = React.createClass({
    propTypes: {
        user: React.PropTypes.object.isRequired
    },
    render: function () {
        var image = this.props.user.image || placeholder;
        return (
            <img className="Avatar" src={ image } { ...this.props }/>
        );
    }
});

module.exports = Avatar;
