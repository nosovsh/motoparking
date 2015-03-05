var React = require("react/addons");

require("./style.css");


var TextInput = React.createClass({
    propTypes: {
    },
    render: function () {
        var classes = {
            TextInput: true
        };
        return (
            <input type="text" className={ React.addons.classSet(classes) } placeholder="Не знаю" { ...this.props }/>
        )
    }
});

module.exports = TextInput;
