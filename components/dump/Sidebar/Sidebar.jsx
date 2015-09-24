var React = require("react/addons");

require("./Sidebar.css");

var Sidebar = React.createClass({
  propTypes: {
    children: React.PropTypes.node
  },

  render: function() {
    return (
      <div className="sidebar__wrapper" >
        <div className="sidebar__content">
          { this.props.children }
        </div>
      </div>
    );
  }
});

module.exports = Sidebar;
