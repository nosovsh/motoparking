var React = require("react");

require("./Row.css");


var Row = React.createClass({
  propTypes: {
    children: React.PropTypes.node
  },

  render: function() {
    return (
      <div className="Row">
        { this.props.children }
      </div>
    );
  }

});

module.exports = Row;