var React = require("react/addons");

require("./Sidebar.css");

var Sidebar = React.createClass({
  propTypes: {
    children: React.PropTypes.node
  },

  render: function() {
    return (
      <div className="Sidebar" >
        <div className="Sidebar__Content">
          { this.props.children }
        </div>
      </div>
    );
  }
});

module.exports = Sidebar;
