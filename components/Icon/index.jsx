var React = require("react/addons");

require("./style.css");


var Icon = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        additionalClasses: React.PropTypes.array
    },

    render: function () {
        var classes = {};
        _.map(this.props.additionalClasses, function(el) {
            classes[el] = true;
        });
        classes["icon-" + this.props.name] = true;

        return (
            <i className={ React.addons.classSet(classes) } {...this.props}/>
        );
    }
});

module.exports = Icon;
