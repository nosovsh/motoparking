var React = require("react/addons");
var classNames = require("classnames");

require("./ButtonRow.css");


var ButtonRow = React.createClass({
  propTypes: {
    callback: React.PropTypes.func.isRequired,
    selected: React.PropTypes.bool,
    bordered: React.PropTypes.bool,
    color: React.PropTypes.string,
    height: React.PropTypes.string,
    align: React.PropTypes.string,
    children: React.PropTypes.node
  },
  getDefaultProps: function() {
    return {
      selected: false,
      bordered: false
    };
  },
  render: function() {
    var classes = [
      "ButtonRow",
      this.props.selected && "ButtonRow__selected",
      this.props.bordered && "ButtonRow_bordered",
      this.props.color && "ButtonRow_color_" + this.props.color,
      this.props.height && "ButtonRow_height_" + this.props.height,
      this.props.align && "ButtonRow_align_" + this.props.align
    ];
    return (
      <div
        className={ classNames(classes) }
        onClick={ this.props.callback }>
          { this.props.children }
      </div>
    );
  }
});

module.exports = ButtonRow;
