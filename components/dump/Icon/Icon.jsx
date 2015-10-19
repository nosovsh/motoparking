var React = require("react");
var classNames = require("classnames");

require("./Icon.css");
require("./fontello.css");


var Icon = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    additionalClasses: React.PropTypes.array,
    animation: React.PropTypes.string,
    isExpandOnHover: React.PropTypes.bool
  },

  render: function() {
    return (
      <i className={ classNames([
        "icon-" + this.props.name,
        this.props.animation ? "animate-" + this.props.animation : null,
        this.props.isExpandOnHover && "Icon_isExpandOnHover"
      ].concat(this.props.additionalClasses)) } {...this.props}/>
    );
  }
});

module.exports = Icon;
