var React = require("react");
var classNames = require("classnames");

require("./ControlButton.css");

var Controls = React.createClass({
  propTypes: {
    isRound: React.PropTypes.bool,
    children: React.PropTypes.array
  },

  getDefaultProps: function() {
    return {
      isRound: false
    };
  },

  render: function() {
    return (
      <div className={ classNames("ControlButton", this.props.isRound && "ControlButton_isRound") }
        onClick={ this.onPlusClick }>
        { this.props.children }
      </div>
    );
  }
});

module.exports = Controls;
