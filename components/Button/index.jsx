var React = require("react/addons");

require("./style.css");


var Button = React.createClass({
    propTypes: {
        text: React.PropTypes.string.isRequired,
        callback: React.PropTypes.func.isRequired,
        selected: React.PropTypes.bool
    },
    render: function () {
        var classes = {
            button: true,
            button__selected: this.props.selected
        }
        return (
            <div className={ React.addons.classSet(classes) } onClick={ this.props.callback }>{ this.props.text }</div>
        )
    }
});

module.exports = Button;
