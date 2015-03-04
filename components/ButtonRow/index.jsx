var React = require("react/addons");

require("./style.css");


var ButtonRow = React.createClass({
    propTypes: {
        text: React.PropTypes.string.isRequired,
        selected: React.PropTypes.bool
    },
    render: function () {
        var classes = {
            ButtonRow: true,
            ButtonRow__selected: this.props.selected
        };
        return (
            <div className={ React.addons.classSet(classes) } onClick={ this.props.callback }>{ this.props.text }</div>
        )
    }
});

module.exports = ButtonRow;
