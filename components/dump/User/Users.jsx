var React = require("react");

var UserSmall = require("./UserSmall");

require("./Users.css");


var Users = React.createClass({
  propTypes: {
    users: React.PropTypes.object,
    usersIds: React.PropTypes.array
  },

  render: function() {
    return (
      <div className="Users">
        <div className="Users__Topbar" />
        { this.props.usersIds.length ? (
          <div>
            { this.props.usersIds.map(function(userId) {
              return <UserSmall user={ this.props.users[userId] } key={ userId }/>
            }.bind(this))}
          </div>
        ) : <div>Loading...</div> }
      </div>
    );
  }
});

module.exports = Users;
