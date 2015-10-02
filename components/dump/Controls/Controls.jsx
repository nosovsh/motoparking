var React = require("react");
var classNames = require("classnames");

require("./Controls.css");

var Controls = React.createClass({
  propTypes: {
    isSecondary: React.PropTypes.bool,
    children: React.PropTypes.node
  },

  getDefaultProps: function() {
    return {
      isSecondary: false
    };
  },

  render: function() {
    var classes1 = {
      "Controls": true,
      "Controls_secondary": this.props.isSecondary
    };
    var classes2 = {
      "Controls__Inner": true,
      "Controls__Inner_secondary": this.props.isSecondary
    };
    return (
      <div className={ classNames(classes1) }>
        <div className={ classNames(classes2) }>
          { this.props.children }
        </div>
      </div>
    );
  }
});

module.exports = Controls;
