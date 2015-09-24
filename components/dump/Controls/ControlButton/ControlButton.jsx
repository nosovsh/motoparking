var React = require("react");

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
    var classes = {
      "ControlButton": true,
      "ControlButton_isRound": this.props.isRound
    };
    return (
      <div className={ React.addons.classSet(classes) } onClick={ this.onPlusClick }>
        { this.props.children }
      </div>
    );
  }
});

module.exports = Controls;
