var React = require("react");
var classNames = require("classnames");

require("./Avatar.css");

var placeholder = require("./placeholder.svg");

var Avatar = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
    size: React.PropTypes.oneOf(["small", "medium", "big"]),
    border: React.PropTypes.oneOf(["thin"])
  },

  getDefaultProps: function() {
    return {
      size: "medium"
    };
  },

  render: function() {
    var image = this.props.user.image || placeholder;
    return (
      <img className={ classNames(
        "Avatar",
        "Avatar_size_" + this.props.size,
        this.props.border && "Avatar_border_" + this.props.border
      ) } src={ image }/>
    );
  }
});

module.exports = Avatar;
