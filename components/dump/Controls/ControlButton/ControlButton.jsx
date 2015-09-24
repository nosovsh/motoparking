var React = require("react");
var classNames = require("classnames");

require("./ControlButton.css");

var ControlButton = React.createClass({
  propTypes: {
    isRound: React.PropTypes.bool,
    children: React.PropTypes.node,
    onClick: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      isRound: false
    };
  },

  render: function() {
    return (
      <div className={ classNames("ControlButton", this.props.isRound && "ControlButton_isRound") }
        onClick={ this.props.onClick }>
        { this.props.children }
      </div>
    );
  }
});

module.exports = ControlButton;
