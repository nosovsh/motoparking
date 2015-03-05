var React = require("react/addons");

require("./style.css");


var ButtonRow = React.createClass({
    propTypes: {
        selected: React.PropTypes.bool
    },
    render: function () {
        var classes = {
            ButtonRow: true,
            ButtonRow__selected: this.props.selected
        };
        return (
            <div className={ React.addons.classSet(classes) } onClick={ this.props.callback }>{ this.props.children }</div>
        )
    }
});

module.exports = ButtonRow;
