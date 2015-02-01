var React = require("react");

require("./style.css");


var Button = React.createClass({
    propTypes: {
        text: React.PropTypes.string.isRequired,
        callback: React.PropTypes.func.isRequired
    },
    render: function () {
        return (
            <div className="button" onClick={ this.props.callback }>{ this.props.text }</div>
        )
    }
});

module.exports = Button;
