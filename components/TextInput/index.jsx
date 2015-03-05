var React = require("react/addons");

require("./style.css");


var TextInput = React.createClass({
    propTypes: {
        text: React.PropTypes.string.isRequired,
        callback: React.PropTypes.func.isRequired,
        selected: React.PropTypes.bool
    },
    render: function () {
        var classes = {
            TextInput: true,
            button__selected: this.props.selected
        };
        return (
            <input type="text" className={ React.addons.classSet(classes) } placeholder="Не знаю"/>
        )
    }
});

module.exports = TextInput;
