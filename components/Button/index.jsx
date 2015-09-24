var React = require("react/addons");
var classNames = require("classnames");

require("./style.css");


var Button = React.createClass({
  propTypes: {
    text: React.PropTypes.string.isRequired,
    callback: React.PropTypes.func.isRequired,
    selected: React.PropTypes.bool
  },
  render: function() {
    return (
      <div
        className={ classNames("button", this.props.selected && "button__selected") }
        onClick={ this.props.callback }>
          { this.props.text }
      </div>
    );
  }
});

module.exports = Button;
