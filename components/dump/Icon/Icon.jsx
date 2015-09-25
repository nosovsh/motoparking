var React = require("react/addons");
var classNames = require("classnames");

require("./Icon.css");
require("./animation.css");


var Icon = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    additionalClasses: React.PropTypes.array,
    animation: React.PropTypes.string
  },

  render: function() {
    return (
      <i className={ classNames([
        "icon-" + this.props.name,
        this.props.animation ? "animate-" + this.props.animation : null
      ].concat(this.props.additionalClasses)) } {...this.props}/>
    );
  }
});

module.exports = Icon;
