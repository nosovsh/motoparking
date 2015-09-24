var React = require("react");

require("./Avatar.css");

var placeholder = require("./placeholder.svg");

var Avatar = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
    size: React.PropTypes.oneOf("small", "big")
  },

  render: function() {
    var image = this.props.user.image || placeholder;
    var modifierClass = "Avatar_size_" + this.props.size;
    var classes = {
      "Avatar": true
    };
    classes[modifierClass] = true;
    return (
      <img className={ React.addons.classSet(classes) } src={ image }/>
    );
  }
});

module.exports = Avatar;
