var React = require("react");

require("./style.css");


var Avatar = React.createClass({
    propTypes: {
        user: React.PropTypes.object.isRequired
    },
    render: function () {
        return (
            <div className="Avatar" key={ this.props.user._id }>
                <img src={ this.props.user.pictureUrl } />
            </div>
        );
    }
});

module.exports = Avatar;
