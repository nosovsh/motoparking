var React = require("react");

require("./Controls.css");

var Controls = React.createClass({
  propTypes: {
    isSecondary: React.PropTypes.bool,
    children: React.PropTypes.array
  },

  getDefaultProps: function() {
    return {
      isSecondary: false
    };
  },

  render: function() {
    var classes1 = {
      "controls__wrapper": true,
      "controls__wrapper_secondary": this.props.isSecondary
    };
    var classes2 = {
      "controls__content": true,
      "controls__content_secondary": this.props.isSecondary
    };
    return (
      <div className={ React.addons.classSet(classes1) }>
        <div className={ React.addons.classSet(classes2) }>
          { this.props.children }
        </div>
      </div>
    );
  }
});

module.exports = Controls;
