var React = require("react/addons");

require("./style.css");


var Icon = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        fontSize: React.PropTypes.string
    },

    render: function () {
        var classes = {};
        classes["icon-" + this.props.name] = true;
        var style = {
            "font-size": this.props.fontSize ? this.props.fontSize : "initial"
        };
        return (
            <i className={ React.addons.classSet(classes) } style={ style }/>
        );
    }
});

module.exports = Icon;
