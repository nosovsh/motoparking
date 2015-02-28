var React = require("react/addons");

require("./style.css");


var Icon = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    render: function () {
        var classes = {};
        classes["icon-" + this.props.name] = true;

        return (
            <i className={ React.addons.classSet(classes) } {...this.props}/>
        );
    }
});

module.exports = Icon;
