var React = require("react/addons");

require("./style.css");


var ButtonRow = React.createClass({
    propTypes: {
        selected: React.PropTypes.bool,
        bordered: React.PropTypes.bool,
        color: React.PropTypes.string,
        height: React.PropTypes.string
    },
    getDefaultProps: function () {
        return {
            selected: false,
            bordered: false
        };
    },
    render: function () {
        var classes = {
            ButtonRow: true,
            ButtonRow__selected: this.props.selected,
            ButtonRow_bordered: this.props.bordered
        };
        if (this.props.color)
            classes["ButtonRow_color_" + this.props.color] = true;
        if (this.props.height)
            classes["ButtonRow_height_" + this.props.height] = true;
        return (
            <div className={ React.addons.classSet(classes) } onClick={ this.props.callback }>{ this.props.children }</div>
        )
    }
});

module.exports = ButtonRow;
