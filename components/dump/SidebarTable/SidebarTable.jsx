var React = require("react");

require("./SidebarTable.css");


var SidebarTable = React.createClass({
  propTypes: {
    data: React.PropTypes.array
  },

  render: function() {
    return (
      <div className="SidebarTable">
        <div className="SidebarTable__Cell">
          <div className="SidebarTable__Cell__Label">
            { this.props.data[0].label }
          </div>
          <div className="SidebarTable__Cell__Value">
            { this.props.data[0].value }
          </div>
        </div>

        <div className="SidebarTable__Cell">
          <div className="SidebarTable__Cell__Label">
            { this.props.data[1].label }
          </div>
          <div className="SidebarTable__Cell__Value">
            { this.props.data[1].value }
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SidebarTable;
