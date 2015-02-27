var React = require("react/addons");

require("./style.css");


var Photo = React.createClass({
    propTypes: {
        url: React.PropTypes.string.isRequired
    },
    render: function () {
        var classes = {
            Photo: true
        };
        var style = {
            "background-image": "url('" + this.props.url + "')"
        };
        return (
            <div style={ style } className={ React.addons.classSet(classes) } />
        )
    }
});

module.exports = Photo;
